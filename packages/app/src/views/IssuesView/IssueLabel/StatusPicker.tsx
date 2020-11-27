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
import styled from 'styled-components';
import { useRef } from 'react';
import { ActionSheet } from '~/ui/ActionSheet';

interface Props {
  issue: Issue;
  // currentStatus: IssueStatus;
  // onChange(status: IssueStatus): void
}

export const StatusPicker = observer(function StatusPicker({ issue }: Props) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const isActive = computed(() => {
    return uiStateStore.pickerOwner === pickerRef;
  }).get();

  return (
    <>
      <IssueStatusCircle
        ref={pickerRef}
        onClick={() => {
          runInAction(() => {
            uiStateStore.pickerOwner = pickerRef;
          });
        }}
        status={issue.status}
      />
      {isActive && (
        <ActionSheet
          placeholder="Set status..."
          hostElementRef={pickerRef}
          onCloseRequest={() => {
            uiStateStore.pickerOwner = null;
          }}
          actions={allowedIssueStatus.map(issueStatus => {
            return {
              action: () => {
                issue.status = issueStatus;
                uiStateStore.pickerOwner = null;
              },
              icon: <PickerStatusCircle status={issueStatus} />,
              label: getIssueStatusName(issueStatus),
            };
          })}
        />
      )}
    </>
  );
});

const IssueStatusCircle = styled.div<{ status: IssueStatus }>`
  height: 14px;
  width: 14px;
  border-radius: 14px;
  border: 2px solid ${props => getIssueStatusColor(props.status)};
  margin-right: 10px;
`;

const PickerStatusCircle = styled(IssueStatusCircle)`
  margin: 0;
`;
