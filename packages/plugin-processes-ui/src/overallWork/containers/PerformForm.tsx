import * as compose from 'lodash.flowright';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import Form from '../components/PerformForm';
import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { IFlowDocument } from '../../flow/types';
import { IJobRefer } from '../../job/types';
import { mutations } from '../graphql';
import { queries } from '../graphql';
import { withProps } from '@erxes/ui/src/utils';
import { IOverallWorkDet } from '../../overallWork/types';
import { IProductsData } from '../../types';
import { IPerform } from '../types';

type Props = {
  closeModal: () => void;
  history: any;
  overallWorkDetail?: IOverallWorkDet;
  perform?: IPerform;
  max?: number;
};

type FinalProps = {} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const { overallWorkDetail, max } = this.props;

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback
    }: IButtonMutateProps) => {
      const { count, performNeedProducts, performResultProducts } = values;

      const doc = {
        startAt: new Date(),
        endAt: new Date(),
        dueDate: new Date(),
        overallWorkId: overallWorkDetail?._id,
        status: 'new',
        count: Number(count).toString(),
        needProducts: performNeedProducts,
        resultProducts: performResultProducts
      };

      return (
        <ButtonMutate
          mutation={mutations.performAdd}
          variables={doc}
          callback={callback}
          refetchQueries={getRefetchQueries('test refetch')}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${name}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton
    };

    return (
      <Form {...updatedProps} overallWorkDetail={overallWorkDetail} max={max} />
    );
  }
}

const getRefetchQueries = test => {
  return [
    'performsByOverallWorkId',
    'performsByOverallWorkIdTotalCount',
    'jobRefersAllQuery',
    'flowsAllQuery'
  ];
};

export default withProps<Props>(compose()(ProductFormContainer));
