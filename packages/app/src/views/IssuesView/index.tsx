import { Issue } from '~/store/models';
import { observer } from 'mobx-react';
import { ModelQuery } from '~/model/store/query';
import { TopBar } from './TopBar';
import styled from 'styled-components';
import { IssueLabel } from './IssueLabel';

interface Props {
  query: ModelQuery<Issue>;
}

export const IssuesView = observer(function IssuesView({ query }: Props) {
  const issues = query.results;

  return (
    <UIHolder>
      <TopBar />
      <UIIssues>
        {issues.map(issue => {
          return <IssueLabel key={issue.id} issue={issue} />;
        })}
      </UIIssues>
    </UIHolder>
  );
});

const UIHolder = styled.div``;

const UIIssues = styled.div`
  margin-top: 40px;
`;
