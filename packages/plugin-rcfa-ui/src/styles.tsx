import { colors, dimensions } from '@erxes/ui/src';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';

export const StyledContent = styled.div`
  padding: 1rem 1rem 0.5rem 1rem;
`;

export const StyledQuestionItem = styled.div`
  padding-bottom 2rem;
`;
export const SidebarHeader = styled.h5`
  margin-bottom: ${dimensions.coreSpacing}px;
  color: ${colors.colorPrimary};
  padding-left: 10px;
`;
export const ListItem = styledTS<{
  column?: number;
}>(styled.div)`
  display:flex;
  justify-content:space-between;
  background: ${colors.colorWhite};
  padding: 5px;
  margin-bottom: 10px;
  border-left: 2px solid transparent; 
  border-top: none;
  border-radius: 4px;
  box-shadow: none;
  left: auto;
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    box-shadow: 0 2px 8px ${colors.shadowPrimary};
    border-color: ${colors.colorSecondary};
    border-top: none;
  }
  ${props =>
    props.column &&
    css`
      width: ${100 / props.column}%;
      display: inline-block;
    `}
`;

export const ItemBtn = styledTS<{
  color?: string;
}>(styled.div)`
  color: ${({ color }) => (color ? color : '')};
  text-align: end;

  &:hover {
    cursor: pointer;
  }
`;
