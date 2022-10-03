import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { queries as groupQueries } from '../group/graphql';
import {
  IAsset,
  IAssetGroupQeuryResponse,
  IAssetGroupTypes,
  IAssetQueryResponse
} from '../../common/types';
import Form from '../components/Form';
import { ButtonMutate, Spinner } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { mutations, queries } from '../graphql';
import { getRefetchQueries } from '../../common/utils';

type Props = {
  asset: IAsset;
  closeModal: () => void;
};

type FinalProps = {
  assetGroups: IAssetGroupQeuryResponse;
  assets: IAssetQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  renderButton({ name, values, isSubmitted, callback, object }: IButtonMutateProps) {
    const { unitPrice, assetCount, minimiumCount } = values;
    const attachmentMoreArray: any[] = [];
    const attachment = values.attachment || undefined;
    const attachmentMore = values.attachmentMore || [];

    attachmentMore.map(attach => {
      attachmentMoreArray.push({ ...attach, __typename: undefined });
    });

    values.unitPrice = Number(unitPrice);
    values.assetCount = Number(assetCount);
    values.minimiumCount = Number(minimiumCount);
    values.attachment = attachment ? { ...attachment, __typename: undefined } : null;
    values.attachmentMore = attachmentMoreArray;

    return (
      <ButtonMutate
        mutation={object ? mutations.assetEdit : mutations.assetAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        uppercase={false}
        successMessage={`You successfully ${object ? 'updated' : 'added'} a ${name}`}
      />
    );
  }

  render() {
    const { assetGroups, assets } = this.props;

    if (assetGroups.loading || assets.loading) {
      return <Spinner />;
    }

    const updatedProps = {
      ...this.props,
      groups: assetGroups.assetGroups,
      assets: assets.assets,
      renderButton: this.renderButton
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql(gql(groupQueries.assetGroup), {
      name: 'assetGroups'
    }),
    graphql(gql(queries.assets), {
      name: 'assets'
    })
  )(FormContainer)
);
