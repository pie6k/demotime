import { useMemo } from 'react';
import { useAppContext } from '~/context/app';
import { useProjectContext } from '~/context/project';
import { assignLayout } from '~/layout/assign';
import { ProjectLayout } from '~/layout/Project';
import { store } from '~/store';
import { IssuesView } from '~/views/IssuesView';

export default function ProjectHomePage() {
  const { project } = useProjectContext();
  const query = useMemo(
    () =>
      store.createIssueQuery(issue => {
        return issue.project.id === project.id;
      }),
    [project],
  );

  return <IssuesView query={query} />;
}

assignLayout(ProjectLayout, ProjectHomePage);
