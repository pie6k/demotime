import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useProjectContext } from '~/context/project';
import { routes } from '~/routes';
import { Issue } from '~/store/models';
import { AssigneePicker } from './AssigneePicker';
import { StatusPicker } from './StatusPicker';
import { format } from 'date-fns';

interface Props {
  issue: Issue;
}

export const IssueLabel = observer(function IssueLabel({ issue }: Props) {
  const { project } = useProjectContext();
  return (
    <UIHolder>
      <StatusPicker issue={issue} />

      <UILabel
        onClick={() => {
          routes.project.issueDetails.open({
            issueId: issue.id,
            projectId: project.id,
          });
        }}
      >
        {issue.title}
      </UILabel>
      <UIDate>{format(issue.createdAt, 'MMM d')}</UIDate>
      <AssigneePicker issue={issue} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

const UILabel = styled.div`
  font-weight: 500;
  font-size: 13px;
  flex: 1;
`;

const UIDate = styled.div`
  font-style: normal;
  line-height: normal;
  font-weight: normal;
  color: rgb(138, 143, 152);
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  font-variant-numeric: tabular-nums;
  min-width: 45px;
  margin-right: 10px;
`;

const IssueStatusCircle = styled.div`
  height: 14px;
  width: 14px;
  border-radius: 14px;
  border: 2px solid #fff;
  margin-right: 10px;
`;
