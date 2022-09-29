import React from 'react';
import { ModalTrigger, Icon, FormControl, TextInfo } from '@erxes/ui/src';
import { IAsset } from '../../common/types';
import AssetForm from '../containers/Form';
type Props = {
  asset: IAsset;
  history: any;
  isChecked: boolean;
  toggleBulk: (asset: IAsset, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { asset, history, toggleBulk, isChecked } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(asset, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const onTrClick = () => {
      history.push(`/settings/asset-movements/details/${asset._id}`);
    };

    const content = props => <AssetForm {...props} asset={asset} />;

    const { code, name, type, group, supply, assetCount, minimiumCount, unitPrice, sku } = asset;

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
        <td>{group ? group.name : ''}</td>
        <td>{supply || ''}</td>
        <td>{assetCount ? assetCount : 0}</td>
        <td>{minimiumCount ? minimiumCount : 0}</td>
        <td>{(unitPrice || 0).toLocaleString()}</td>
        <td>{sku}</td>
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
