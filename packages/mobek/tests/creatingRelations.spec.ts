import { autorun } from 'mobx';
import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('serialize', () => {
  class Person extends Model {
    @prop()
    name?: string;
    @oneToMany(() => Dog, 'owner')
    dogs!: Collection<Dog>;
  }

  class Dog extends Model {
    @prop()
    name?: string;
    @manyToOne(() => Person, 'dogs')
    owner?: Person;
  }

  function createTestStore() {
    const store = createStore(
      { person: Person, dog: Dog },
      {
        id: {
          create() {
            return generateTestId();
          },
          validate: () => true,
        },
      },
    );

    return store;
  }

  it('adds target to collection when creating with id in input', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba', ownerId: bob.id });

    expect(bob.dogs.size).toEqual(1);
    expect(dog.owner!.name).toEqual('Bob');
  });

  it('adds target to collection when adding reference after created', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba' });

    dog.owner = bob;

    expect(bob.dogs.size).toEqual(1);
    expect(dog.owner!.name).toEqual('Bob');
  });

  it('removes reference when element removed from collection', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba', ownerId: bob.id });

    bob.dogs.remove(dog);

    expect(bob.dogs.size).toEqual(0);
    expect(dog.owner).toBeFalsy();
  });

  it('triggers autorun on relation changes', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba', ownerId: bob.id });

    const dogsCountSpy = jest.fn();

    autorun(() => {
      dogsCountSpy(bob.dogs.size);
    });

    expect(dogsCountSpy).toHaveBeenLastCalledWith(1);

    dog.owner = undefined;

    expect(dogsCountSpy).toHaveBeenLastCalledWith(0);
  });
});
