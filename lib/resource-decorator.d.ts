import 'reflect-metadata';
import { ResourceOptions } from './resource-options';
import { ResourceRouteOptions } from './resource-route-options';
import { RedirectResponse } from './redirect-response';
import { ApiResponse } from './api-response';
import { CookieResponse } from './cookie-response';
import { TemplateResponse } from './template-response';
/**
 * Restricts the input to a route handler to either being a string or an object
 * if things are passed in through query or path params it comes in as a string
 * otherwise assume body and it being an object
 */
declare type RouteParams = object | string;
/**
 * This type defines what an API resource route handler should look like.
 */
declare type ApiRouteHandler = (...args: RouteParams[]) => Promise<ApiResponse | CookieResponse | void>;
/**
 * This type defines what an Template resource route handler should look like.
 */
declare type TemplateRouteHandler = (...args: RouteParams[]) => Promise<TemplateResponse | RedirectResponse>;
/**
 * Used to decorate a class as a resource to be used with
 * the ResourceGenerator in this module
 *
 * This will generate a very opinonated version of HTTP resource.
 * @see the get/put/post/del and template decorators for more details
 *
 * @param resourceOptions @see ResourceOptions for details
 */
export declare function resource(resourceOptions?: ResourceOptions): <T extends new (...args: any[]) => {}>(constructor: T) => T;
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
export declare function template(resourceRouteOptions?: ResourceRouteOptions): <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<TemplateRouteHandler>) => TypedPropertyDescriptor<TemplateRouteHandler>;
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
export declare function get(resourceRouteOptions?: ResourceRouteOptions): <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<ApiRouteHandler>) => TypedPropertyDescriptor<ApiRouteHandler>;
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
export declare function post(resourceRouteOptions?: ResourceRouteOptions): <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<ApiRouteHandler>) => TypedPropertyDescriptor<ApiRouteHandler>;
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
export declare function put(resourceRouteOptions?: ResourceRouteOptions): <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<ApiRouteHandler>) => TypedPropertyDescriptor<ApiRouteHandler>;
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
export declare function del(resourceRouteOptions?: ResourceRouteOptions): <T>(target: T, key: string, descriptor: TypedPropertyDescriptor<ApiRouteHandler>) => TypedPropertyDescriptor<ApiRouteHandler>;
/**
 * A parameter decorator used to specify which query string variable should be mapped to the decorated parameter
 *
 * @param name the name of the query string parameter to map
 */
export declare function query(name: string): (target: any, key: string, index: number) => void;
/**
 * A parameter decorator used to specify which path variable should be mapped to the decorated parameter. Note this MUST
 * exist in the path for the decorator to work.
 *
 * @param name the name of the path parameter to map
 */
export declare function path(name: string): (target: any, key: string, index: number) => void;
/**
 * A parameter decorator used to specify which local variable on the request should be mapped to the
 * decorated parameter. Middleware will set various properties on req.local and this allows the resource to access
 * the data middleware has set.
 *
 * @param name the name of the path parameter to map
 */
export declare function local(name: string): (target: any, key: string, index: number) => void;
/**
 * A parameter decorator used to specify the request body should be mapped to the decorated parameter.
 *
 * @param name the name of the path parameter to map
 */
export declare function body(): (target: any, key: string, index: number) => void;
export {};
