import { useMemo } from 'react';
import { useProjectContext } from '~/context/project';
import { assignLayout } from '~/layout/assign';
import { ProjectLayout } from '~/layout/Project';
import { store } from '~/store';
import { IssueStatus } from '~/store/models';
import { IssuesView } from '~/views/IssuesView';

export default function InboxPage() {
  const { project } = useProjectContext();
  const query = useMemo(
    () =>
      store.createIssueQuery(issue => {
        return (
          issue.project.id === project.id &&
          issue.status === IssueStatus.backlog
        );
      }),
    [project],
  );

  return <IssuesView query={query} />;
}

assignLayout(ProjectLayout, InboxPage);
