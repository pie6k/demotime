import { makeAutoObservable } from 'mobx';
import { Model } from '../model';
import { assert } from '../utils/assert';
import { ChannelSubscribeFunction } from '../utils/channel';
import { StoreConfig } from './config';
import { ItemsStore } from './itemsStore';
import { createModelsMethods, ModelsMethods } from './modelMethods';
import { getModelsFromModelsMap, ModelsMap } from './modelsMap';

// TODO - add __model and other 'required' fields.
type ItemInsertInput = Record<string, any>;

type StoreBuiltInMethods<SM extends ModelsMap> = {
  insert: (items: ItemInsertInput[]) => void;
  clear: () => void;
  onItemAdded: ChannelSubscribeFunction<Model>;
  onItemRemoved: ChannelSubscribeFunction<Model>;
  onItemUpdated: ChannelSubscribeFunction<Model>;
};

type Store<SM extends ModelsMap> = ModelsMethods<SM> & StoreBuiltInMethods<SM>;

export function createStore<SM extends ModelsMap>(
  modelsMap: SM,
  config: StoreConfig,
): Store<SM> {
  for (const modelName in modelsMap) {
    // validateRelations(modelsMap[modelName]);
  }

  const models = getModelsFromModelsMap(modelsMap);

  const itemsStore = new ItemsStore(modelsMap, config);
  const modelsMethods = createModelsMethods(modelsMap, itemsStore);

  const store = {
    ...modelsMethods,
    onItemAdded: itemsStore.onItemAdded.subscribe,
    onItemRemoved: itemsStore.onItemRemoved.subscribe,
    onItemUpdated: itemsStore.onItemUpdated.subscribe,
    clear: () => {},
    insert: (serializedItems: ItemInsertInput[]) => {
      for (const item of serializedItems) {
        const modelClass = modelsMap[item.__model] as typeof Model;

        assert(modelClass, `Unknown model class for __model - ${item.__model}`);

        itemsStore.createItem(modelClass, item);
      }
    },
  };

  return makeAutoObservable(store);
}
