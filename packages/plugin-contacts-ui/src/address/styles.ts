import { colors, dimensions } from '@erxes/ui/src/styles';
import styled from 'styled-components';

const AddressDetail = styled.div`
  border-bottom: 1px solid ${colors.borderPrimary};
  display: flex;
  align-items: baseline;

  button {
    margin-left: ${dimensions.unitSpacing}px;
    padding: 3px 6px;
  }
`;

export { AddressDetail };
