import { action } from 'mobx';
import { ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useRefState } from '~/hooks/state';
import { useShortcut } from '~/utils/keyboard';
import { getSearchString } from '~/utils/string';
import { ZIndex } from '../zIndex';
import { getActionSheetPosition, PositionPoint } from './position';

interface ActionSheetItem {
  icon: ReactNode;
  label: string;
  action: () => void;
}

interface Props {
  hostElementRef: RefObject<HTMLElement>;
  actions: ActionSheetItem[];
  placeholder: string;
  onCloseRequest?: () => void;
}

export function ActionSheet({
  hostElementRef,
  placeholder,
  actions,
  onCloseRequest,
}: Props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const hostElement = useRefState(hostElementRef);
  const [position, setPosition] = useState<PositionPoint>({ x: 0, y: 0 });

  const actionSheetRef = useRef<HTMLDivElement>(null);

  const normalizedSearchKeyword = getSearchString(searchKeyword);

  const actionsToShow = actions.filter(action => {
    if (!normalizedSearchKeyword.length) {
      return true;
    }

    return getSearchString(action.label).includes(normalizedSearchKeyword);
  });

  useShortcut('esc', () => {
    onCloseRequest?.();
  });

  useLayoutEffect(() => {
    const actionSheet = actionSheetRef.current;

    if (!actionSheet || !hostElement) {
      return;
    }

    const optimalPosition = getActionSheetPosition(
      hostElement,
      actionSheet,
      15,
      20,
    );

    setPosition(optimalPosition);
  }, [hostElement]);

  if (!hostElement) {
    return null;
  }

  // TODO: Keyboard support

  return createPortal(
    <UIScreenCover onClick={onCloseRequest}>
      <UIHolder
        ref={actionSheetRef}
        onClick={event => {
          event.stopPropagation();
        }}
        style={{
          top: position.y + 'px',
          left: position.x + 'px',
        }}
      >
        <UISearchInput
          autoFocus
          placeholder={placeholder}
          value={searchKeyword}
          onChange={event => {
            setSearchKeyword(event.target.value);
          }}
        />
        {actionsToShow.map(action => {
          return (
            <UIActionHolder
              key={action.label}
              onClick={() => {
                action.action();
              }}
            >
              <UIActionIconHolder>{action.icon}</UIActionIconHolder>
              <UIActionLabel>{action.label}</UIActionLabel>
            </UIActionHolder>
          );
        })}
      </UIHolder>
    </UIScreenCover>,
    document.body,
  );
}

const UIScreenCover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${ZIndex.ActionSheetOverlay};
`;

const UIHolder = styled.div`
  position: fixed;
  top: 300px;
  left: 300px;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  -webkit-box-flex: 1;
  flex-grow: 1;
  min-width: 0px;
  background: linear-gradient(
    136.61deg,
    rgb(49, 49, 54) 13.72%,
    rgb(43, 43, 50) 74.3%
  );
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 24px;
  max-width: 640px;
  font-size: 13px;
  color: rgb(214, 214, 214);
  overflow: hidden;
`;

const UISearchInput = styled.input`
  padding: 10px 14px 9px;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0px;
  border: none;
  appearance: none;
  font-size: 13px;
  background: transparent;
  color: rgb(214, 214, 214);
  caret-color: rgb(110, 94, 210);
  outline: none;
`;

// 55, 55, 60

const UIActionHolder = styled.div`
  padding: 0px 12px;
  height: 32px;
  background-color: transparent;
  border-left: 2px solid transparent;
  color: rgb(214, 214, 214);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  transition: color 0.15s ease 0s;

  /* Note: When adding keyboard support - :hover will have to be replaced with some sort of flag */
  &:hover {
    background-color: rgb(55, 55, 60);
  }
`;
const UIActionIconHolder = styled.div`
  margin-right: 10px;
`;
const UIActionLabel = styled.div``;
