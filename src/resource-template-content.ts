import { ResourceContentType } from './resource-content-type';
import { CookieItem, ResourceResponseWithCookies } from './resource-response-with-cookies';

export class ResourceTemplateContent extends ResourceResponseWithCookies {
  public template: string;
  public content?: ResourceContentType;

  constructor(template:string, content?: ResourceContentType, cookies?: CookieItem[]) {
    super(cookies);

    this.template = template;
    this.content = content;
  }
}