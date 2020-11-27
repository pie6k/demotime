import { useState } from 'react';
import styled, { css } from 'styled-components';
import { PrimaryButton } from '~/ui/buttons/PrimaryButton';
import Router from 'next/router';

interface IssueChangeData {
  title: string;
  description: string;
}

interface Props {
  initialData: {
    title: string;
    description: string;
  };
  onSave(data: IssueChangeData): void;
  onBack?: () => void;
}

export const IssueEditorView = function IssueEditorView({
  initialData,
  onSave,
  onBack,
}: Props) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);

  function handleSubmit() {
    onSave({ title, description });
  }

  return (
    <UIHolder>
      <UITopBarHolder>
        <GoBackButton
          onClick={() => {
            if (!onBack) {
              Router.back();
              return;
            }
            onBack();
          }}
        >
          Go back
        </GoBackButton>
        <SaveButton
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </SaveButton>
      </UITopBarHolder>
      <UIForm>
        <UITitleInput
          autoFocus
          placeholder="Issue title"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <UIDescriptionInput
          placeholder="Add some details..."
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
      </UIForm>
    </UIHolder>
  );
};

const UIHolder = styled.div``;

const UITopBarHolder = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 22px 0px 36px;
  height: 57px;
  flex-shrink: 0;
  max-width: 100vw;
  border-bottom: 1px solid rgb(48, 50, 54);
  justify-content: space-between;
`;

const SaveButton = styled(PrimaryButton)`
  border-radius: 4px;
  height: 28px;
  font-size: 12px;
  padding: 0px 12px;
  width: auto;
`;

const GoBackButton = styled.a`
  font-style: normal;
  line-height: normal;
  color: rgb(215, 216, 219);
  font-weight: 500;
  font-size: 13px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  user-select: text;
  -webkit-box-flex: 0;
  flex-grow: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UIForm = styled.div`
  padding: 30px 60px;
`;

const inputStyles = css`
  width: 100%;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 22px;
  outline: none;
  cursor: text;
  color: inherit;

  ::placeholder {
    color: #62666d;
  }
`;

const UITitleInput = styled.input`
  ${inputStyles};
  margin-bottom: 30px;
`;

const UIDescriptionInput = styled.textarea`
  ${inputStyles};
  font-weight: 500;
  font-size: 15px;
`;
