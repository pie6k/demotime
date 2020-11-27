import { Model } from './Model';

export function getModelClassByInstance<T extends Model>(t: T): typeof Model {
  return t.constructor as typeof Model;
}

export function isModelInstance(input: any): input is Model {
  return true;
}
