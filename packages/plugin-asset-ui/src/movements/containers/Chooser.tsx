import React from 'react';
import { Chooser, Spinner } from '@erxes/ui/src';
import { IAsset, IAssetQueryResponse } from '../../common/types';
import AssetForm from '../../asset/containers/Form';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries } from '../../asset/graphql';
type Props = {
  closeModal: () => void;
  handleSelect: (datas: IAsset[]) => void;
  selected: any;
};

type FinalProps = {
  assets: IAssetQueryResponse;
} & Props;

type State = {
  perpage: number;
  searchValue: string;
};

class AssetChooser extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.assetAddForm = this.assetAddForm.bind(this);

    this.state = {
      perpage: 0,
      searchValue: ''
    };

    this.search = this.search.bind(this);
  }

  assetAddForm(props) {
    const updatedProps = {
      ...props,
      assets: this.props.assets.assets
    };

    return <AssetForm {...updatedProps} />;
  }

  search(value: string, reload?: boolean) {
    if (!reload) {
      this.setState({ perpage: 0 });
    }
    this.setState({ perpage: this.state.perpage + 5 }, () =>
      this.props.assets.refetch({
        searchValue: value,
        perPage: this.state.perpage
      })
    );
  }

  render() {
    const { closeModal, assets, handleSelect, selected } = this.props;

    if (assets.loading) {
      return <Spinner />;
    }

    return (
      <Chooser
        title="Asset Chooser"
        datas={assets.assets}
        data={{ name: 'Asset', datas: selected }}
        search={this.search}
        clearState={() => this.search('', true)}
        renderForm={this.assetAddForm}
        onSelect={handleSelect}
        closeModal={() => closeModal()}
        renderName={asset => asset.name}
        perPage={5}
      />
    );
  }
}

export default withProps(
  compose(
    graphql(gql(queries.assets), {
      name: 'assets',
      options: () => ({
        variables: {
          perPage: 20,
          searchValue: ''
        },
        fetchPolicy: 'network-only'
      })
    })
  )(AssetChooser)
);
