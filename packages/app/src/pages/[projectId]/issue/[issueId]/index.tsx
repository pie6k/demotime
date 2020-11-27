import { assignLayout } from '~/layout/assign';
import { ProjectLayout } from '~/layout/Project';
import { observer } from 'mobx-react';
import { routes } from '~/routes';
import { store } from '~/store';
import { IssueEditorView } from '~/views/IssueEditor';
import { assert } from '~/model/utils/assert';
import Router from 'next/router';

const IssueDetailsPage = observer(function IssueDetailsPage() {
  const params = routes.project.issueDetails.useParams();

  // Router has empty values initially. TODO: Handle case where params are incorrect.
  if (!params.issueId) {
    return null;
  }

  const issue = store.getIssue(params.issueId);

  // TODO: Handle error instead
  assert(issue, 'Incorrect issue');

  return (
    <IssueEditorView
      initialData={{ title: issue.title, description: issue.description }}
      onSave={({ title, description }) => {
        issue.title = title;
        issue.description = description;
        Router.back();
      }}
    />
  );
});

export default IssueDetailsPage;

assignLayout(ProjectLayout, IssueDetailsPage);
