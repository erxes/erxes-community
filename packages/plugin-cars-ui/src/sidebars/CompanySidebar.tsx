import React from 'react';
import CarSection from '../containers/detail/CarSection';

type Props = {
  id: string;
};

class CustomerSection extends React.Component<Props> {
  render() {
    return <CarSection id={this.props.id} type={'company'} />;
  }
}

export default CustomerSection;
