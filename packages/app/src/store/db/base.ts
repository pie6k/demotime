import { openDB, deleteDB, wrap, unwrap, DBSchema } from 'idb';

interface DatabaseConfig<I> {
  key: keyof I;
  name: string;
  version: number;
}

type ModelData = Record<string, any>;

interface ItemsDatabase<T> extends DBSchema {
  items: {
    key: string;
    value: ModelData;
  };
}

export async function createDatabase<I>({
  name,
  key,
  version,
}: DatabaseConfig<I>) {
  const db = await openDB<ItemsDatabase<I>>(name, version, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore('items', {
        keyPath: key as string,
      });
      // …
    },
  });

  return db;
}
