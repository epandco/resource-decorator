import { ResourceResponseWithCookies } from './resource-response-with-cookies';
import { ResourceContent } from './resource-content';
import { ResourceTemplateContent } from './resource-template-content';
import { ResourceRedirect } from './resource-redirect';

export type ResourceApiResponse = ResourceResponseWithCookies | ResourceContent | void;
export type ResourceTemplateResponse = ResourceTemplateContent | ResourceRedirect;


