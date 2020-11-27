import { assignLayout } from '~/layout/assign';
import { ProjectLayout } from '~/layout/Project';
import { NewIssueView } from '~/views/NewIssue';

export default function ProjectNewIssue() {
  return <NewIssueView />;
}

assignLayout(ProjectLayout, ProjectNewIssue);
