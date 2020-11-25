import { Model } from '../model';

export interface PropertyConfig {
  isRequired: boolean;
}

export interface CommonPropertyData {
  name: string;
  model: typeof Model;
  config: PropertyConfig;
}

export interface BasicPropertyData extends CommonPropertyData {
  type: 'prop';
}

export interface OneToManyPropertyData extends CommonPropertyData {
  type: 'oneToMany';
  referencedModelGetter: () => typeof Model;
  referencedProperty: string;
}

export interface ManyToOnePropertyData extends CommonPropertyData {
  type: 'manyToOne';
  referencedModelGetter: () => typeof Model;
  referencedProperty: string;
}

export interface ReferencePropertyData extends CommonPropertyData {
  referencedModelGetter: () => typeof Model;
  type: 'reference';
}

export type PropertyData =
  | BasicPropertyData
  | OneToManyPropertyData
  | ManyToOnePropertyData
  | ReferencePropertyData;

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
