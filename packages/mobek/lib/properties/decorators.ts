import { observable } from 'mobx';
import { Collection } from '../collection';
import { Model } from '../Model';
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
  Model
> &
  string;

export function oneToMany<T extends typeof Model>(
  modelGetter: () => T,
  referencedProperty: ReferenceModelKeys<T>,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    propName: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, propName, {
      type: 'oneToMany',
      name: propName,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelGetter: modelGetter,
      referencedProperty: referencedProperty,
    });
  };
}

function foo<T extends typeof Model>(
  a: T,
): keyof SubType<InstanceType<T>, string | undefined> {
  return null as any;
}

export function manyToOne<T extends typeof Model>(
  modelGetter: () => T,
  referencedProperty: CollectionModelKeys<T>,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    key: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, key, {
      type: 'manyToOne',
      name: key,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelGetter: modelGetter,
      referencedProperty,
    });
  };
}

export function reference<T extends typeof Model>(
  modelGetter: () => T,
  config?: PropDecoratorOptions,
) {
  return function propDecorator<T extends Model, K extends string>(
    targetProto: T,
    key: K,
  ) {
    const modelClass = getModelClassFromDecoratorPrototype(targetProto);

    registerProperty(modelClass, key, {
      type: 'reference',
      name: key,
      model: modelClass,
      config: { isRequired: config?.isRequired ?? false },
      referencedModelGetter: modelGetter,
    });
  };
}
