import { Model } from '../model';

export interface PropertyConfig {
  isRequired: boolean;
}

type PropertyType =
  | 'prop'
  | 'reference'
  | 'referenceCollection'
  | 'referenceId';

export interface CommonPropertyData {
  type: PropertyType;
  name: string;
  model: typeof Model;
  config: PropertyConfig;
  isSerialized: boolean;
}

export interface BasicPropertyData extends CommonPropertyData {
  type: 'prop';
}

export interface ReferenceIdPropertyData extends CommonPropertyData {
  type: 'referenceId';
  isList: boolean;
}

export interface ReferencePropertyData extends CommonPropertyData {
  type: 'reference';
  referencedModelGetter: () => typeof Model;
  referencedModelProperty?: string;
}

export interface ReferenceCollectionPropertyData extends CommonPropertyData {
  type: 'referenceCollection';
  referencedModelGetter: () => typeof Model;
  referencedModelProperty: string;
}

export type PropertyData =
  | BasicPropertyData
  | ReferencePropertyData
  | ReferenceCollectionPropertyData
  | ReferenceIdPropertyData;

type PropertiesMap = Map<string, PropertyData>;

const propsRegistry = new WeakMap<typeof Model, PropertiesMap>();

export function registerProperty(
  modelClass: typeof Model,
  propertyName: string,
  propertyData: PropertyData,
) {
  let propertiesMap = propsRegistry.get(modelClass);

  if (!propertiesMap) {
    propertiesMap = new Map();

    propsRegistry.set(modelClass, propertiesMap);
  }

  propertiesMap.set(propertyName, propertyData);
}

export function getModelProperties(
  modelClass: typeof Model,
): PropertiesMap | null {
  return propsRegistry.get(modelClass) ?? null;
}

export function getModelPropertiesByInstance(
  modelInstance: Model,
): PropertiesMap | null {
  const modelClass = Reflect.getPrototypeOf(modelInstance) as typeof Model;

  return getModelProperties(modelClass);
}

export function getModelProperty(
  modelClass: typeof Model,
  propertyName: string,
): PropertyData | null {
  return propsRegistry.get(modelClass)?.get(propertyName) ?? null;
}

export function getModelPropertyByInstance(
  modelInstance: Model,
  propertyName: string,
): PropertyData | null {
  const modelClass = Reflect.getPrototypeOf(modelInstance) as typeof Model;

  return propsRegistry.get(modelClass)?.get(propertyName) ?? null;
}

export function getIsPropByInstance(modelInstance: Model, propName: string) {
  return !!getModelPropertyByInstance(modelInstance, propName);
}
