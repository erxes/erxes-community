import * as compose from 'lodash.flowright';

import { IOverallWorkDocument } from '../types';
import { IJobRefer } from '../../job/types';

import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import Form from '../components/perform/PerformForm';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { IFlowDocument } from '../../flow/types';
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations } from '../graphql';
import { queries } from '../graphql';
import { withProps } from '@erxes/ui/src/utils';

type Props = {
  closeModal: () => void;
  history: any;
  overallWorkDetail: IOverallWorkDocument;
  max: number;
  jobRefers: IJobRefer[];
  flows: IFlowDocument[];
};

type FinalProps = {} & Props;

class ProductFormContainer extends React.Component<FinalProps> {
  render() {
    const { overallWorkDetail, max, jobRefers, flows } = this.props;

    const renderButton = ({
      name,
      values,
      isSubmitted,
      callback
    }: IButtonMutateProps) => {
      const { count, performNeedProducts, performResultProducts } = values;

      // for (const need of performNeedProducts) {
      //   need.product = '';
      //   need.uom = '';
      // }

      // for (const result of performResultProducts) {
      //   result.product = '';
      //   result.uom = '';
      // }

      const doc = {
        startAt: new Date(),
        endAt: new Date(),
        dueDate: new Date(),
        overallWorkId: overallWorkDetail._id,
        status: 'new',
        count: Number(count).toString(),
        needProducts: performNeedProducts,
        resultProducts: performResultProducts
      };

      return (
        <ButtonMutate
          mutation={mutations.performsAdd}
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
      <Form
        {...updatedProps}
        overallWorkDetail={overallWorkDetail}
        max={max}
        jobRefers={jobRefers}
        flows={flows}
      />
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
