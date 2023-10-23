import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './Form';
import React from 'react';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Icon from '@erxes/ui/src/components/Icon';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IMsdynamic, IType } from '../types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { FormControl } from '@erxes/ui/src/components/form';
import { colors, dimensions } from '@erxes/ui/src/styles';

const MsdynamicNameStyled = styledTS<{ checked: boolean }>(styled.div).attrs(
  {}
)`
    color: ${colors.colorCoreBlack};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')}
    `;

export const MsdynamicWrapper = styledTS<{ space: number }>(
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
  msdynamic: IMsdynamic;
  space: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  msdynamics: IMsdynamic[];
  remove: (msdynamic: IMsdynamic) => void;
  edit: (msdynamic: IMsdynamic) => void;
  types?: IType[];
};

type State = {
  checked: boolean;
};

class Row extends React.Component<Props, State> {
  Msdynamics({ msdynamic, checked }) {
    return (
      <MsdynamicNameStyled checked={checked}>
        {msdynamic.name}
      </MsdynamicNameStyled>
    );
  }

  removeMsdynamic = () => {
    const { remove, msdynamic } = this.props;

    remove(msdynamic);
  };

  toggleCheck = () => {
    const { edit, msdynamic } = this.props;

    edit({ _id: msdynamic._id, checked: !msdynamic.checked });
  };

  render() {
    const { msdynamic, renderButton, space, msdynamics, types } = this.props;

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
        msdynamic={msdynamic}
        renderButton={renderButton}
        msdynamics={msdynamics}
      />
    );

    const extractDate = msdynamic.expiryDate
      ? msdynamic.expiryDate?.toString().split('T')[0]
      : '-';

    return (
      <tr>
        <td>
          <MsdynamicWrapper space={space}>
            <FormControl
              componentClass="checkbox"
              onChange={this.toggleCheck}
              color={colors.colorPrimary}
              defaultChecked={msdynamic.checked || false}
            ></FormControl>
            <Margin>
              <this.Msdynamics
                msdynamic={msdynamic}
                checked={msdynamic.checked || false}
              />
            </Margin>
          </MsdynamicWrapper>
        </td>
        <td>{extractDate}</td>
        <td>
          <ActionButtons>
            <ModalTrigger
              title="Edit msdynamic"
              trigger={editTrigger}
              content={content}
            />

            <Tip text={__('Delete')} placement="top">
              <Button
                btnStyle="link"
                onClick={this.removeMsdynamic}
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
