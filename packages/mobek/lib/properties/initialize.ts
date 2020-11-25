import { computed, makeObservable, observable, AnnotationsMap } from 'mobx';
import { Collection } from '../collection';
import { GenericInput, Model } from '../model';
import { assert } from '../utils/assert';
import {
  BasicPropertyData,
  ManyToOnePropertyData,
  OneToManyPropertyData,
  PropertyData,
  getModelProperties,
  getModelPropertiesByInstance,
  ReferencePropertyData,
} from './registry';
import { updateModelRelation } from './updateRelation';

function initializeBasicProperty(
  instance: Model,
  input: GenericInput,
  propertyData: BasicPropertyData,
): AnnotationsMap<any, any> {
  const inputValue = Reflect.get(input, propertyData.name);

  if (propertyData.config.isRequired) {
    // TODO meaningful error
    assert(inputValue, `Input is required`);
  }

  Reflect.set(instance, propertyData.name, inputValue);

  return {
    [propertyData.name]: observable,
  };
}

function initializeOneToManyProperty(
  instance: Model,
  input: GenericInput,
  propertyData: OneToManyPropertyData,
): AnnotationsMap<any, any> {
  const {
    config,
    model,
    referencedModelGetter,
    referencedProperty,
    name: propertyName,
  } = propertyData;

  assert(
    !Reflect.get(instance, propertyName),
    'When using @oneToMany, dont assign initial value.',
  );

  const collection = new Collection();

  Reflect.defineProperty(instance, propertyName, {
    get() {
      return collection;
    },
    set() {
      throw new Error(
        `Collection which is part of relation cannot be manually overwritten`,
      );
    },
  });

  return {};
}

function initializeManyToOneProperty(
  instance: Model,
  input: GenericInput,
  propertyData: ManyToOnePropertyData | ReferencePropertyData,
): AnnotationsMap<any, any> {
  const {
    config,
    model,
    referencedModelGetter,
    name: propertyName,
  } = propertyData;

  const referencedProperty =
    propertyData.type === 'manyToOne' ? propertyData.referencedProperty : null;
  const idPropName = `${propertyName}Id`;

  const referencedModel = referencedModelGetter();

  const isRequired = config.isRequired;

  function connectWithTarget(instance: Model, targetInstance: Model) {
    assert(
      referencedProperty,
      'Cannot connect with target if there is no referenced property',
    );
    updateModelRelation(targetInstance, referencedProperty, instance, 'add');
  }

  function disconnectWithTarget(instance: Model, targetInstance: Model) {
    assert(
      referencedProperty,
      'Cannot disconnect with target if there is no referenced property',
    );
    updateModelRelation(targetInstance, referencedProperty, instance, 'remove');
  }

  Reflect.defineProperty(instance, propertyName, {
    get(this: Model) {
      const targetId = Reflect.get(this, idPropName) as string | null;

      if (!targetId) {
        return null;
      }

      return instance.store.getItemById(referencedModel, targetId);
    },
    set(this: Model, target: Model | null) {
      const currentItem = Reflect.get(this, propertyName) as Model | null;

      if (currentItem === target) {
        return;
      }

      if (currentItem) {
        disconnectWithTarget(this, currentItem);
      }

      if (target) {
        connectWithTarget(this, target);
      }

      const targetId = target?.id ?? null;
      Reflect.set(this, idPropName, targetId);
    },
    configurable: true,
    enumerable: true,
  });

  const initialReferencedId = Reflect.get(input, idPropName);

  Reflect.defineProperty(instance, idPropName, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: initialReferencedId,
  });

  Reflect.set(instance, idPropName, initialReferencedId);

  const initialInstance = Reflect.get(instance, propertyName);

  if (initialInstance) {
    connectWithTarget(instance, initialInstance);
  }

  return {
    [propertyName]: computed,
    [idPropName]: observable,
  };
}

function initializeProperty(
  instance: Model,
  input: GenericInput,
  propertyData: PropertyData,
): AnnotationsMap<any, any> {
  switch (propertyData.type) {
    case 'prop':
      return initializeBasicProperty(instance, input, propertyData);
    case 'oneToMany':
      return initializeOneToManyProperty(instance, input, propertyData);
    case 'manyToOne':
    case 'reference':
      return initializeManyToOneProperty(instance, input, propertyData);
  }

  throw new Error('Incorrect property type');
}

export function initializeProperties(instance: Model, input: GenericInput) {
  const propertiesMap = getModelPropertiesByInstance(instance);

  if (!propertiesMap) {
    return;
  }

  const mobxAnnotationsMap: AnnotationsMap<any, any> = {};

  for (const [propName, propertyData] of propertiesMap) {
    const newAnnotations = initializeProperty(instance, input, propertyData);

    for (const annotatedPropName in newAnnotations) {
      if (Reflect.get(mobxAnnotationsMap, annotatedPropName)) {
        throw new Error(`Prop ${annotatedPropName} is defined twice`);
      }

      Reflect.set(
        mobxAnnotationsMap,
        annotatedPropName,
        newAnnotations[annotatedPropName],
      );
    }
  }

  // console.log('ALOSZKA!!!!!!!!!!!!!', instance);

  makeObservable(instance, mobxAnnotationsMap);
}
