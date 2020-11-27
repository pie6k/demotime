import { useMemo } from 'react';
import { useUser } from '~/context/app';
import { useProjectContext } from '~/context/project';
import { assignLayout } from '~/layout/assign';
import { ProjectLayout } from '~/layout/Project';
import { store } from '~/store';
import { IssuesView } from '~/views/IssuesView';

export default function AssignedIssuesPage() {
  const { project } = useProjectContext();
  const user = useUser();
  const query = useMemo(
    () =>
      store.createIssueQuery(issue => {
        return issue.project.id === project.id && issue.assignedUser === user;
      }),
    [project],
  );

  return <IssuesView query={query} />;
}

assignLayout(ProjectLayout, AssignedIssuesPage);
