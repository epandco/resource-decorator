import { ResourceContentType } from './resource-content-type';
import { CookieBase, CookieItem } from './cookie-base';

export class ApiResponse extends CookieBase {
  public content: ResourceContentType;

  constructor(content: ResourceContentType, cookies?: CookieItem[]) {
    super(cookies);

    this.content = content;
  }
}