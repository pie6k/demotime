import styled, { css } from 'styled-components';

interface TypographyProps {
  spacing?: number;
}

const typographyStyles = css<TypographyProps>`
  margin-bottom: ${props => props.spacing ?? 0}em;
`;

export const Subheader = styled.h3`
  font-style: normal;
  color: rgb(247, 248, 248);
  font-weight: 500;
  line-height: 32px;
  font-size: 24px;
  letter-spacing: -0.01em;
  text-align: center;

  ${typographyStyles}
`;

export const SecondaryText = styled.p`
  font-style: normal;
  font-weight: normal;
  text-align: center;
  line-height: 23px;
  font-size: 15px;
  color: rgb(138, 143, 152);

  ${typographyStyles}
`;
