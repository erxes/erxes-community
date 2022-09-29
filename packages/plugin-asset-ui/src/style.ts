import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { colors, dimensions } from '@erxes/ui/src/styles';

interface ContainerBoxType {
  row?: boolean;
  column?: boolean;
  gap?: number;
  justifyCenter?: boolean;
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
    justify-content: ${({ spaceBetween }) => (spaceBetween ? 'space-between' : '')}
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
