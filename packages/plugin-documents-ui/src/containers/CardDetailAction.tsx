// import client from '@erxes/ui/src/apolloClient';
// import gql from 'graphql-tag';
import { colors } from '@erxes/ui/src/styles';
import React from 'react';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { rgba } from '@erxes/ui/src/styles/ecolor';
// import { mutations, queries } from '../graphql';
import { getEnv } from '@erxes/ui/src/utils';

type Props = {
  item: any;
};

type FinalProps = {
  saveMutation;
} & Props;

const Button = styledTS<{ color?: string }>(styled.div)`
  height: 25px;
  border-radius: 2px;
  font-weight: 500;
  line-height: 25px;
  font-size: 12px;
  background-color: ${props => rgba(props.color || colors.colorPrimary, 0.1)};
  color: ${props => props.color || colors.colorPrimaryDark};
  padding: 0 10px;
  transition: background 0.3s ease;
  > i {
    margin-right: 5px;
  }
  > span {
    margin-right: 5px;
  }
  &:hover {
    cursor: pointer;
    background-color: ${props => rgba(props.color || colors.colorPrimary, 0.2)};
  }
`;

type State = {
  documents: any[];
  loading: boolean;
};

export default class Container extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = { documents: [], loading: false };
  }

  print = () => {
    const { item } = this.props;

    // this.setState({ loading: true });

    // client
    //   .mutate({
    //     mutation: gql(mutations.documentsPrint),
    //     variables: { contentType: 'cards' },
    //   })
    //   .then(() => {
    //     this.setState({ loading: false });
    //   })
    //   .catch(() => {
    //     this.setState({ loading: false });
    //   });

    window.open(
      `${
        getEnv().REACT_APP_API_URL
      }/pl:documents/print?contentType=cards&itemId=${item._id}&stageId=${
        item.stageId
      }`
    );
  };

  render() {
    return <Button onClick={this.print}>Print document</Button>;
  }
}
