import {
  IObservableArray,
  observable,
  isObservableArray,
  action,
  autorun,
  makeObservable,
} from 'mobx';
import { GenericInput, Model } from '../model';
import { getModelClassByInstance, isModelInstance } from '../model/helpers';
import { removeModelFromAllRelations } from '../properties/updateRelation';
import { createChannel } from '../utils/channel';

import { StoreConfig } from './config';
import { ModelsMap } from './modelsMap';

export class ItemsStore {
  public storeConfig: StoreConfig;
  public modelsMap: ModelsMap;

  public onItemAdded = createChannel<Model>();
  public onItemRemoved = createChannel<Model>();
  public onItemUpdated = createChannel<Model>();

  constructor(modelsMap: ModelsMap, storeConfig: StoreConfig) {
    this.storeConfig = storeConfig;
    this.modelsMap = modelsMap;

    makeObservable(this);
  }

  validateId(id: string): boolean {
    return this.storeConfig.id.validate(id);
  }

  createId(): string {
    return this.storeConfig.id?.create();
  }

  getModelNameByModelClass(modelClass: typeof Model): string | null {
    for (const modelName in this.modelsMap) {
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

    modelInstance.initializeWithInput(input);

    this.items.add(modelInstance);
    this.itemsLookup.set(modelInstance.id, modelInstance);

    this.onItemAdded.publish(modelInstance);

    return modelInstance;
  }

  @action
  removeItem(itemId: string) {
    const item = this.itemsLookup.get(itemId);
    if (!item) {
      throw new Error(`Trying to remove item that doesnt exist`);
    }

    removeModelFromAllRelations(item);

    this.onItemRemoved.publish(item);

    this.itemsLookup.delete(item.id);
    this.items.delete(item);
  }
}
