import { Button, Chooser, ModalTrigger } from '@erxes/ui/src';
import React from 'react';
import { IAsset } from '../../common/types';
import AssetForm from '../../asset/containers/Form';
import { Title } from '@erxes/ui-settings/src/styles';
import { ContainerBox } from '../../style';

type Props = {
  assets: IAsset[];
  refetch: (variables: any) => void;
};

type State = {
  selectedAssets: IAsset[];
  perpage: number;
  searchValue: string;
};

class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.assetChooser = this.assetChooser.bind(this);
    this.assetAddForm = this.assetAddForm.bind(this);

    this.state = {
      selectedAssets: [],
      searchValue: '',
      perpage: 0
    };
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

  assetAddForm(props) {
    const updatedProps = {
      ...props,
      assets: this.props.assets
    };

    return <AssetForm {...updatedProps} />;
  }

  handleSelect(datas) {
    this.setState({ selectedAssets: datas });
  }

  assetChooser({ closeModal }) {
    const { assets } = this.props;

    return (
      <Chooser
        title="Asset Chooser"
        datas={assets}
        data={{}}
        search={this.search}
        clearState={() => this.search('', true)}
        renderForm={this.assetAddForm}
        onSelect={this.handleSelect}
        closeModal={() => closeModal()}
        renderName={asset => asset.name}
        perPage={5}
        limit={5}
      />
    );
  }

  assetChooserTrigger = (<Button>Select Assets</Button>);

  assetChooserContent() {
    return (
      <ModalTrigger
        title="Select Assets"
        content={this.assetChooser}
        trigger={this.assetChooserTrigger}
        size="lg"
      />
    );
  }

  renderContent() {
    return <>{this.assetChooserContent()}</>;
  }

  render() {
    return (
      <>
        <ContainerBox row spaceBetween>
          <Title>Movements</Title>
          {this.renderContent()}
        </ContainerBox>
      </>
    );
  }
}

export default Form;
