import styled from 'styled-components';
import { useAppContext } from '~/context/app';
import { assert } from '~/utils/assert';

export function UserMenu() {
  const {
    appState: { activeUser },
  } = useAppContext();

  assert(activeUser, 'No active user');

  return (
    <UIHolder>
      <UIUserButton>
        <UIUserAvatar src={activeUser.avatarUrl} />
        <UIUserName>{activeUser.username}</UIUserName>
      </UIUserButton>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  height: 56px;
  padding: 0 20px;
  display: flex;
  align-items: center;
`;

const UIUserButton = styled.div`
  display: flex;
  align-items: center;
`;

const UIUserAvatar = styled.img<{ imageUrl?: string }>`
  margin-right: 10px;
  margin-left: 1px;
  width: 18px;
  height: 18px;
  font-size: 11px;
  border-radius: 4px;
  object-fit: cover;
`;

const UIUserName = styled.div`
  font-style: normal;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(215, 216, 219);
  font-weight: 500;
  font-size: 13px;
`;
