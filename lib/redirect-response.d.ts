import { CookieBase, CookieItem } from './cookie-base';
export declare class RedirectResponse extends CookieBase {
    redirectUrl: string;
    statusCode?: number;
    constructor(redirectUrl: string, statusCode?: number, cookies?: CookieItem[]);
}
