import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '~/context/app';
import { routes } from '~/routes';
import { store } from '~/store';
import { PrimaryButton } from '~/ui/buttons/PrimaryButton';
import { FigureCard } from '~/ui/cards/FigureCard';
import { LabeledInput } from '~/ui/forms/LabeledInput';
import { SecondaryText, Subheader } from '~/ui/typo';

export function FirstProjectView() {
  const [name, setName] = useState('');
  const appContext = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (!name) {
      inputRef.current?.focus();
      return;
    }

    const newProject = store.addProject({
      name,
      userId: appContext.appState.activeUser!.id,
    });

    appContext.appState.activeProject = newProject;

    routes.project.home.open({ projectId: newProject.id });
  }
  return (
    <UIHolder>
      <UIContent>
        <UIIntro>
          <Subheader spacing={0.5}>Create a new workspace</Subheader>
          <SecondaryText spacing={2}>
            Workspaces are shared environments where teams can work on projects,
            cycles and tasks.
          </SecondaryText>
        </UIIntro>
        <FormCard>
          <LabeledInput
            ref={inputRef}
            label="Workspace Name"
            value={name}
            onChange={setName}
          />
        </FormCard>
        <SubmitButton onClick={handleSubmit}>Create workspace</SubmitButton>
      </UIContent>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UIContent = styled.div`
  width: 460px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
`;

const UIIntro = styled.div``;

const FormCard = styled(FigureCard)`
  margin-bottom: 50px;
`;

const SubmitButton = styled(PrimaryButton)`
  width: 340px;
  max-width: 90vw;
  margin: auto;
`;
