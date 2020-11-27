import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { createTestStore } from './testStore';
import { generateTestId, mockDate } from './utils';

describe('hello', () => {
  const store = createTestStore();

  it('updates updatedAt on updates', () => {
    const dateMock = mockDate();

    const bob = store.addPerson({ name: 'Bob' });

    const start = new Date();

    expect(bob.createdAt).toEqual(start);
    expect(bob.updatedAt).toEqual(start);

    dateMock.forward(1000);

    bob.name = 'Tom';

    expect(bob.updatedAt).not.toEqual(start);
    expect(bob.updatedAt.getTime()).toEqual(start.getTime() + 1000);
  });

  // it.skip('works2', () => {
  //   const store = createStore(
  //     { person: Person, dog: Dog },
  //     {
  //       id: {
  //         create() {
  //           return generateTestId();
  //         },
  //         validate: () => true,
  //       },
  //     },
  //   );

  //   const bob = store.addPerson({ name: 'Bob' });
  //   const dog = store.addDog({ name: 'Saba', ownerId: bob.id });
  //   const dog2 = store.addDog({ name: 'Saba', ownerId: bob.id });

  //   const dogs = store.createDogQuery(dog => {
  //     return dog.name === 'Saba';
  //   });

  //   expect(dogs.results).toHaveLength(2);

  //   store.removeDog(dog);

  //   expect(dogs.results).toHaveLength(1);

  //   const dog3 = store.addDog({ name: 'Saba', ownerId: bob.id });

  //   expect(dogs.results).toHaveLength(2);

  //   dog3.name = 'Lol';

  //   expect(dogs.results).toHaveLength(1);
  // });
});
