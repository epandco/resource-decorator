import { ResourceContentType } from './resource-content-type';
import { ResourceResponseWithCookies, CookieItem } from './resource-response-with-cookies';

export class ResourceContent extends ResourceResponseWithCookies {
  public content: ResourceContentType;

  constructor(content: ResourceContentType, cookies?: CookieItem[]) {
    super(cookies);

    this.content = content;
  }
}