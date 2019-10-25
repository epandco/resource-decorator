import { CookieBase, CookieItem } from './cookie-base';

export class RedirectResponse extends CookieBase {
  public redirectUrl: string;
  public statusCode?: number;

  constructor(redirectUrl: string, statusCode?: number, cookies?: CookieItem[]) {
    super(cookies);

    this.redirectUrl = redirectUrl;
    this.statusCode = statusCode;
  }
}