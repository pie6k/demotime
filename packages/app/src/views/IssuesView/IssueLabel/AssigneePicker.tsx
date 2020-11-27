import {
  allowedIssueStatus,
  getIssueStatusColor,
  getIssueStatusName,
  Issue,
  IssueStatus,
} from '~/store/models';
import { observer } from 'mobx-react';
import { uiStateStore } from '~/store/uistate';
import { computed, runInAction } from 'mobx';
import styled, { css } from 'styled-components';
import { useRef } from 'react';
import { ActionSheet } from '~/ui/ActionSheet';
import { allUsersQuery } from '~/queries/user';

interface Props {
  issue: Issue;
  // currentStatus: IssueStatus;
  // onChange(status: IssueStatus): void
}

export const AssigneePicker = observer(function StatusPicker({ issue }: Props) {
  const pickerRef = useRef<HTMLDivElement>(null);

  const isActive = computed(() => {
    return uiStateStore.pickerOwner === pickerRef;
  }).get();

  return (
    <>
      <AssigneeAvatar
        ref={pickerRef}
        onClick={() => {
          runInAction(() => {
            uiStateStore.pickerOwner = pickerRef;
          });
        }}
        avatarUrl={issue.assignedUser?.avatarUrl}
      />
      {isActive && (
        <ActionSheet
          placeholder="Assign to..."
          hostElementRef={pickerRef}
          onCloseRequest={() => {
            uiStateStore.pickerOwner = null;
          }}
          actions={allUsersQuery.results.map(user => {
            return {
              action: () => {
                issue.assignedUser = user;
                uiStateStore.pickerOwner = null;
              },
              icon: <AssigneeAvatar avatarUrl={user.avatarUrl} />,
              label: user.username,
            };
          })}
        />
      )}
    </>
  );
});

const AssigneeAvatar = styled.div<{ avatarUrl?: string }>`
  height: 18px;
  width: 18px;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  ${props => {
    if (props.avatarUrl) {
      return css`
        background-image: url(${props.avatarUrl});
      `;
    }
  }}
`;
