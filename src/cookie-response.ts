import {CookieBase, CookieItem} from './cookie-base';


export class CookieResponse extends CookieBase {
  constructor(cookies: CookieItem[]) {
    super(cookies);
  }
}