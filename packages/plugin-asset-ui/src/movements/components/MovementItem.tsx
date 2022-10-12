import { TypeBox } from '@erxes/ui-cards/src/deals/styles';
import { FlexContent, Icon, Tip, __ } from '@erxes/ui/src';
import React from 'react';
import { IMovementItem } from '../../common/types';
import { ContainerBox, RemoveRow } from '../../style';

type Props = {
  item: IMovementItem;
  children: React.ReactNode;
  changeCurrent: (id: string) => void;
  removeRow: (id: string) => void;
  current: string;
};

class MovementItems extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, children, changeCurrent, current, removeRow } = this.props;

    const { assetId, assetName, branch, department, customer, company, teamMember } = item;

    return (
      <>
        <tr
          id={assetId}
          className={current === assetId ? 'active' : ''}
          onClick={() => changeCurrent(assetId)}
        >
          <td>
            <ContainerBox row>
              <Tip text={__('Assets')}>
                <TypeBox color="#3B85F4">
                  <Icon icon="invoice" />
                </TypeBox>
              </Tip>
              {__(assetName || '-')}
            </ContainerBox>
          </td>
          <td>{__(branch?.title || '-')}</td>
          <td>{__(department?.title || '-')}</td>
          <td>{__(customer?.primaryEmail || '-')}</td>
          <td>{__(company?.primaryEmail || '-')}</td>
          <td>{__(teamMember?.email || '-')}</td>
          <td>
            <RemoveRow>
              <Icon onClick={() => removeRow(assetId)} icon="times-circle" />
            </RemoveRow>
          </td>
        </tr>
        {current === assetId && (
          <tr>
            <td>
              <ContainerBox row gap={5} justifyCenter>
                <strong>{__('Move to')}</strong>
                <Icon icon="rightarrow" />
              </ContainerBox>
            </td>
            {children}
          </tr>
        )}
      </>
    );
  }
}

export default MovementItems;
