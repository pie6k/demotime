import { GenericInput, Model } from '../Model';
import { Primitive, SubType } from '../utils/types';
import { ItemsStore } from './itemsStore';
import { ModelsMap } from './modelsMap';

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

type ModelsAddMethods<MM extends ModelsMap> = {
  [K in keyof MM as `add${Capitalize<string & K>}`]: (
    input: ModelCreateInput<InstanceType<MM[K]>>,
  ) => InstanceType<MM[K]>;
};

type ModelsRemoveMethods<SM extends ModelsMap> = {
  [K in keyof SM as `remove${Capitalize<string & K>}`]: any;
};

type ModelQuery<M extends Model> = {
  results: M[];
};

type ModelsQueryMethods<SM extends ModelsMap> = {
  [K in keyof SM as `create${Capitalize<string & K>}Query`]: (
    filter: (item: InstanceType<SM[K]>) => boolean,
  ) => ModelQuery<InstanceType<SM[K]>>;
};

export type ModelsMethods<SM extends ModelsMap> = ModelsAddMethods<SM> &
  ModelsRemoveMethods<SM> &
  ModelsQueryMethods<SM>;

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
    const removeItemMethodName = joinWithCamelCase('remove', modelName);
    const createQueryMethodName = joinWithCamelCase('foo', modelName);

    Reflect.set(methods, addItemMethodName, (input: GenericInput) => {
      return itemsStore.createItem(model, input);
    });

    Reflect.set(methods, removeItemMethodName, (itemId: string) => {
      return itemsStore.removeItem(itemId);
    });

    Reflect.set(
      methods,
      createQueryMethodName,
      (filter: (model: Model) => boolean) => {
        return {
          results: [],
        };
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
