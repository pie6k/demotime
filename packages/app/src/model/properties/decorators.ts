import { observable } from 'mobx';
import { Collection } from '../collection';
import { Model } from '../model';

import { SubType } from '../utils/types';
import { registerProperty } from './registry';

interface PropDecoratorOptions {
  isRequired?: boolean;
}

function getModelClassFromDecoratorPrototype<T extends Model>(targetProto: T) {
  return targetProto.constructor.prototype as typeof Model;
}

export function prop(config?: PropDecoratorOptions) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    key: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, key, {
      type: 'prop',
      name: key,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      isSerialized: true,
    });
  };
}

type CollectionModelKeys<T extends typeof Model> = keyof SubType<
  InstanceType<T>,
  Collection<any>
> &
  string;

type ReferenceModelKeys<T extends typeof Model> = keyof SubType<
  InstanceType<T>,
  Model | undefined
> &
  string;

export function oneToMany<T extends typeof Model>(
  modelGetter: () => T,
  referencedProperty: ReferenceModelKeys<T>,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    propertyName: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, propertyName, {
      type: 'referenceCollection',
      name: propertyName,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelProperty: referencedProperty,
      referencedModelGetter: modelGetter,
      isSerialized: false,
    });

    registerProperty(modelClass, propertyName + 'Ids', {
      type: 'referenceId',
      name: propertyName + 'Ids',
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      isList: true,
      isSerialized: false,
    });
  };
}

export function manyToOne<T extends typeof Model>(
  modelGetter: () => T,
  referencedProperty: CollectionModelKeys<T>,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    propertyName: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, propertyName, {
      type: 'reference',
      name: propertyName,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelGetter: modelGetter,
      referencedModelProperty: referencedProperty,
      isSerialized: false,
    });

    registerProperty(modelClass, propertyName + 'Id', {
      type: 'referenceId',
      name: propertyName + 'Id',
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      isList: false,
      isSerialized: true,
    });
  };
}

export function reference<T extends typeof Model>(
  modelGetter: () => T,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    propertyName: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, propertyName, {
      type: 'reference',
      name: propertyName,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelGetter: modelGetter,
      isSerialized: false,
    });

    registerProperty(modelClass, propertyName + 'Id', {
      type: 'referenceId',
      name: propertyName + 'Id',
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      isList: false,
      isSerialized: true,
    });
  };
}
