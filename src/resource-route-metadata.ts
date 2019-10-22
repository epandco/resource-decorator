import { ParameterEntry } from './parameter-entry';
import { HttpMethod } from './http-method';
import { ResourceRenderer } from './resource-renderer';
import { ResourceType } from './resource-type';

export interface ResourceRouteMetadata {
  resourceType: ResourceType;
  path: string;
  method: HttpMethod;
  methodKey: string;
  queryParams: ParameterEntry[];
  pathParams: ParameterEntry[];
  bodyParam: ParameterEntry | null;
  localParams: ParameterEntry[];
  totalParameters: number;
  resourceRenderer?: ResourceRenderer;
}