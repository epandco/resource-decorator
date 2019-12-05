"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * If thrown will result in a 400 back to the client
 * rendered correctly for the route.
 */
class ResourceError {
    constructor(msg) {
        this.msg = msg;
    }
}
exports.ResourceError = ResourceError;
//# sourceMappingURL=resource-error.js.map