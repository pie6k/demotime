import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

import { UserMenu } from './UserMenu';
import { MainMenu } from './MainMenu';
import { useAppContext } from '~/context/app';
import { assert } from '~/utils/assert';
import { ProjectContextProvider } from '~/context/project';
import { routes } from '~/routes';

interface Props {
  children: ReactNode;
}

export function ProjectLayout({ children }: Props) {
  const appContext = useAppContext();

  const activeProject = appContext?.appState?.activeProject;

  useEffect(() => {
    if (!activeProject) {
      routes.home.open({});
    }
  }, [activeProject]);

  if (!activeProject) {
    return null;
  }

  return (
    <ProjectContextProvider value={{ project: activeProject }}>
      <UIHolder>
        <UISidebarHolder>
          <UserMenu />
          <MainMenu />
        </UISidebarHolder>
        <UIMainHolder>{children}</UIMainHolder>
      </UIHolder>
    </ProjectContextProvider>
  );
}

const UIHolder = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
`;

const UISidebarHolder = styled.div`
  width: 220px;
  max-width: 50vw;
  min-width: 190px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(48, 50, 54);
  background: rgb(31, 32, 35);
`;

const UIMainHolder = styled.div`
  flex: 1;
`;
