import React from 'react';
import { Chooser } from '@erxes/ui/src';
import { IAsset } from '../../common/types';
import AssetForm from '../../asset/containers/Form';
type Props = {
  datas: IAsset[];
  refetch: (variables: any) => void;
  closeModal: () => void;
  handleSelect: (datas: IAsset[]) => void;
};

type State = {
  perpage: number;
  searchValue: string;
};

class AssetChooser extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetAddForm = this.assetAddForm.bind(this);

    this.state = {
      perpage: 0,
      searchValue: ''
    };
  }

  assetAddForm(props) {
    const updatedProps = {
      ...props,
      assets: this.props.datas
    };

    return <AssetForm {...updatedProps} />;
  }

  search(value: string, reload?: boolean) {
    if (!reload) {
      this.setState({ perpage: 0 });
    }
    this.setState({ perpage: this.state.perpage + 5 }, () =>
      this.props.refetch({
        searchValue: value,
        perPage: this.state.perpage
      })
    );
  }

  render() {
    const { closeModal, datas, handleSelect } = this.props;

    return (
      <Chooser
        title="Asset Chooser"
        datas={datas}
        data={{}}
        search={this.search}
        clearState={() => this.search('', true)}
        renderForm={this.assetAddForm}
        onSelect={handleSelect}
        closeModal={() => closeModal()}
        renderName={asset => asset.name}
        perPage={5}
        limit={5}
      />
    );
  }
}

export default AssetChooser;
