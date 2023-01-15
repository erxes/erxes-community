import React from 'react';
import CarSection from '../containers/CarSection';

type Props = {
  id: string;
};

class CustomerSection extends React.Component<Props> {
  render() {
    return <CarSection mainType={'deal'} mainTypeId={this.props.id} />;
  }
}

export default CustomerSection;
