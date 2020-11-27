import { GenericInput, Model } from '../Model';
import { Primitive, SubType } from '../utils/types';
import { ItemsStore } from './itemsStore';
import { ModelsMap } from './modelsMap';
import { createModelQuery, ModelQuery, QueryFilter } from './query';

type SingleReferenceIdsInput<M extends Model> = {
  [K in keyof SubType<M, Model> as `${Uncapitalize<string & K>}Id`]: string;
} &
  {
    [K in keyof SubType<M, Model | undefined> as `${Uncapitalize<
      string & K
    >}Id`]?: string;
  };

type ListReferenceIdsInput<M extends Model> = {
  [K in keyof SubType<M, Model[]> as `${Uncapitalize<
    string & K
  >}Ids`]?: string[];
};

type OmitBuiltIns<M extends Model> = Omit<M, keyof Model>;

type ModelCreateInput<M extends Model> = SubType<OmitBuiltIns<M>, Primitive> &
  SingleReferenceIdsInput<M> &
  ListReferenceIdsInput<M> & { id?: string };

type ModelsAddMethods<M extends ModelsMap> = {
  [K in keyof M as `add${Capitalize<string & K>}`]: (
    input: ModelCreateInput<InstanceType<M[K]>>,
  ) => InstanceType<M[K]>;
};

type ModelsRemoveMethods<M extends ModelsMap> = {
  [K in keyof M as `remove${Capitalize<string & K>}`]: (id: string) => void;
};

type ModelsGetMethods<M extends ModelsMap> = {
  [K in keyof M as `get${Capitalize<string & K>}`]: (
    id: string,
  ) => InstanceType<M[K]> | null;
};

type ModelsQueryMethods<SM extends ModelsMap> = {
  [K in keyof SM as `create${Capitalize<string & K>}Query`]: (
    filter?: QueryFilter<InstanceType<SM[K]>>,
  ) => ModelQuery<InstanceType<SM[K]>>;
};

export type ModelsMethods<SM extends ModelsMap> = ModelsAddMethods<SM> &
  ModelsRemoveMethods<SM> &
  ModelsQueryMethods<SM> &
  ModelsGetMethods<SM>;

export function createModelsMethods<SM extends ModelsMap>(
  storesMap: SM,
  itemsStore: ItemsStore,
): ModelsMethods<SM> {
  for (const modelName in storesMap) {
    // validateRelations(storesMap[modelName]);
  }

  const methods: ModelsMethods<SM> = {} as ModelsMethods<SM>;

  for (const modelName in storesMap) {
    const model = storesMap[modelName];
    const addItemMethodName = joinWithCamelCase('add', modelName);
    const getItemMethodName = joinWithCamelCase('get', modelName);
    const removeItemMethodName = joinWithCamelCase('remove', modelName);
    const createQueryMethodName = joinWithCamelCase(
      'create',
      modelName,
      'Query',
    );

    Reflect.set(methods, addItemMethodName, (input: GenericInput) => {
      return itemsStore.createItem(model, input);
    });

    Reflect.set(methods, getItemMethodName, (itemId: string) => {
      return itemsStore.getItemById(model, itemId);
    });

    Reflect.set(methods, removeItemMethodName, (itemId: string) => {
      return itemsStore.removeItem(itemId);
    });

    Reflect.set(
      methods,
      createQueryMethodName,
      (filter?: QueryFilter<Model>): ModelQuery<Model> => {
        return createModelQuery(itemsStore, modelName, filter);
      },
    );
  }

  return methods;
}

function joinWithCamelCase(...inputs: string[]) {
  const [first, ...rest] = inputs;

  return first + rest.map(capitalize).join('');
}

function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
