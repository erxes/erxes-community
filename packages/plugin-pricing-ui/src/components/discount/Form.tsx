import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// erxes
import Button from '@erxes/ui/src/components/Button';
import Step from '@erxes/ui/src/components/step/Step';
import Steps from '@erxes/ui/src/components/step/Steps';
import { __ } from '@erxes/ui/src/utils';
import {
  StepWrapper,
  ControlWrapper,
  Indicator
} from '@erxes/ui/src/components/step/styles';
// local
import ContentStep from './step/ContentStep';

const Form = () => {
  const [formValues, setFormValues] = useState<any>({
    name: '',
    amount: 0,
    products: [],
    productCategory: []
  });

  const handleState = (key: string, value: any) => {
    const tempState = { ...formValues };
    tempState[key] = value;

    setFormValues(tempState);
  };

  const renderButtons = () => {
    const cancelButton = (
      <Link to="/pricing/discount">
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}
        <Button btnStyle="success" icon="check-circle">
          {/* {isActionLoading && <SmallLoader />} */}
          Save
        </Button>
      </Button.Group>
    );
  };

  return (
    <StepWrapper>
      <Steps>
        <Step img="/images/icons/erxes-12.svg" title="Content">
          <ContentStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-13.svg" title="Content">
          <ContentStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-14.svg" title="Content">
          <ContentStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-15.svg" title="Content">
          <ContentStep formValues={formValues} handleState={handleState} />
        </Step>
      </Steps>
      <ControlWrapper>
        <Indicator>
          {__('You are creating')} <strong>{__('Discount')}</strong>
        </Indicator>
        {renderButtons()}
      </ControlWrapper>
    </StepWrapper>
  );
};

export default Form;
