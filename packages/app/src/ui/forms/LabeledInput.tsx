import { forwardRef } from 'react';
import styled from 'styled-components';

interface Props {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const LabeledInput = forwardRef<HTMLInputElement, Props>(
  function LabeledInput({ label, value, onChange }: Props, ref) {
    return (
      <UIHolder>
        <UILabel>{label}</UILabel>
        <UIInput
          ref={ref}
          value={value}
          onChange={event => {
            onChange?.(event.target.value);
          }}
        />
      </UIHolder>
    );
  },
);

const UIHolder = styled.label``;

const UILabel = styled.div`
  font-style: normal;
  line-height: normal;
  color: rgb(215, 216, 219);
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 10px;
`;

const UIInput = styled.input`
  background: rgb(31, 32, 35);
  border: 1px solid rgb(60, 63, 68);
  border-radius: 4px;
  color: rgb(247, 248, 248);
  margin: 0px;
  appearance: none;
  transition: border 0.15s ease 0s;
  height: 48px;
  padding: 12px;
  width: 100%;
  font-size: 15px;
  outline: none;
  font-family: inherit;

  &:hover {
    border-color: rgb(69, 72, 78);
    transition-duration: 0s;
  }

  &:focus {
    box-shadow: none;
    border-color: rgb(100, 153, 255);
  }
`;
