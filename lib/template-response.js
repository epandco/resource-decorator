"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_base_1 = require("./cookie-base");
class TemplateResponse extends cookie_base_1.CookieBase {
    constructor(template, content, cookies) {
        super(cookies);
        this.template = template;
        this.content = content;
    }
}
exports.TemplateResponse = TemplateResponse;
//# sourceMappingURL=template-response.js.map