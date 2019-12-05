"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_base_1 = require("./cookie-base");
class ApiResponse extends cookie_base_1.CookieBase {
    constructor(content, cookies) {
        super(cookies);
        this.content = content;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.js.map