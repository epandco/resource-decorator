import { ApiResponse } from './api-response';
import { TemplateResponse } from './template-response';
import { ResourceError } from './resource-error';
import { ResourceType } from './resource-type';
export interface ResourceRenderer {
    contentType: string;
    ok(model?: ApiResponse | TemplateResponse): Promise<string>;
    notFound(): Promise<string>;
    expectedError(err: ResourceError): Promise<string>;
    fatalError(msg: string): Promise<string>;
    unauthorized(): Promise<string>;
}
/**
 * Allows external packages to register a default renderer for a given type.
 */
export declare function registerDefaultRenderer(resourceType: ResourceType, resourceRenderer: ResourceRenderer): void;
/**
 * Allows an external package to get the default renderer for a given type. This will allow packages to configure
 * default renderers and other packages to fetch them.
 *
 * For example one package may define how to render a template ResourceType via the registerDefaultRenderer. Then
 * a second package maybe invoked after that point to generate a resource in which case it can call getDefaultRender
 * to fetch a rendere for given type and get the one registered prior by the first package.
 */
export declare function getDefaultRenderer(resourceType: ResourceType): ResourceRenderer;
