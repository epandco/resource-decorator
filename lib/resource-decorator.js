"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const http_method_1 = require("./http-method");
const resource_type_1 = require("./resource-type");
// throws an exception if wrong
function validatePath(path) {
    if (path.length != 0 && !path.startsWith('/')) {
        throw new Error(`Path: ${path} MUST start with a slash`);
    }
    if (path.length != 0 && path.endsWith('/')) {
        throw new Error(`Path: ${path} MUST NOT end with a slash`);
    }
}
function updateMetadata(key, target, process) {
    const data = Reflect.getMetadata(key, target);
    const newData = process(data);
    Reflect.deleteMetadata(key, target);
    Reflect.defineMetadata(key, newData, target);
}
function storeParameterEntry(name, type) {
    return (target, key, index) => {
        const metadataKey = `${type}_${key}_parameters`;
        updateMetadata(metadataKey, target, (data) => {
            const indices = data || [];
            indices.push({
                name: name,
                index: index
            });
            return indices;
        });
    };
}
function routeBuilder(method, resourceType, resourceRouteOptions) {
    let path = '';
    let resourceRenderer;
    if (resourceRouteOptions) {
        path = resourceRouteOptions.path || '';
        // if a custom render builder set then use it otherwise keep the default that's passed in.
        resourceRenderer = resourceRouteOptions.resourceRenderer || undefined;
    }
    return (target, key, descriptor) => {
        if (!descriptor.value) {
            throw new Error('Invalid property descriptor');
        }
        validatePath(path);
        const queryParams = Reflect.getMetadata(`query_${key}_parameters`, target) || [];
        const pathParams = Reflect.getMetadata(`path_${key}_parameters`, target) || [];
        const bodyParams = Reflect.getMetadata(`body_${key}_parameters`, target) || [];
        const localParams = Reflect.getMetadata(`local_${key}_parameters`, target) || [];
        const totalParameters = queryParams.length + pathParams.length + localParams.length + bodyParams.length;
        if (descriptor.value && totalParameters != descriptor.value.length) {
            throw new Error(`The total number of parameters for method ${key} must add up to the total number (${totalParameters}) of path, query, and body parameters.`);
        }
        let bodyParam = null;
        if (bodyParams.length > 1) {
            throw new Error(`Method ${key} defined more than one body parameter. At most one is allowed`);
        }
        else if (bodyParams.length == 1) {
            bodyParam = bodyParams[0];
        }
        const metaData = {
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
function resource(resourceOptions) {
    return (constructor) => {
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
exports.resource = resource;
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
function template(resourceRouteOptions) {
    if (!template || template.length == 0) {
        throw Error('Must specify a template');
    }
    return routeBuilder(http_method_1.HttpMethod.GET, resource_type_1.ResourceType.TEMPLATE, resourceRouteOptions);
}
exports.template = template;
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
function get(resourceRouteOptions) {
    return routeBuilder(http_method_1.HttpMethod.GET, resource_type_1.ResourceType.API, resourceRouteOptions);
}
exports.get = get;
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
function getFile(resourceRouteOptions) {
    return routeBuilder(http_method_1.HttpMethod.GET, resource_type_1.ResourceType.FILE, resourceRouteOptions);
}
exports.getFile = getFile;
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
function post(resourceRouteOptions) {
    return routeBuilder(http_method_1.HttpMethod.POST, resource_type_1.ResourceType.API, resourceRouteOptions);
}
exports.post = post;
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
function put(resourceRouteOptions) {
    return routeBuilder(http_method_1.HttpMethod.PUT, resource_type_1.ResourceType.API, resourceRouteOptions);
}
exports.put = put;
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
function del(resourceRouteOptions) {
    return routeBuilder(http_method_1.HttpMethod.DELETE, resource_type_1.ResourceType.API, resourceRouteOptions);
}
exports.del = del;
/**
 * A parameter decorator used to specify which query string variable should be mapped to the decorated parameter
 *
 * @param name the name of the query string parameter to map
 */
function query(name) {
    return storeParameterEntry(name, 'query');
}
exports.query = query;
/**
 * A parameter decorator used to specify which path variable should be mapped to the decorated parameter. Note this MUST
 * exist in the path for the decorator to work.
 *
 * @param name the name of the path parameter to map
 */
function path(name) {
    return storeParameterEntry(name, 'path');
}
exports.path = path;
/**
 * A parameter decorator used to specify which local variable on the request should be mapped to the
 * decorated parameter. Middleware will set various properties on req.local and this allows the resource to access
 * the data middleware has set.
 *
 * @param name the name of the path parameter to map
 */
function local(name) {
    return storeParameterEntry(name, 'local');
}
exports.local = local;
/**
 * A parameter decorator used to specify the request body should be mapped to the decorated parameter.
 *
 * @param name the name of the path parameter to map
 */
function body() {
    return storeParameterEntry('body', 'body');
}
exports.body = body;
//# sourceMappingURL=resource-decorator.js.map