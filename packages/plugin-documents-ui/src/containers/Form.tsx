import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Alert, withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import Form from '../components/Form';
import { mutations, queries } from '../graphql';

type FinalProps = {
  saveMutation;
  history;
};

class Container extends React.Component<FinalProps> {
  render() {
    const { saveMutation, history } = this.props;

    const save = ({ _id, doc }: any) => {
      saveMutation({
        variables: { _id, contentType: 'cards', ...doc }
      })
        .then(() => {
          history.push('/settings/documents');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const updatedProps = {
      ...this.props,
      save
    };

    return <Form {...updatedProps} />;
  }
}

export default withProps(
  compose(
    graphql(gql(queries.documents), {
      name: 'listQuery'
    }),

    // mutations
    graphql(gql(mutations.documentsSave), { name: 'saveMutation' })
  )(Container)
);
