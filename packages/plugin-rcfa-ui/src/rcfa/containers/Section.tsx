import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Section from '../components/Section';

type Props = {
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {} & Props;

class SectionContainer extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <Section />;
  }
}

export default withProps<Props>(compose()(SectionContainer));
