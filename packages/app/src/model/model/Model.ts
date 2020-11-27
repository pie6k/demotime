import { IObjectDidChange, observable, observe } from 'mobx';
import { initializeProperties } from '../properties/initialize';
import {
  getIsPropByInstance,
  getModelPropertiesByInstance,
} from '../properties/registry';
import { ItemsStore } from '../store/itemsStore';
import { assert } from '../utils/assert';
import { getModelClassByInstance } from './helpers';

export type GenericInput = {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  [key: string]: any;
};

const builtInProps: Array<keyof Model & string> = [
  'id',
  'createdAt',
  'updatedAt',
];

export class Model {
  private __model: string;
  public store: ItemsStore;

  readonly id!: string;

  readonly createdAt!: Date;

  @observable
  public updatedAt!: Date;

  constructor(store: ItemsStore, input: GenericInput) {
    this.store = store;

    const modelClass = getModelClassByInstance(this);
    const modelName = store.getModelNameByModelClass(modelClass);

    if (!modelName) {
      throw new Error('Model name not registered in store');
    }

    this.__model = modelName;

    if (input.id && !this.store.validateId(input.id)) {
      throw new Error(`Incorrect id`);
    }

    const newId = input.id ?? this.store.createId();

    this.id = newId;

    this.createdAt = input.createdAt ?? new Date();
    this.updatedAt = input.updatedAt ?? new Date();

    /**
     * Note about initialization:
     *
     * We cannot initialize properties from input directly in constructor, because of https://github.com/mobxjs/mobx/issues/2486
     *
     * It is some sort of 'issue' with Babel, that when defining class properties without values like:
     *
     * class Foo {
     *   foo!: string
     * }
     *
     * They will be 'stripped' after constructor has finished. To see exact code, add `debugger` to the
     * end of constructor with sourcemaps disabled in devtools.
     *
     * Instead, `initializeWithInput` will be called by the store instantly after `new Model`, allowing
     * us to bypass this 'strip'.
     */
  }

  initializeWithInput(input: GenericInput) {
    initializeProperties(this, input);

    observe(this, updateInfo => {
      this.handleUpdate(updateInfo);
    });
  }

  getModelName() {
    return this.__model;
  }

  private handleUpdate(updateInfo: IObjectDidChange<Model>) {
    if (builtInProps.includes(updateInfo.name as any)) {
      return;
    }

    if (!getIsPropByInstance(this, updateInfo.name as string)) {
      return;
    }

    this.updatedAt = new Date();

    this.store.onItemUpdated.publish(this);
  }

  serialize() {
    const serializedData: Record<string, any> = {
      __model: this.__model,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    const properties = getModelPropertiesByInstance(this);

    // We can safely assume there are some properties as model itself has props like id, createdAt etc.
    assert(properties, 'Failed to serialize model, it has no properties');

    properties.forEach(propertyData => {
      if (!propertyData.isSerialized) {
        return;
      }

      const value = Reflect.get(this, propertyData.name);

      Reflect.set(serializedData, propertyData.name, value);
    });

    return serializedData;
  }

  remove() {
    this.store.removeItem(this.id);
  }
}
