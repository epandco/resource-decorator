"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_response_1 = require("./api-response");
const resource_type_1 = require("./resource-type");
/**
 * A default renderer for API resource types. Since API routes don't need ANY external dependencies
 * to render JSON a default implementation is provided in this package.
 */
class DefaultAPIRenderer {
    constructor() {
        this.contentType = 'application/json';
    }
    async ok(model) {
        if (!model) {
            return '';
        }
        if (!(model instanceof api_response_1.ApiResponse)) {
            throw new Error(`Model must be of type ResourceContent type. Current type is ${typeof model}`);
        }
        return JSON.stringify(model.content);
    }
    async notFound() {
        return '';
    }
    async expectedError(err) {
        return JSON.stringify(err);
    }
    async fatalError(msg) {
        return JSON.stringify(msg);
    }
    async unauthorized() {
        return JSON.stringify('Not authorized');
    }
}
const renderers = new Map();
// for API
renderers.set(resource_type_1.ResourceType.API, new DefaultAPIRenderer());
/**
 * Allows external packages to register a default renderer for a given type.
 */
function registerDefaultRenderer(resourceType, resourceRenderer) {
    renderers.set(resourceType, resourceRenderer);
}
exports.registerDefaultRenderer = registerDefaultRenderer;
/**
 * Allows an external package to get the default renderer for a given type. This will allow packages to configure
 * default renderers and other packages to fetch them.
 *
 * For example one package may define how to render a template ResourceType via the registerDefaultRenderer. Then
 * a second package maybe invoked after that point to generate a resource in which case it can call getDefaultRender
 * to fetch a rendere for given type and get the one registered prior by the first package.
 */
function getDefaultRenderer(resourceType) {
    const value = renderers.get(resourceType);
    if (!value) {
        throw Error(`No renderer defined for resourceType: ${resourceType} please use the registerRenderer method to add one`);
    }
    return value;
}
exports.getDefaultRenderer = getDefaultRenderer;
//# sourceMappingURL=resource-renderer.js.map