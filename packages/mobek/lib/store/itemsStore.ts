import { IObservableArray, observable, isObservableArray, action } from 'mobx';
import { GenericInput, Model } from '../Model';
import { getModelClassByInstance, isModelInstance } from '../model/helpers';
import { removeModelFromAllRelations } from '../properties/updateRelation';

import { StoreConfig } from './config';
import { ModelsMap } from './modelsMap';

export class ItemsStore {
  public storeConfig: StoreConfig;
  public modelsMap: ModelsMap;
  constructor(modelsMap: ModelsMap, storeConfig: StoreConfig) {
    this.storeConfig = storeConfig;
    this.modelsMap = modelsMap;
  }

  validateId(id: string): boolean {
    return this.storeConfig.id.validate(id);
  }

  createId(): string {
    return this.storeConfig.id?.create();
  }

  getModelNameByModelClass(modelClass: typeof Model): string | null {
    for (const modelName in this.modelsMap) {
      // console.log('mc', modelClass, this.modelsMap[modelName]);
      if (this.modelsMap[modelName] === modelClass) {
        return modelName;
      }
    }

    return null;
  }

  @observable
  items = new Set<Model>();

  @observable
  itemsLookup = new Map<string, Model>();

  getItemById<T extends typeof Model>(
    model: T,
    id: string,
  ): InstanceType<T> | null {
    const foundItem = (this.itemsLookup.get(id) as InstanceType<T>) ?? null;

    if (!foundItem) {
      return null;
    }

    if (!(foundItem instanceof model)) {
      throw new Error(
        `getItemById expected item of model ${model.name}, but found ${
          getModelClassByInstance(foundItem).name
        } model instead`,
      );
    }

    return foundItem;
  }

  @action
  createItem(ModelClass: typeof Model, input: GenericInput): Model {
    const modelInstance = new ModelClass(this, input);

    this.items.add(modelInstance);
    this.itemsLookup.set(modelInstance.id, modelInstance);

    return modelInstance;
  }

  @action
  addItem(item: Model) {
    if (this.itemsLookup.has(item.id)) {
      throw new Error('This item already exists');
    }

    this.itemsLookup.set(item.id, item);
    this.items.add(item);
  }

  @action
  removeItem(itemId: string) {
    const item = this.itemsLookup.get(itemId);
    if (!item) {
      throw new Error(`Trying to remove item that doesnt exist`);
    }

    removeModelFromAllRelations(item);

    this.itemsLookup.delete(item.id);
    this.items.delete(item);
  }
}
