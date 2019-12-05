import { ResourceRenderer } from './resource-renderer';
/**
 * Options for the api route decorators. @see get, put, post, delete and
 * route decorators for more info.
 */
export interface ResourceRouteOptions {
    /**
     * Sets the path relative to the resources base path. @see ResourceOptions.
     */
    path?: string;
    /**
     * Used to control how the route renders content. Typically doesn't need to be set so and should be done with care.
     * @see ResourceRenderBuilder for details.
     */
    resourceRenderer?: ResourceRenderer;
}
