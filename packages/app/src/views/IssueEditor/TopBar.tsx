import styled from 'styled-components';
import { useProjectContext } from '~/context/project';
import { routes } from '~/routes';
import { PrimaryButton } from '~/ui/buttons/PrimaryButton';

export function TopBar() {
  const { project } = useProjectContext();
  return (
    <UIHolder>
      <AddIssueButton
        onClick={() => {
          routes.project.addIssue.open({ projectId: project.id });
        }}
      >
        Add Issue
      </AddIssueButton>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 22px 0px 36px;
  height: 57px;
  flex-shrink: 0;
  max-width: 100vw;
  border-bottom: 1px solid rgb(48, 50, 54);
  justify-content: flex-end;
`;

const AddIssueButton = styled(PrimaryButton)`
  border-radius: 4px;
  height: 28px;
  font-size: 12px;
  padding: 0px 12px;
  width: auto;
`;
