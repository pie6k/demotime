import { computed, makeObservable } from 'mobx';
import { Model } from '../model';
import { ItemsStore } from './itemsStore';

export type ModelQuery<M extends Model> = {
  results: M[];
};

export type QueryFilter<M extends Model> = (item: M) => boolean;

type FilterCacheItem = {
  updatedAt: Date;
  result: boolean;
};

export function createModelQuery(
  itemsStore: ItemsStore,
  modelName: string,
  filter: QueryFilter<Model>,
): ModelQuery<Model> {
  const cacheMap = new WeakMap<Model, FilterCacheItem>();

  function filterWithCache(item: Model): boolean {
    if (item.getModelName() !== modelName) {
      return false;
    }

    const cachedResult = cacheMap.get(item);

    if (!cachedResult) {
      const result = filter(item);

      cacheMap.set(item, { result, updatedAt: item.updatedAt });

      return result;
    }

    // We have cached result, let's check if updatedAt didnt change

    // Item didnt update since the last check - we can reuse previous result.
    if (cachedResult.updatedAt === item.updatedAt) {
      return cachedResult.result;
    }

    // We had cached result, but item updated since we performed it.
    const result = filter(item);

    cacheMap.set(item, { result, updatedAt: item.updatedAt });

    return result;
  }

  const queryObject: ModelQuery<Model> = {
    get results() {
      return Array.from(itemsStore.items).filter(filterWithCache);
    },
  };

  makeObservable(queryObject, { results: computed });

  return queryObject;
}
