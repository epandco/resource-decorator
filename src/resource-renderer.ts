import { ResourceContent } from './resource-content';
import { ResourceError } from './resource-error';
import { ResourceType } from './resource-type';
import { ResourceResponseWithCookies } from './resource-response-with-cookies';

export interface ResourceRenderer {
  contentType: string;
  ok(model?: ResourceResponseWithCookies): Promise<string>;
  notFound(): Promise<string>;
  expectedError(err: ResourceError): Promise<string>;
  unexpectedError(msg: string): Promise<string>;
  unauthorized(): Promise<string>;
}


/**
 * A default renderer for API resource types. Since API routes don't need ANY external dependencies
 * to render JSON a default implementation is provided in this package.
 */
class DefaultAPIRenderer implements ResourceRenderer {

  public contentType: string = 'application/json';

  async ok(model?: ResourceContent): Promise<string> {
    if (!model) {
      return '';
    }

    if (!(model instanceof ResourceContent)) {
      throw new Error(`Model must be of type ResourceContent type. Current type is ${typeof model}`);
    }

    return JSON.stringify(model.content);
  }

  async notFound(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async expectedError(err: ResourceError): Promise<string> {
    return JSON.stringify(err);
  }

  async unexpectedError(msg: string): Promise<string> {
    return JSON.stringify(msg);
  }

  async unauthorized(): Promise<string> {
    return 'Not authorized';
  }

}

const renderers = new Map<ResourceType, ResourceRenderer>();

// for API
renderers.set(ResourceType.API, new DefaultAPIRenderer());

/**
 * Allows external packages to register a default renderer for a given type.
 */
export function registerDefaultRenderer(resourceType: ResourceType, resourceRenderer: ResourceRenderer) {
  renderers.set(resourceType, resourceRenderer);
}

/**
 * Allows an external package to get the default renderer for a given type. This will allow packages to configure
 * default renderers and other packages to fetch them.
 * 
 * For example one package may define how to render a template ResourceType via the registerDefaultRenderer. Then 
 * a second package maybe invoked after that point to generate a resource in which case it can call getDefaultRender
 * to fetch a rendere for given type and get the one registered prior by the first package. 
 */
export function getDefaultRenderer(resourceType: ResourceType): ResourceRenderer {
  const value = renderers.get(resourceType);

  if (!value) {
    throw Error(`No renderer defined for resourceType: ${resourceType} please use the registerRenderer method to add one`);
  }

  return value;
}