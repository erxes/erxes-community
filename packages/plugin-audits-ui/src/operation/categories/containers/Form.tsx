import { ButtonMutate } from '@erxes/ui/src';
import { IButtonMutateProps, IQueryParams, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { IOperationCategories, OperationsCategoryQueryResponse } from '../../common/types';
import { refetchQueries } from '../../common/utils';
import Form from '../components/Form';
import { mutations, queries } from '../graphql';

type Props = {
  queryParams: IQueryParams;
  closeModal: () => void;
  categoryId: string;
} & IRouterProps;

type FinalProps = {
  category: OperationsCategoryQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const renderButton = ({ text, values, isSubmitted, callback, object }: IButtonMutateProps) => {
      let mutation = mutations.addCategory;
      // if (object) {
      //   mutation = mutations.movementEdit;
      // }

      return (
        <ButtonMutate
          mutation={mutation}
          variables={values}
          callback={callback}
          refetchQueries={refetchQueries(this.props.queryParams)}
          isSubmitted={isSubmitted}
          type="submit"
          uppercase={false}
          successMessage={`You successfully added a ${text}`}
        />
      );
    };

    const updatedProps = {
      ...this.props,
      renderButton,
      category: this.props?.category?.auditOperationsCategory || ({} as IOperationCategories)
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.operationCategory), {
      name: 'category',
      options: ({ categoryId }) => ({
        variables: { _id: categoryId }
      })
    })
  )(FormContainer)
);
