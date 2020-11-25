import { initializeProperties } from '../properties/initialize';
import { removeModelFromAllRelations } from '../properties/updateRelation';
import { ItemsStore } from '../store/itemsStore';
import { getModelClassByInstance } from './helpers';

export type GenericInput = {
  [key: string]: any;
};

export class Model {
  id: string;
  modelName: string;
  public store: ItemsStore;

  constructor(store: ItemsStore, input: GenericInput, id?: string) {
    if (id && !store.validateId(id)) {
      throw new Error(`Incorrect id`);
    }

    const modelClass = getModelClassByInstance(this);

    const modelName = store.getModelNameByModelClass(modelClass);

    if (!modelName) {
      throw new Error('Model name not registered in store');
    }

    this.modelName = modelName;

    const newId = id ?? store.createId();

    this.id = newId;
    this.store = store;

    initializeProperties(this, input);
  }

  remove() {
    this.store.removeItem(this.id);
  }
}
