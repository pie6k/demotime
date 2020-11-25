import { Collection } from '../collection';
import { Model } from '../model';
import { assert } from '../utils/assert';

type UpdateRelationOperationType = 'add' | 'remove';
import {
  getModelProperties,
  getModelPropertiesByInstance,
  getModelPropertyByInstance,
} from './registry';

export function updateModelRelation(
  hostInstance: Model,
  hostProp: string,
  instanceToAddOrRemove: Model,
  operationType: UpdateRelationOperationType,
) {
  const propertyData = getModelPropertyByInstance(hostInstance, hostProp);

  assert(
    propertyData,
    'Unable to update model relation as it is not marked as proper property',
  );

  if (propertyData.type === 'prop') {
    throw new Error('@prop properties cannot be part of relation');
  }

  if (propertyData.type === 'manyToOne') {
    throw new Error('@manyToOne properties cannot be part of relation');
  }

  if (propertyData.type === 'reference') {
    throw new Error('@reference properties cannot be part of relation');
  }

  if (propertyData.type === 'oneToMany') {
    const relationCollection = Reflect.get(hostInstance, hostProp);

    assert(
      relationCollection instanceof Collection,
      'OneToMany field is not an collection',
    );

    if (operationType === 'add') {
      relationCollection.add(instanceToAddOrRemove);
    }

    if (operationType === 'remove') {
      relationCollection.remove(instanceToAddOrRemove);
    }

    return;
  }
}

export function removeModelFromAllRelations(modelInstance: Model) {
  const properties = getModelPropertiesByInstance(modelInstance);

  if (!properties) {
    return;
  }

  for (const [propertyName, propertyData] of properties) {
    const maybeInstanceOrCollection = Reflect.get(modelInstance, propertyName);

    if (maybeInstanceOrCollection instanceof Model) {
      Reflect.set(modelInstance, propertyName, null);
    }

    if (maybeInstanceOrCollection instanceof Collection) {
      maybeInstanceOrCollection.remove(modelInstance);
    }
  }
}
