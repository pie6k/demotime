import { runInAction } from 'mobx';
import { store, initializeStoreFromDatabase } from '~/store';

export async function seedDatabase() {
  runInAction(() => {
    const adam = store.addUser({
      email: 'adam@pietrasiak.com',
      username: 'adam',
      avatarUrl:
        'https://pbs.twimg.com/profile_images/931515880252608512/QTSjkiLX_400x400.jpg',
    });
    store.addUser({
      email: 'jori@linear.app',
      username: 'jori',
      avatarUrl:
        'https://cdn.sanity.io/images/ornj730p/production/dff9dd98ea36ac93a38ef6405abc866dda659f68-492x492.jpg',
    });
    store.addUser({
      email: 'tuomas@linear.app',
      username: 'tuomas',
      avatarUrl:
        'https://cdn.sanity.io/images/ornj730p/production/8ef7c58725a5b2a9f1d5eed0c414e5c931a4a65b-492x492.jpg',
    });
    store.addUser({
      email: 'miha@linear.app',
      username: 'miha',
      avatarUrl:
        'https://cdn.sanity.io/images/ornj730p/production/c995d89c58e7d81b91e9dbc3abe7fdea12f3e4bb-160x160.jpg',
    });

    store.addAppState({ activeUserId: adam.id });
  });
}

export async function seedDatabaseIfEmpty() {
  await initializeStoreFromDatabase();

  const appState = store.createAppStateQuery().results;

  if (appState.length > 0) {
    return;
  }

  await seedDatabase();
}
