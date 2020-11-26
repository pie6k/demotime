import { autorun, runInAction } from 'mobx';
import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('query', () => {
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

  it('will return items matching the query and update them on changes', () => {
    const store = createTestStore();

    const bob = store.addPerson({ name: 'Bob' });
    const dog = store.addDog({ name: 'Saba', ownerId: bob.id });
    const dog2 = store.addDog({ name: 'Saba', ownerId: bob.id });

    const dogs = store.createDogQuery(dog => {
      return dog.name === 'Saba';
    });

    expect(dogs.results).toHaveLength(2);

    store.removeDog(dog.id);

    expect(dogs.results).toHaveLength(1);

    const dog3 = store.addDog({ name: 'Saba', ownerId: bob.id });

    expect(dogs.results).toHaveLength(2);

    dog3.name = 'Lol';

    expect(dogs.results).toHaveLength(1);
  });

  it('will properly update results in autorun', () => {
    const store = createTestStore();

    const bob = store.addPerson({ name: 'Bob' });
    const dog = store.addDog({ name: 'Saba', ownerId: bob.id });
    const dog2 = store.addDog({ name: 'Saba', ownerId: bob.id });

    const dogs = store.createDogQuery(dog => {
      return dog.name === 'Saba';
    });

    const resultsSpy = jest.fn();

    const stop = autorun(() => {
      resultsSpy(dogs.results.length);
    });

    expect(resultsSpy).toHaveBeenLastCalledWith(2);

    store.removeDog(dog.id);

    expect(resultsSpy).toHaveBeenLastCalledWith(1);

    const dog3 = store.addDog({ name: 'Saba', ownerId: bob.id });

    expect(resultsSpy).toHaveBeenLastCalledWith(2);

    runInAction(() => {
      dog3.name = 'Lol';
    });

    expect(resultsSpy).toHaveBeenLastCalledWith(1);

    stop();
  });
});
