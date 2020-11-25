import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { generateTestId } from './utils';

describe('hello', () => {
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
    owner!: Person;
  }

  it('world', () => {
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

    const bob = store.addPerson({ name: 'Bob' });
    const dog = store.addDog({ name: 'Saba', ownerId: bob.id });

    expect(dog.owner.name).toEqual('Bob');
    expect(bob.dogs.size).toBe(1);
    expect(bob.dogs.items[0].name).toEqual('Saba');

    store.removeDog(dog.id);

    expect(bob.dogs.size).toBe(0);
  });

  it.skip('works2', () => {
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

    const bob = store.addPerson({ name: 'Bob' });
    const dog = store.addDog({ name: 'Saba', ownerId: bob.id });
    const dog2 = store.addDog({ name: 'Saba', ownerId: bob.id });

    const dogs = store.createDogQuery(dog => {
      return dog.name === 'Saba';
    });

    expect(dogs.results).toHaveLength(2);

    store.removeDog(dog);

    expect(dogs.results).toHaveLength(1);

    const dog3 = store.addDog({ name: 'Saba', ownerId: bob.id });

    expect(dogs.results).toHaveLength(2);

    dog3.name = 'Lol';

    expect(dogs.results).toHaveLength(1);
  });
});
