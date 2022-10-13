import { TypeBox } from '@erxes/ui-cards/src/deals/styles';
import { ModalTrigger, Icon, Tip, __, FormControl, colors } from '@erxes/ui/src';
import React from 'react';
import { IAsset, IMovementItem } from '../../common/types';
import { ContainerBox, RemoveRow } from '../../style';
import Chooser from '../containers/Chooser';

type Props = {
  item: IMovementItem;
  children: React.ReactNode;
  changeCurrent: (id: string) => void;
  removeRow: (id: string) => void;
  current: string;
  onsSelect: (prevItemId: any, newItem: any) => void;
  selectedItems?: IAsset[];
  isChecked: boolean;
  toggleBulk: (movement: IMovementItem, isChecked?: boolean) => void;
  onChangeBulkItems: (ids: string, checked: boolean) => void;
};

class MovementItems extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      item,
      children,
      changeCurrent,
      current,
      removeRow,
      onsSelect,
      selectedItems,
      isChecked,
      toggleBulk,
      onChangeBulkItems
    } = this.props;

    const { assetId, assetName, branch, department, customer, company, teamMember } = item;

    const trigger = (
      <TypeBox color="#3B85F4">
        <Icon icon="invoice" />
      </TypeBox>
    );

    const renderChooser = props => {
      const ignoreIds = selectedItems?.map(item => item._id);

      const handleSelect = newItem => {
        this.props.onsSelect(assetId, newItem[0]);
      };

      const updatedProps = {
        ...props,
        handleSelect,
        ignoreIds,
        limit: 1
      };
      return <Chooser {...updatedProps} />;
    };

    const renderContent = () => {
      return (
        <ModalTrigger title="Choose Assets" trigger={trigger} content={renderChooser} size="lg" />
      );
    };

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(item, e.target.checked);
        onChangeBulkItems(item.assetId, e.target.checked);
      }
    };
    const onClick = e => {
      e.stopPropagation();
    };
    return (
      <>
        <tr
          id={assetId}
          className={current === assetId ? 'active' : ''}
          onClick={() => changeCurrent(assetId)}
        >
          <td onClick={onClick}>
            <FormControl
              checked={isChecked}
              componentClass="checkbox"
              onChange={onChange}
              color="#3B85F4"
            />
          </td>
          <td>
            <ContainerBox row>
              <Tip text={__('Assets')}>{renderContent()}</Tip>
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
            <td style={{width:40}}/>
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
