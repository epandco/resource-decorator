import { ResourceContentType } from './resource-content-type';
export interface CookieItem {
    name: string;
    value: ResourceContentType;
    options?: object;
}
export declare abstract class CookieBase {
    cookies?: CookieItem[];
    protected constructor(cookies?: CookieItem[]);
}
