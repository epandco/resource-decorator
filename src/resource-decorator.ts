import 'reflect-metadata';

import { ParameterEntry } from './parameter-entry';
import { ResourceRouteMetadata } from './resource-route-metadata';
import { ResourceOptions } from './resource-options';
import { ResourceRouteOptions } from './resource-route-options';
import { HttpMethod } from './http-method';
import { ResourceRenderer } from './resource-renderer';
import { ResourceType } from './resource-type';
import { RedirectResponse } from './redirect-response';
import { ApiResponse } from './api-response';
import { CookieResponse } from './cookie-response';
import { FileResponse } from './file-response';
import { TemplateResponse } from './template-response';


// throws an exception if wrong
function validatePath(path: string): void {
  if (path.length != 0 && !path.startsWith('/')) {
    throw new Error(`Path: ${path} MUST start with a slash`);
  }

  if (path.length != 0 && path.endsWith('/')) {
    throw new Error(`Path: ${path} MUST NOT end with a slash`);
  }
}

function updateMetadata(key: string, target: any, process: (data: any) => any) {
  const data = Reflect.getMetadata(key, target);

  const newData = process(data);

  Reflect.deleteMetadata(key, target);
  Reflect.defineMetadata(key, newData, target);
}

function storeParameterEntry(name: string, type: string) {
  return (target: any, key: string, index: number) => {
    const metadataKey = `${type}_${key}_parameters`;
    updateMetadata(metadataKey, target, (data) => {
      const indices: object[] = data || [];
      indices.push({
        name: name,
        index: index  
      });

      return indices;
    });
  };
}

/**
 * Restricts the input to a route handler to either being a string or an object
 * if things are passed in through query or path params it comes in as a string
 * otherwise assume body and it being an object
 */
type RouteParams = object | string;

/**
 * This type defines what an API resource route handler should look like.
 */
type ApiRouteHandler = (...args: RouteParams[]) => Promise<ApiResponse | CookieResponse | void>;

/**
 * This type defines what an API resource route handler should look like.
 */
type FileRouteHandler = (...args: RouteParams[]) => Promise<FileResponse>;
/**
 * This type defines what an Template resource route handler should look like.
 */
type TemplateRouteHandler = (...args: RouteParams[]) => Promise<TemplateResponse | RedirectResponse>;

function routeBuilder<Handler extends ApiRouteHandler | TemplateRouteHandler | FileRouteHandler>(method: HttpMethod, resourceType: ResourceType, resourceRouteOptions?: ResourceRouteOptions) {
  let path = '';
  let resourceRenderer: ResourceRenderer | undefined;

  if (resourceRouteOptions) {
    path = resourceRouteOptions.path || '';

    // if a custom render builder set then use it otherwise keep the default that's passed in.
    resourceRenderer = resourceRouteOptions.resourceRenderer || undefined;
  }

  return <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<Handler>) => {
    if (!descriptor.value) {
      throw new Error('Invalid property descriptor');
    }

    validatePath(path);

    const queryParams: ParameterEntry[] = Reflect.getMetadata(`query_${key}_parameters`, target) || [];
    const pathParams: ParameterEntry[] = Reflect.getMetadata(`path_${key}_parameters`, target) || [];
    const bodyParams: ParameterEntry[] = Reflect.getMetadata(`body_${key}_parameters`, target) || [];
    const localParams: ParameterEntry[] = Reflect.getMetadata(`local_${key}_parameters`, target) || [];

    const totalParameters = queryParams.length + pathParams.length + localParams.length + bodyParams.length;

    if (descriptor.value && totalParameters != descriptor.value.length) {
      throw new Error(`The total number of parameters for method ${key} must add up to the total number (${totalParameters}) of path, query, and body parameters.`);
    }

    let bodyParam: ParameterEntry | null = null;
    if (bodyParams.length > 1) {
      throw new Error(`Method ${key} defined more than one body parameter. At most one is allowed`);
    }
    else if (bodyParams.length == 1) {
      bodyParam = bodyParams[0];
    }

    const metaData: ResourceRouteMetadata = {
      resourceType: resourceType,
      path: path,
      method: method,
      methodKey: key,
      queryParams: queryParams,
      pathParams: pathParams,
      bodyParam: bodyParam,
      localParams: localParams,
      totalParameters: totalParameters,
      resourceRenderer: resourceRenderer
    };

    Reflect.defineMetadata(`route-${method}-${path}`, metaData, target);

    return descriptor;
  };
}

/**
 * Used to decorate a class as a resource to be used with
 * the ResourceGenerator in this module
 * 
 * This will generate a very opinonated version of HTTP resource.
 * @see the get/put/post/del and template decorators for more details
 * 
 * @param resourceOptions @see ResourceOptions for details
 */
export function resource(resourceOptions?: ResourceOptions) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    
    // adding version to act as a marker so the resource generator can
    // quickly tell if the passed in type was decorated correctly
    Reflect.defineMetadata('resource-generator-version', 'v1', constructor.prototype);

    if (resourceOptions) {
      const basePath = resourceOptions.basePath;
      if (basePath) {
        validatePath(basePath);
        Reflect.defineMetadata('base-path', basePath, constructor.prototype);
      }
    }

    return constructor;
  };
}

/**
 * Generates HTTP GET route that renders a given template with the following
 * semantics:
 * 
 *  - Any value including null and undefined will be treated as 200 and 
 *    passed as the model to the specified nunjucks template.
 *
 *  - If a ResourceError is thrown it will be treated as 400 and the error
 *    will be passed to the nunjucks template specified by NUNJUCKS_TEMPLATE_ERROR
 *    environment variable which is rendered.
 *
 *  - A ResourceNotFound being thrown results in a 404 and the template specified
 *    by NUNJUCKS_TEMPLATE_NOT_FOUND environment variable is rendered.
 *
 *  - Any other error thrown will result in 500 being logged to console
 *    and generic error message is passed to the template specified by
 *    NUNJUCKS_TEMPLATE_UNEXPECTED_ERROR environment variable which is rendered.
 * 
 * @param template the template name (including path if applicable) to the template relative to the
 * path defined by the NUNJUCKS_TEMPLATE_BASE_PATH environment variable.
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function template(resourceRouteOptions?: ResourceRouteOptions) {
  if (!template || template.length == 0) {
    throw Error('Must specify a template');
  }

  return routeBuilder<TemplateRouteHandler>(HttpMethod.GET, ResourceType.TEMPLATE, resourceRouteOptions);
}

/**
 * Generates a HTTP GET route with the following semantics:
 * 
 *  - Any non null or undefeind value returned from a function is 
 *    treated as 200 rendered as JSON via JSON.stringify.
 * 
 *  - Any function that returns null or undefined will treated as 201
 *    with no body.
 *  
 *  - If a ResourceError is thrown it will be treated as 400 and it's contents
 *    rendered as JSON via JSON.stringify.
 * 
 *  - A ResourceNotFound being thrown results in a 404 with no body
 * 
 *  - Any other error thrown will result in 500 being logged to console
 *    and a generic error message back to the client
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function get(resourceRouteOptions?: ResourceRouteOptions) {
  return routeBuilder<ApiRouteHandler>(HttpMethod.GET, ResourceType.API, resourceRouteOptions);
}

/**
 * Generates a HTTP GET route with the following semantics:
 * 
 *  - Any non null or undefeind value returned from a function is 
 *    treated as 200 rendered as JSON via JSON.stringify.
 * 
 *  - Any function that returns null or undefined will treated as 201
 *    with no body.
 *  
 *  - If a ResourceError is thrown it will be treated as 400 and it's contents
 *    rendered as JSON via JSON.stringify.
 * 
 *  - A ResourceNotFound being thrown results in a 404 with no body
 * 
 *  - Any other error thrown will result in 500 being logged to console
 *    and a generic error message back to the client
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function getFile(resourceRouteOptions?: ResourceRouteOptions) {
  return routeBuilder<FileRouteHandler>(HttpMethod.GET, ResourceType.FILE, resourceRouteOptions);
}


/**
 * Generates a HTTP POST route with the following semantics:
 *  - Any non null or undefeind value returned from a function is 
 *    treated as 200 rendered as JSON via JSON.stringify.
 * 
 *  - Any function that returns null or undefined will treated as 201
 *    with no body.
 *  
 *  - If a ResourceError is thrown it will be treated as 400 and it's contents
 *    rendered as JSON via JSON.stringify.
 * 
 *  - A ResourceNotFound being thrown results in a 404 with no body
 * 
 *  - Any other error thrown will result in 500 being logged to console
 *    and a generic error message back to the client
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function post(resourceRouteOptions?: ResourceRouteOptions) {
  return routeBuilder<ApiRouteHandler>(HttpMethod.POST, ResourceType.API, resourceRouteOptions);
}

/**
 * Generates a HTTP PUT route with the following semantics:
 *  - Any non null or undefeind value returned from a function is 
 *    treated as 200 rendered as JSON via JSON.stringify.
 * 
 *  - Any function that returns null or undefined will treated as 201
 *    with no body.
 *  
 *  - If a ResourceError is thrown it will be treated as 400 and it's contents
 *    rendered as JSON via JSON.stringify.
 * 
 *  - A ResourceNotFound being thrown results in a 404 with no body
 * 
 *  - Any other error thrown will result in 500 being logged to console
 *    and a generic error message back to the client
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function put(resourceRouteOptions?: ResourceRouteOptions) {
  return routeBuilder<ApiRouteHandler>(HttpMethod.PUT, ResourceType.API, resourceRouteOptions);
}

/**
 * Generates a HTTP DELETE route with the following semantics:
 *  - Any non null or undefeind value returned from a function is 
 *    treated as 200 rendered as JSON via JSON.stringify.
 * 
 *  - Any function that returns null or undefined will treated as 201
 *    with no body.
 *  
 *  - If a ResourceError is thrown it will be treated as 400 and it's contents
 *    rendered as JSON via JSON.stringify.
 * 
 *  - A ResourceNotFound being thrown results in a 404 with no body
 * 
 *  - Any other error thrown will result in 500 being logged to console
 *    and a generic error message back to the client
 * 
 * @param resourceRouteOptions the options for this route @see ResourceRouteOptions
 */
export function del(resourceRouteOptions?: ResourceRouteOptions) {
  return routeBuilder<ApiRouteHandler>(HttpMethod.DELETE, ResourceType.API, resourceRouteOptions);
}

/**
 * A parameter decorator used to specify which query string variable should be mapped to the decorated parameter
 * 
 * @param name the name of the query string parameter to map
 */
export function query(name: string) {
  return storeParameterEntry(name, 'query');
}

/**
 * A parameter decorator used to specify which path variable should be mapped to the decorated parameter. Note this MUST
 * exist in the path for the decorator to work.
 * 
 * @param name the name of the path parameter to map
 */
export function path(name: string) {
  return storeParameterEntry(name, 'path');
}

/**
 * A parameter decorator used to specify which local variable on the request should be mapped to the
 * decorated parameter. Middleware will set various properties on req.local and this allows the resource to access
 * the data middleware has set.
 * 
 * @param name the name of the path parameter to map
 */
export function local(name: string) {
  return storeParameterEntry(name, 'local');
}

/**
 * A parameter decorator used to specify the request body should be mapped to the decorated parameter. 
 * 
 * @param name the name of the path parameter to map
 */
export function body() {
  return storeParameterEntry('body', 'body');
}
