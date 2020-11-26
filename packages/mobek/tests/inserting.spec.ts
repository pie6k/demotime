import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('inserting', () => {
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

  it('properly adds and connects serialized items', () => {
    const store = createTestStore();

    const data = [
      {
        __model: 'person',
        name: 'Bob',
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        __model: 'dog',
        id: '2',
        name: 'Saba',
        ownerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    store.insert(data);

    const bob = store.getPerson('1');
    const dog = store.getDog('2');

    expect(bob).toBeTruthy();
    expect(dog).toBeTruthy();

    expect(bob!.dogs.size).toEqual(1);
    expect(bob!.dogs.items[0].name).toEqual('Saba');

    expect(dog!.owner!.name).toEqual('Bob');
  });

  it('properly adds and connects serialized items added in reversed order', () => {
    const store = createTestStore();

    const data = [
      {
        __model: 'dog',
        id: '2',
        name: 'Saba',
        ownerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        __model: 'person',
        name: 'Bob',
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    store.insert(data);

    const bob = store.getPerson('1');
    const dog = store.getDog('2');

    expect(bob).toBeTruthy();
    expect(dog).toBeTruthy();

    expect(bob!.dogs.size).toEqual(1);
    expect(bob!.dogs.items[0].name).toEqual('Saba');

    expect(dog!.owner!.name).toEqual('Bob');
  });
});
