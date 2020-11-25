import { Model } from '../Model';

export type ModelsMap = {
  [key: string]: typeof Model;
};

export function getModelsFromModelsMap(map: ModelsMap): Set<typeof Model> {
  const set = new Set<typeof Model>();

  for (const modelName in map) {
    set.add(map[modelName]);
  }

  return set;
}
