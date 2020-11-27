import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useAppContext } from '~/context/app';
import { FirstProjectView } from '~/views/FirstProject';
import { routes } from '~/routes';

export default observer(function IndexPage() {
  const { appState } = useAppContext();

  useEffect(() => {
    if (appState.activeProject) {
      routes.project.home.open({ projectId: appState.activeProject.id });
      return;
    }

    routes.project.new.open({});
  }, []);

  return null;
});
