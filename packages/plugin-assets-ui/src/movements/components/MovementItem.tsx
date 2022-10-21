import {
  ContentColumn,
  ItemRow as CommonItemRow,
  ItemText
} from '@erxes/ui-cards/src/deals/styles';
import { FormControl, Icon, __ } from '@erxes/ui/src';
import client from '@erxes/ui/src/apolloClient';
import { Flex } from '@erxes/ui/src/styles/main';
import gql from 'graphql-tag';
import React from 'react';
import { Link } from 'react-router-dom';
import { IMovementItem } from '../../common/types';
import { SelectWithAssets } from '../../common/utils';
import {
  ContainerBox,
  MovementItemConfigContainer,
  MovementItemInfoContainer,
  RemoveRow
} from '../../style';
import { queries as itemQueries } from '../items/graphql';

type Props = {
  item: IMovementItem;
  children: React.ReactNode;
  changeCurrent: (id: string) => void;
  removeRow: (id: string) => void;
  current: string;
  selectedItems?: string[];
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

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(item, e.target.checked);
        onChangeBulkItems(item.assetId, e.target.checked);
      }
    };
    const onClick = e => {
      e.stopPropagation();
    };

    const ItemRow = ({
      label,
      children
    }: {
      label: string;
      children: React.ReactNode;
    }) => {
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
          query: gql(itemQueries.item),
          fetchPolicy: 'network-only',
          variables: { assetId }
        })
        .then(res => {
          let { assetMovementItem } = res.data;
          this.props.handleChangeRowItem(item.assetId, assetMovementItem);
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
            <ContainerBox row>{__(assetName || '-')}</ContainerBox>
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
              <>
                <Flex>
                  <MovementItemInfoContainer>
                    <ItemRow label="Choose Asset:">
                      <SelectWithAssets
                        label="Choose Asset"
                        name="assetId"
                        onSelect={changeRowItem}
                        initialValue={assetId}
                        customOption={{ value: '', label: 'Choose Asset' }}
                      />
                    </ItemRow>
                    <ItemRow label="Branch:">
                      {__(sourceLocations?.branch?.title || '')}
                    </ItemRow>
                    <ItemRow label="Department:">
                      {__(sourceLocations?.department?.title || '')}
                    </ItemRow>
                    <ItemRow label="Customer:">
                      <Link
                        to={`/settings/customer/details/${sourceLocations
                          ?.customer?._id || ''}`}
                      >
                        {__(sourceLocations?.customer?.primaryEmail || '')}
                      </Link>
                    </ItemRow>
                    <ItemRow label="Company:">
                      <Link
                        to={`/settings/company/details/${sourceLocations
                          ?.company?._id || ''}`}
                      >
                        {__(sourceLocations?.company?.primaryEmail || '')}
                      </Link>
                    </ItemRow>
                    <ItemRow label="Team Member:">
                      <Link
                        to={`/settings/team/details/${sourceLocations?.teamMember?._id}`}
                      >
                        {__(sourceLocations?.teamMember?.email || '')}
                      </Link>
                    </ItemRow>
                  </MovementItemInfoContainer>
                  <MovementItemConfigContainer>
                    <ContainerBox column>{children}</ContainerBox>
                  </MovementItemConfigContainer>
                </Flex>
              </>
            </td>
          </tr>
        )}
      </>
    );
  }
}

export default MovementItems;
