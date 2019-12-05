import { ResourceContentType } from './resource-content-type';
import { CookieBase, CookieItem } from './cookie-base';
export declare class ApiResponse extends CookieBase {
    content: ResourceContentType;
    constructor(content: ResourceContentType, cookies?: CookieItem[]);
}
