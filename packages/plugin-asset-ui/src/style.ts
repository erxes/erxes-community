import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { colors, dimensions } from '@erxes/ui/src/styles';

interface ContainerBoxType {
  row?: boolean;
  column?: boolean;
  gap?: number;
  justifyCenter?: boolean;
  justifyEnd?: boolean;
  align?: string;
  spaceBetween?: boolean;
  spaceAround?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
}

export const ContainerBox = styledTS<ContainerBoxType>(styled.div)`
    display:flex;
    flex-direction:${({ row }) => (row ? 'row' : '')} ${({ column }) => (column ? 'column' : '')};
    gap: ${({ gap }) => (gap ? `${gap}px` : '')};
    place-items: ${({ align }) => (align ? `${align}` : '')};
    padding: ${({ horizontal, vertical }) =>
      horizontal && vertical
        ? '10px'
        : `${horizontal ? '10px' : '0px'} ${vertical ? '10px' : '0px'}`};
    justify-content: ${({ spaceBetween }) => (spaceBetween ? 'space-between' : '')};
    justify-content: ${({ justifyEnd }) => (justifyEnd ? 'end' : '')};
`;

export const InfoDetail = styled.p`
  margin: 0;
  display: block;
  font-size: 12px;
  font-weight: normal;
  color: ${colors.colorCoreGray};
  word-break: break-all;
`;

export const AssetContent = styled.div`
  padding: 12px 22px;
  word-break: break-word;
  background: rgba(10, 30, 65, 0.05);
  margin-top: 10px;
  transition: background 0.3s ease;
  border-radius: 3px;
  min-height: 50px;
  p {
    color: ${colors.textPrimary};
    font-size: 13px;
  }
  img,
  table,
  * {
    max-width: 576px !important;
  }
  ul,
  ol {
    padding-left: 20px;
    margin: 0 0 10px;
  }
  &:hover {
    background: rgba(10, 30, 65, 0.08);
    cursor: pointer;
  }
`;

export const TriggerTabs = styled.div`
    padding: 2px;

    > span {
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      font-weight: 500;
      padding: ${dimensions.unitSpacing - 4}px ${dimensions.coreSpacing}px
      border-radius: ${dimensions.unitSpacing - 5}px;

      &.active {
        background: ${colors.colorSecondary};
        color: ${colors.colorWhite};

        &:before {
          display: none;
        }
      }
    }
`;

export const TabContainer = styled.div`
  border: 1px solid ${colors.borderPrimary};
  border-radius: 5px;
`;

export const TabContent = styled.div`
  margin: 0px 15px;
`;

export const MoreContainer = styled.div`
  position: relative;
`;

export const Badge = styled.span`
  height: 20px;
  width: 20px;
  background-color: ${colors.colorCoreGreen};
  border-radius: 15px;
  text-align: center;
  color: ${colors.colorWhite};
  position: absolute;
  right: 0;
`;
