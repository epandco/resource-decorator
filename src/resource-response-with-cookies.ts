import { ResourceContentType } from './resource-content-type';

export interface CookieItem {
  name: string;
  value: ResourceContentType;
  options?: object;
}

export class ResourceResponseWithCookies {
  public cookies?: CookieItem[];

  constructor(cookies?: CookieItem[]) {
    this.cookies = cookies;
  }
}