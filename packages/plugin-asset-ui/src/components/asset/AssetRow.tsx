import { FormControl } from '@erxes/ui/src/components/form';
import Icon from '@erxes/ui/src/components/Icon';
import Tags from '@erxes/ui/src/components/Tags';
import TextInfo from '@erxes/ui/src/components/TextInfo';
import React from 'react';
import { IAsset } from '../../types';
import { __ } from '@erxes/ui/src/utils/core';
import AssetForm from '@erxes/ui-assets/src/containers/AssetForm';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';

type Props = {
  asset: IAsset;
  history: any;
  isChecked: boolean;
  toggleBulk: (asset: IAsset, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  render() {
    const { asset, history, toggleBulk, isChecked } = this.props;

    const tags = asset.getTags || [];

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(asset, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const onTrClick = () => {
      history.push(`/settings/asset-service/details/${asset._id}`);
    };

    const content = props => <AssetForm {...props} asset={asset} />;

    const { code, name, type, category, supply, assetCount, minimiumCount, unitPrice, sku } = asset;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl checked={isChecked} componentClass="checkbox" onChange={onChange} />
        </td>
        <td>{code}</td>
        <td>{name}</td>
        <td>
          <TextInfo>{type}</TextInfo>
        </td>
        <td>{category ? category.name : ''}</td>
        <td>{supply || ''}</td>
        <td>{assetCount ? assetCount : 0}</td>
        <td>{minimiumCount ? minimiumCount : 0}</td>
        <td>{(unitPrice || 0).toLocaleString()}</td>
        <td>{sku}</td>
        <td>
          <Tags tags={tags} limit={2} />
        </td>
        <td onClick={onClick}>
          <ModalTrigger
            title="Edit basic info"
            trigger={<Icon icon="edit" />}
            size="lg"
            content={content}
          />
        </td>
      </tr>
    );
  }
}

export default Row;
