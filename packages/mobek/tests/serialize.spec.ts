import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('serialize', () => {
  beforeEach(() => {
    const dateMock = mockDate();
  });

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

  it('serializes only properties and reference ids', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });

    expect(bob.serialize()).toEqual({
      __model: 'person',
      name: 'Bob',
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('doesnt serialize referenced objects', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba', ownerId: bob.id });

    expect(dog.serialize()).toEqual({
      __model: 'dog',
      id: '2',
      name: 'Saba',
      ownerId: bob.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('serializes id when relation added by reference', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba' });

    dog.owner = bob;

    expect(dog.serialize()).toEqual({
      __model: 'dog',
      id: '2',
      name: 'Saba',
      ownerId: bob.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('doesnt serialize referenced properties on 2nd side of the relation', () => {
    const store = createTestStore();
    const bob = store.addPerson({ name: 'Bob', id: '1' });
    const dog = store.addDog({ id: '2', name: 'Saba' });

    dog.owner = bob;

    expect(bob.serialize()).toEqual({
      __model: 'person',
      name: 'Bob',
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
});
