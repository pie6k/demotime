import Router from 'next/router';
import { useUser } from '~/context/app';
import { useProjectContext } from '~/context/project';
import { store } from '~/store';
import { IssueStatus } from '~/store/models';
import { IssueEditorView } from '~/views/IssueEditor';

interface Props {}

export function NewIssueView({}: Props) {
  const user = useUser();

  const { project } = useProjectContext();

  return (
    <IssueEditorView
      initialData={{ description: '', title: '' }}
      onBack={() => {
        Router.back();
      }}
      onSave={data => {
        store.addIssue({
          title: data.title,
          description: data.description,
          projectId: project.id,
          assignedUserId: user.id,
          status: IssueStatus.backlog,
        });
        Router.back();
      }}
    />
  );
}
