import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IKbcgw, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';

const KbcgwNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs({})`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const KbcgwWrapper = styledTS<{ space: number }>(
  styled.div
)`padding-left: ${props => props.space * 20}px;
  display:inline-flex;
  justify-content:flex-start;
  align-items: center;
`;

const Margin = styledTS(styled.div)`
 margin: ${dimensions.unitSpacing}px;
`;

type Props = {
  kbcgw: IKbcgw;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  kbcgws: IKbcgw[];
  remove: (kbcgw: IKbcgw) => void;
  edit: (kbcgw: IKbcgw) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Kbcgws({ kbcgw, checked }) {
    return <KbcgwNameStyled checked={checked}>{kbcgw.name}</KbcgwNameStyled>;
  }

  removeKbcgw = () => {
    const { remove, kbcgw } = this.props;

    remove(kbcgw);
  };

  toggleCheck = () => {
    const { edit, kbcgw } = this.props;

    edit({ _id: kbcgw._id, checked: !kbcgw.checked });
  };

  render() {
    const { kbcgw, renderButton, space, kbcgws, types } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="top">
          <Icon icon="edit-3"></Icon>
        </Tip>
      </Button>
    );

    const content = props => (
      <Form
        {...props}
        types={types}
        kbcgw={kbcgw}
        renderButton={renderButton}
        kbcgws={kbcgws}
      />
    );

    const extractDate = kbcgw.expiryDate
      ? kbcgw.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <KbcgwWrapper space={space}>
            <FormControl
              componentClass="checkbox"
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={kbcgw.checked || false}
            ></FormControl>
            <Margin>
              <this.Kbcgws kbcgw={kbcgw} checked={kbcgw.checked || false} />
            </Margin>
          </KbcgwWrapper>
        </td>
        <td>{extractDate}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              title="Edit kbcgw"
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement="top">
              <Button
                btnStyle="link"
                onClick={this.removeKbcgw}
                icon="times-circle"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
