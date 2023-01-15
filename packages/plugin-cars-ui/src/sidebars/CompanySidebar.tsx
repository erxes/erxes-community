import React from 'react';
import CarSection from '../containers/CarSection';

type Props = {
  id: string;
};

class CustomerSection extends React.Component<Props> {
  render() {
    return <CarSection mainType={'company'} mainTypeId={this.props.id} />;
  }
}

export default CustomerSection;
