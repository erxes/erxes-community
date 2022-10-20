import {
  ContentColumn,
  ItemRow as CommonItemRow,
  ItemText,
  TypeBox
} from '@erxes/ui-cards/src/deals/styles';
import { FormControl, Icon, ModalTrigger, Tip, __ } from '@erxes/ui/src';
import client from '@erxes/ui/src/apolloClient';
import { Flex } from '@erxes/ui/src/styles/main';
import gql from 'graphql-tag';
import React from 'react';
import { Link } from 'react-router-dom';
import { IAsset, IMovementItem } from '../../common/types';
import { SelectWithAssets } from '../../common/utils';
import {
  ContainerBox,
  MovementItemConfigContainer,
  MovementItemInfoContainer,
  RemoveRow
} from '../../style';
import Chooser from '../containers/Chooser';
import { queries } from '../graphql';

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
  handleChangeRowItem: (prevItemId, newItem) => void;
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

    const {
      assetId,
      assetName,
      branch,
      department,
      customer,
      company,
      teamMember,
      sourceLocations
    } = item;

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

    const ItemRow = ({ label, children }: { label: string; children: React.ReactNode }) => {
      return (
        <CommonItemRow>
          <ItemText>{__(label)}</ItemText>
          <ContentColumn flex="3">{children}</ContentColumn>
        </CommonItemRow>
      );
    };

    const changeRowItem = assetId => {
      client
        .query({
          query: gql(queries.itemCurrentLocation),
          fetchPolicy: 'network-only',
          variables: { assetId }
        })
        .then(res => {
          const { currentLocationAssetMovementItem } = res.data;
          this.props.handleChangeRowItem(item.assetId, currentLocationAssetMovementItem);
        });
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
            <td style={{ width: 40 }} />
            <td colSpan={7}>
              <Flex>
                <MovementItemInfoContainer>
                  <ItemRow label="Choose Asset:">
                    <SelectWithAssets
                      label="Choose Asset"
                      name="assetId"
                      onSelect={changeRowItem}
                      skip={item.assetId}
                      customOption={{ value: '', label: 'Choose Asset' }}
                    />
                  </ItemRow>
                  <ItemRow label="Asset:">{`${__(assetName || '')}`}</ItemRow>
                  <ItemRow label="Branch:">{`${__(sourceLocations.branch?.title || '')} / ${__(
                    branch?.title || ''
                  )}`}</ItemRow>
                  <ItemRow label="Department:">{`${__(sourceLocations.department?.title)} / ${__(
                    department?.title || ''
                  )}`}</ItemRow>
                  <ItemRow label="Customer:">
                    <Link to={`/settings/customer/details/${sourceLocations?.customer?._id || ''}`}>
                      {__(sourceLocations.customer?.primaryEmail || '')}
                    </Link>
                    &nbsp; / &nbsp;
                    <Link to={`/settings/customer/details/${customer?._id || ''}`}>
                      {__(customer?.primaryEmaill || '')}
                    </Link>
                  </ItemRow>
                  <ItemRow label="Company:">
                    <Link to={`/settings/company/details/${sourceLocations.company?._id || ''}`}>
                      {__(sourceLocations.company?.primaryEmail || '')}
                    </Link>
                    /
                    <Link to={`/settings/company/details/${company?._id}`}>
                      {__(company?.primaryEmail || '')}
                    </Link>
                  </ItemRow>
                  <ItemRow label="Team Member:">
                    <Link to={`/settings/team/details/${sourceLocations.teamMember?._id}`}>
                      {__(sourceLocations.teamMember?.email || '')}
                    </Link>
                    &nbsp; / &nbsp;
                    <Link to={`/settings/team/details/${teamMember?._id}`}>
                      {__(teamMember?.email || '')}
                    </Link>
                  </ItemRow>
                </MovementItemInfoContainer>
                <MovementItemConfigContainer>
                  <ContainerBox column>{children}</ContainerBox>
                </MovementItemConfigContainer>
              </Flex>
            </td>
          </tr>
        )}
      </>
    );
  }
}

export default MovementItems;
