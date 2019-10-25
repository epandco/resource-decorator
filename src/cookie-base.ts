import { ResourceContentType } from './resource-content-type';

export interface CookieItem {
  name: string;
  value: ResourceContentType;
  options?: object;
}

export abstract class CookieBase {
  public cookies?: CookieItem[];

  protected constructor(cookies?: CookieItem[]) {
    this.cookies = cookies;
  }
}