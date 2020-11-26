import { Model, createStore, prop, oneToMany, manyToOne } from '../lib';
import { Collection } from '../lib/collection';
import { generateTestId, mockDate } from './utils';

export class Person extends Model {
  @prop()
  name?: string;
  @oneToMany(() => Dog, 'owner')
  dogs!: Collection<Dog>;
}

export class Dog extends Model {
  @prop()
  name?: string;
  @manyToOne(() => Person, 'dogs')
  owner!: Person;
}

export function createTestStore() {
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
