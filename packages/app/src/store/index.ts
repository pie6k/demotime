import { createStore } from '~/model';
import { Project, Issue, User, AppState } from './models';
import { getModelsDatabase } from './db';
import cuid, { isCuid } from 'cuid';
import { assert } from '~/model/utils/assert';

export const store = createStore(
  { project: Project, issue: Issue, user: User, appState: AppState },
  {
    id: {
      create() {
        return cuid();
      },
      validate(id) {
        return isCuid(id);
      },
    },
  },
);

let isInitialized = false;

store.onItemAdded(async newItem => {
  if (!isInitialized) return;
  const db = await getModelsDatabase();

  db.add('items', newItem.serialize());
});

store.onItemRemoved(async removedItem => {
  if (!isInitialized) return;
  const db = await getModelsDatabase();

  db.delete('items', removedItem.id);
});

store.onItemUpdated(async removedItem => {
  if (!isInitialized) return;
  const db = await getModelsDatabase();

  db.put('items', removedItem.serialize());
});

let didInitializePromise: Promise<void>;

export async function _initializeStoreFromDatabase() {
  const db = await getModelsDatabase();

  const allItems = await db.getAll('items');

  store.insert(allItems);

  isInitialized = true;
}

export function initializeStoreFromDatabase() {
  if (didInitializePromise) {
    return didInitializePromise;
  }

  didInitializePromise = _initializeStoreFromDatabase();

  return didInitializePromise;
}

export function getAppState() {
  const results = store.createAppStateQuery().results;

  assert(results.length === 1, 'Incorrect app state in store');

  return results[0];
}
