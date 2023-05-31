import { colors, dimensions } from '@erxes/ui/src';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';
import { Contents } from '@erxes/ui/src/layout/styles';

export const StyledContent = styled.div`
  padding: 0 1rem;
`;

export const StyledListItem = styled.div`
  padding: 10px;
`;
export const Divider = styled.div`
  text-align: center;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${colors.colorCoreLightGray};
  margin: 20px 0;

  > span {
    margin: 0 20px;
  }

  &:before,
  &:after {
    content: '';
    flex: 1;
    height: 0;
    align-self: center;
    border-bottom: 1px solid ${colors.borderPrimary};
  }
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
  align-items:center;
  padding:20px 10px

  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    box-shadow: 0 2px 8px ${colors.shadowPrimary};
    border-color: ${colors.colorSecondary};
    border-top: none;
    cursor: pointer;
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

export const TriggerTabs = styled.div`
  box-shadow: 0 2px 8px ${colors.shadowPrimary};
  margin-bottom:10px;
  .hxZkUW {
    border: 1px solid ${colors.borderPrimary};
    border-radius: 5px;
    padding: 2px;

    > span {
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      font-weight: 500;
      padding: ${dimensions.unitSpacing - 4}px ${dimensions.coreSpacing}px
      border-radius: ${dimensions.unitSpacing - 5}px;
      border-right: 1px solid ${colors.colorCoreGray}

      &.active {
        background: ${colors.colorSecondary};
        color: ${colors.colorWhite};

        &:before {
          display: none;
        }
      }
    }
  }
`;

export const TabCaption = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TabAction = styled.div`
  padding-left: ${dimensions.unitSpacing}px;
  color: ${colors.colorCoreGray};
  text-align: end;

  &:hover {
    cursor: pointer;
  }
`;
export const IssueItem = styled.div`
  background-color: #0000000f;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;

export const CustomRangeContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  display: flex;
  align-items: flex-end;
  > div {
    flex: 1;
    margin-right: 10px;
    input[type='text'] {
      border: none;
      width: 100%;
      height: 34px;
      padding: 5px 0;
      color: #444;
      border-bottom: 1px solid;
      border-color: #ddd;
      background: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 13px;
    }
  }
`;

export const EndDateContainer = styled.div`
  .rdtPicker {
    left: -98px !important;
  }
`;

export const HeightedWrapper = styled.div`
  flex: 1;
  position: relative;
`;

export const AutomationFormContainer = styled(Contents)`
  margin: 0;

  > section {
    margin: 0;
  }
`;
