import { withProps } from '@erxes/ui/src/utils/core';
import React from 'react';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { queries as groupQueries } from '../group/graphql';
import { IAsset, IAssetGroupQeuryResponse, IAssetGroupTypes } from '../../common/types';
import Form from '../components/Form';
import { ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { mutations } from '../graphql';

type Props = {
  asset: IAsset;
  closeModal: () => void;
};

type FinalProps = {
  assetGroups: IAssetGroupQeuryResponse;
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
        type='submit'
        uppercase={false}
        successMessage={`You successfully ${object ? 'updated' : 'added'} a ${name}`}
      />
    );
  }

  render() {
    const { assetGroups } = this.props;

    const updatedProps = {
      ...this.props,
      groups: assetGroups.assetGroup.list,
      renderButton: this.renderButton
    };

    return <Form {...updatedProps} />;
  }
}

const getRefetchQueries = () => {
  return ['assetDetail', 'assets', 'assetsTotalCount', 'assetGroups'];
};

export default withProps<Props>(
  compose(
    graphql(gql(groupQueries.assetGroup), {
      name: 'assetGroups'
    })
  )(FormContainer)
);
