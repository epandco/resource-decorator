import { ResourceResponseWithCookies, CookieItem } from './resource-response-with-cookies';

export class ResourceRedirect extends ResourceResponseWithCookies {
  public redirectUrl: string;
  public statusCode?: number;

  constructor(redirectUrl: string, statusCode?: number, cookies?: CookieItem[]) {
    super(cookies);

    this.redirectUrl = redirectUrl;
    this.statusCode = statusCode;
  }
}