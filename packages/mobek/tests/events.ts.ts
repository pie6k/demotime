import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('events', () => {
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

  it('fires add and remove events', () => {
    const store = createTestStore();

    const addedSpy = jest.fn();
    const removedSpy = jest.fn();

    store.onItemAdded(addedSpy);
    store.onItemRemoved(removedSpy);

    expect(addedSpy).toBeCalledTimes(0);
    expect(removedSpy).toBeCalledTimes(0);

    const bob = store.addPerson({ name: 'Bob', id: '1' });

    expect(addedSpy).toBeCalledTimes(1);
    expect(addedSpy).toHaveBeenLastCalledWith(bob);

    expect(removedSpy).toBeCalledTimes(0);

    store.removePerson(bob.id);

    expect(addedSpy).toBeCalledTimes(1);

    expect(removedSpy).toBeCalledTimes(1);
    expect(removedSpy).toHaveBeenLastCalledWith(bob);
  });
});
