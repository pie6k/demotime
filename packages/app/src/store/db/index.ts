import { createDatabase } from './base';
import { memoize } from 'lodash';

type ModelData = { id: string } & Record<string, any>;

export async function _createModelsDatabase() {
  const db = await createDatabase<ModelData>({
    name: 'lineardemo',
    version: 1,
    key: 'id',
  });

  return db;
}

export const getModelsDatabase = memoize(_createModelsDatabase);
