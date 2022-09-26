import styled from 'styled-components';
import styledTS from 'styled-components-ts';

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
    flex-direction:${({ row }) => (row ? 'row' : '')} ${({ column }) =>
  column ? 'column' : ''};
    gap: ${({ gap }) => (gap ? `${gap}px` : '')};
    place-items: ${({ align }) => (align ? `${align}` : '')};
    padding: ${({ horizontal, vertical }) =>
      horizontal && vertical
        ? '10px'
        : `${horizontal ? '10px' : '0px'} ${vertical ? '10px' : '0px'}`};
    justify-content: ${({ spaceBetween }) => (spaceBetween ? 'space-between' : '')}
`;
