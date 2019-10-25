import { ResourceContentType } from './resource-content-type';
import { CookieBase, CookieItem } from './cookie-base';

export class TemplateResponse extends CookieBase {
  public template: string;
  public content?: ResourceContentType;

  constructor(template: string, content?: ResourceContentType, cookies?: CookieItem[]) {
    super(cookies);

    this.template = template;
    this.content = content;
  }
}