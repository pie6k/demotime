import { Model } from '../Model';

import { ItemsStore } from './itemsStore';
import { ModelsMethods, createModelsMethods } from './modelMethods';
import { getModelsFromModelsMap, ModelsMap } from './modelsMap';
import { StoreConfig } from './config';

type StoreBuiltInMethods<SM extends ModelsMap> = {
  insert: (items: Model[]) => void;
  clear: () => void;
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

  return {
    ...modelsMethods,
    clear: () => {},
    insert: () => {},
  };
}
