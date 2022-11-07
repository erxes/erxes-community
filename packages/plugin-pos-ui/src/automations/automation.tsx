import React from 'react';
import CreatePos from './components/CreatePos';

const Automations = props => {
  const { componentType } = props;

  switch (componentType) {
    case 'actionForm':
      return <CreatePos {...props} />;

    default:
      return null;
  }
};

export default Automations;
