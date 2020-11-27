import {
  AnnotationsMap,
  computed,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import { Collection } from '../collection';
import { GenericInput, Model } from '../model';
import { isNotEmpty } from '../utils/arrays';
import { assert } from '../utils/assert';
import {
  BasicPropertyData,
  getModelPropertiesByInstance,
  PropertyData,
  ReferenceCollectionPropertyData,
  ReferencePropertyData,
} from './registry';
import { updateModelRelation } from './updateRelation';

function initializeBasicProperty(
  instance: Model,
  input: GenericInput,
  propertyData: BasicPropertyData,
): AnnotationsMap<any, any> {
  const inputValue = Reflect.get(input, propertyData.name);

  if (propertyData.config.isRequired) {
    assert(inputValue, `Input for ${propertyData.name} is required`);
  }

  Reflect.set(instance, propertyData.name, inputValue);

  return {
    [propertyData.name]: observable,
  };
}

function initializeReferenceCollectionProperty(
  instance: Model,
  input: GenericInput,
  propertyData: ReferenceCollectionPropertyData,
): AnnotationsMap<any, any> {
  const {
    config,
    model,
    referencedModelGetter,
    referencedModelProperty,
    name: propertyName,
  } = propertyData;

  const referencedModel = referencedModelGetter();

  const itemIdsPropName = `${propertyName}Ids`;

  const initialItemIds =
    (Reflect.get(input, itemIdsPropName) as string[]) ?? [];

  const initialItems = initialItemIds
    .map(initialItemId => {
      const item = instance.store.getItemById(referencedModel, initialItemId);

      return item;
    })
    .filter(isNotEmpty);

  assert(
    !Reflect.get(instance, propertyName),
    'When using @oneToMany, dont assign initial value.',
  );

  const collection = new Collection({}, initialItems);

  // Note: We dont have to clear subscribtions, as if item will be removed and reference to this
  // collection will be lost, channel itself will be garbage collected.

  collection.onItemAdded.subscribe(addedItem => {
    const existingReference = Reflect.get(
      addedItem,
      referencedModelProperty,
    ) as Model | null;

    if (existingReference !== instance) {
      // TODO - handle @manyToMany
      Reflect.set(addedItem, referencedModelProperty, instance);
    }
  });

  collection.onItemRemoved.subscribe(addedItem => {
    const existingReference = Reflect.get(
      addedItem,
      referencedModelProperty,
    ) as Model | null;

    if (existingReference == instance) {
      // TODO - handle @manyToMany
      // TODO - handle isRequired case
      Reflect.set(addedItem, referencedModelProperty, null);
    }
  });

  reaction(
    () => collection.itemIds,
    newIds => {
      Reflect.set(instance, itemIdsPropName, newIds);
    },
  );

  Reflect.defineProperty(instance, propertyName, {
    get() {
      return collection;
    },
    set() {
      throw new Error(
        `Collection which is part of relation cannot be manually overwritten`,
      );
    },
  });

  Reflect.defineProperty(instance, itemIdsPropName, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: collection.itemIds,
  });

  return {
    [itemIdsPropName]: observable,
  };
}

function initializeReferenceProperty(
  instance: Model,
  input: GenericInput,
  propertyData: ReferencePropertyData,
): AnnotationsMap<any, any> {
  const {
    config,
    model,
    referencedModelGetter,
    referencedModelProperty,
    name: propertyName,
  } = propertyData;

  const idPropName = `${propertyName}Id`;

  const referencedModel = referencedModelGetter();

  let stopAwaitingForMissingInstance: () => void;

  function awaitForMissingInstanceToBeAdded() {
    stopAwaitingForMissingInstance?.();
    /**
     * TODO - this is probably not the most performant way of doing this. Right now each item
     * missing reference in the store will check each newly added item.
     *
     * This check, is however quite cheap, so it should probably scale well to quite large
     * numbers of new items being added at once.
     */
    stopAwaitingForMissingInstance = instance.store.onItemAdded.subscribe(
      newItem => {
        const currentlyReferencedId = Reflect.get(input, idPropName);

        if (currentlyReferencedId === newItem.id) {
          stopAwaitingForMissingInstance();

          connectWithTarget(instance, newItem.id);
          return;
        }

        // Referenced id changed and is connected - we don't need to continue waiting
        if (Reflect.get(instance, propertyName)) {
          stopAwaitingForMissingInstance();
          return;
        }
      },
    );
  }

  function connectWithTarget(instance: Model, targetInstanceId: string) {
    assert(
      referencedModelProperty,
      'Cannot connect with target if there is no referenced property',
    );

    const targetInstance = instance.store.getItemById(
      referencedModel,
      targetInstanceId,
    );

    if (!targetInstance) {
      awaitForMissingInstanceToBeAdded();
      return;
    }

    updateModelRelation(
      targetInstance,
      referencedModelProperty,
      instance,
      'add',
    );
  }

  function disconnectWithTarget(instance: Model, targetInstance: Model) {
    assert(
      referencedModelProperty,
      'Cannot disconnect with target if there is no referenced property',
    );

    updateModelRelation(
      targetInstance,
      referencedModelProperty,
      instance,
      'remove',
    );
  }

  Reflect.defineProperty(instance, propertyName, {
    get(this: Model) {
      const targetId = Reflect.get(this, idPropName) as string | null;

      if (!targetId) {
        return null;
      }

      const targetInstance = instance.store.getItemById(
        referencedModel,
        targetId,
      );

      /**
       * Id of target is present, but given item is not found in the store. Initialize awaiting
       * for this item to be added to connect to it as soon as it's inserted
       */

      if (!targetInstance) {
        awaitForMissingInstanceToBeAdded();
        return null;
      }

      // If we were awaiting for item to be added and it's there, stop waiting.
      stopAwaitingForMissingInstance?.();

      return targetInstance;
    },
    set(this: Model, target: Model | null) {
      const currentItem = Reflect.get(this, propertyName) as Model | null;

      if (currentItem === target) {
        return;
      }

      const targetId = target?.id ?? null;
      Reflect.set(this, idPropName, targetId);

      if (currentItem && referencedModelProperty) {
        disconnectWithTarget(this, currentItem);
      }

      if (target && referencedModelProperty) {
        connectWithTarget(this, target.id);
      }
    },
    configurable: true,
    enumerable: true,
  });

  const initialReferencedId = Reflect.get(input, idPropName);

  Reflect.defineProperty(instance, idPropName, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: initialReferencedId,
  });

  Reflect.set(instance, idPropName, initialReferencedId);

  if (initialReferencedId) {
    connectWithTarget(instance, initialReferencedId);
  }

  return {
    [propertyName]: computed,
    [idPropName]: observable,
  };
}

function initializeProperty(
  instance: Model,
  input: GenericInput,
  propertyData: PropertyData,
): AnnotationsMap<any, any> {
  switch (propertyData.type) {
    case 'prop':
      return initializeBasicProperty(instance, input, propertyData);
    case 'referenceCollection':
      return initializeReferenceCollectionProperty(
        instance,
        input,
        propertyData,
      );
    case 'reference':
      return initializeReferenceProperty(instance, input, propertyData);
    case 'referenceId':
      // Reference ID properties are handled by reference type initializers.
      // We dont have to initialize them independently
      return {};
  }

  throw new Error('Incorrect property type');
}

export function initializeProperties(instance: Model, input: GenericInput) {
  const propertiesMap = getModelPropertiesByInstance(instance);

  if (!propertiesMap) {
    return;
  }

  const propertiesEntries = Array.from(propertiesMap);

  const annotationsToAddMap: AnnotationsMap<any, any> = {};

  for (const [propName, propertyData] of propertiesEntries) {
    const newAnnotations = initializeProperty(instance, input, propertyData);

    for (const annotatedPropName in newAnnotations) {
      if (Reflect.get(annotationsToAddMap, annotatedPropName)) {
        throw new Error(`Prop ${annotatedPropName} is defined twice`);
      }

      Reflect.set(
        annotationsToAddMap,
        annotatedPropName,
        newAnnotations[annotatedPropName],
      );
    }
  }

  makeObservable(instance, annotationsToAddMap);
}
