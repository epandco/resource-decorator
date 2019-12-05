import { ResourceContentType } from './resource-content-type';
import { CookieBase, CookieItem } from './cookie-base';
export declare class TemplateResponse extends CookieBase {
    template: string;
    content?: ResourceContentType;
    constructor(template: string, content?: ResourceContentType, cookies?: CookieItem[]);
}
