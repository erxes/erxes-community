import React from 'react';
import { ModalTrigger, Icon, FormControl, TextInfo, Button, Tip, router } from '@erxes/ui/src';
import { IAsset } from '../../common/types';
import AssetForm from '../containers/Form';
import { MoreContainer, Badge, ContainerBox } from '../../style';
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

    const handleParent = () => {
      router.setParams(history, { parentId: this.props.asset._id });
    };

    const content = props => <AssetForm {...props} asset={asset} />;

    const { code, name, category, parent, chidlAssetCount, unitPrice } = asset;

    return (
      <tr onClick={onTrClick}>
        <td onClick={onClick}>
          <FormControl checked={isChecked} componentClass="checkbox" onChange={onChange} />
        </td>
        <td>{code}</td>
        <td>{name}</td>
        <td>{category ? category.name : ''}</td>
        <td>{parent ? parent.name : ''}</td>
        <td>{(unitPrice || 0).toLocaleString()}</td>
        <td onClick={onClick}>
          <ContainerBox row gap={10} justifyEnd>
            {chidlAssetCount > 0 && (
              <MoreContainer>
                <Button btnStyle="link" onClick={handleParent}>
                  <Tip text="See Child Assets">
                    <Icon icon="list-2" />
                  </Tip>
                </Button>
                <Badge>{chidlAssetCount}</Badge>
              </MoreContainer>
            )}
            <ModalTrigger
              title="Edit basic info"
              trigger={<Icon icon="edit" />}
              size="lg"
              content={content}
            />
          </ContainerBox>
        </td>
      </tr>
    );
  }
}
export default Row;
