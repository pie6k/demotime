import { createContext, useContext } from 'react';
import { AppState, Project } from '~/store/models';
import { assert } from '~/utils/assert';

export interface ProjectContext {
  project: Project;
}

const projectContext = createContext<ProjectContext>(null as any);

export function useProjectContext() {
  const appContext = useContext(projectContext);

  assert(appContext, 'App context is required to use useAppContext');

  return appContext;
}

export const ProjectContextProvider = projectContext.Provider;
