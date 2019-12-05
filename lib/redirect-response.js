"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_base_1 = require("./cookie-base");
class RedirectResponse extends cookie_base_1.CookieBase {
    constructor(redirectUrl, statusCode, cookies) {
        super(cookies);
        this.redirectUrl = redirectUrl;
        this.statusCode = statusCode;
    }
}
exports.RedirectResponse = RedirectResponse;
//# sourceMappingURL=redirect-response.js.map