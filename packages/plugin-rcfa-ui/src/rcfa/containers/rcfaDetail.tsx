import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { graphql } from '@apollo/client/react/hoc';
import { gql } from '@apollo/client';
import { queries } from '../graphql';
import { jsPlumb } from 'jsplumb';
import { AutomationFormContainer, HeightedWrapper } from '../../styles';

const plumb: any = jsPlumb;

let instance;

type Props = {
  rcfaDetail?: any;
};

class rcfaDetail extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HeightedWrapper>
          <AutomationFormContainer>detail</AutomationFormContainer>
        </HeightedWrapper>
      </>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.rcfa), {
      name: 'rcfaDetail',
      options: (props: any) => ({
        variables: {
          _id: props.match.params.id
        }
      })
    })
  )(rcfaDetail)
);
