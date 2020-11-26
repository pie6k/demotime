import { IObjectDidChange, observable, observe } from 'mobx';
import { prop } from '../properties';
import { initializeProperties } from '../properties/initialize';
import {
  getIsPropByInstance,
  getModelPropertiesByInstance,
} from '../properties/registry';
import { removeModelFromAllRelations } from '../properties/updateRelation';
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

  private serializeBuiltIns() {}

  remove() {
    this.store.removeItem(this.id);
  }
}
