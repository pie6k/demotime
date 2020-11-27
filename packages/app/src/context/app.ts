import { createContext, useContext } from 'react';
import { AppState } from '~/store/models';
import { assert } from '~/utils/assert';

export interface AppContext {
  appState: AppState;
}

const appStateContext = createContext<AppContext>(null as any);

export function useAppContext() {
  const appContext = useContext(appStateContext);

  assert(appContext, 'App context is required to use useAppContext');

  return appContext;
}

export const AppContextProvider = appStateContext.Provider;

export function useUser() {
  const user = useAppContext().appState.activeUser;

  assert(user, 'No active user');

  return user;
}
