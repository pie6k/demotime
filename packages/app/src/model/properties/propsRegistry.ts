import { Model } from '../model';

type PropertyType = '';

export interface PropertySettings<M extends Model, T> {
  initializer: (instance: M, input: any) => void;
  isRequired: boolean;
  name: string;
}

type ModelInitializer<M extends typeof Model> = (
  instance: InstanceType<M>,
) => void;

export const modelInitializersRegistry = new WeakMap<
  typeof Model,
  Set<ModelInitializer<typeof Model>>
>();

export function registerModelInitializer<M extends typeof Model>(
  modelClass: M,
  initializer: ModelInitializer<M>,
) {
  let initializers = modelInitializersRegistry.get(modelClass);

  if (!initializers) {
    initializers = new Set();
    modelInitializersRegistry.set(modelClass, initializers);
  }

  initializers.add(initializer);
}

export function getModelInitializers(modelClass: typeof Model) {
  let initializers = modelInitializersRegistry.get(modelClass);

  return initializers ?? new Set();
}
