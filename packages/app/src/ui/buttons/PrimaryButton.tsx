import styled from 'styled-components';

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 4px;
  flex-shrink: 0;
  margin: 0px;
  font-weight: 500;
  line-height: normal;
  font-size: 13px;
  transition-property: border, background, color, box-shadow;
  transition-duration: 0.15s;
  user-select: none;
  -webkit-app-region: no-drag;
  min-width: 32px;
  height: 48px;
  width: 100%;
  padding: 0px 24px;
  border: 1px solid rgb(94, 106, 210);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 2px;
  background: rgb(94, 106, 210);
  color: rgb(255, 255, 255);
  font-family: inherit;
  outline: none;

  &:hover {
    background: rgb(113, 124, 225);
    transition-duration: 0s;
  }
`;
