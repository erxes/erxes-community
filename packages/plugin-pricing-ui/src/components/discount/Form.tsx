import React, { useState, useEffect } from 'react';
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
import ContentStep from './step/Contents';
import OptionsStep from './step/Options';
import RulesStep from './step/Rules';
import ExpirationStep from './step/Expiration';

type Props = {
  submit: (data: any) => void;
  data: any;
};

const Form = (props: Props) => {
  const { submit, data = {} } = props;

  // Hooks
  const [formValues, setFormValues] = useState<any>({
    // Contents
    name: data.name ? data.name : '',
    status: data.status ? data.status : 'active',
    amountValue: data.amountValue ? data.amountValue : 0,
    amountType: data.amountType ? data.amountType : 'fixed', // "fixed", "percentage"

    applyType: data.applyType ? data.applyType : 'category', // "product", "category"

    products: data.products ? data.products : [],
    productsExcluded: data.productExcluded ? data.productExcluded : [],
    categories: data.categories ? data.categories : [],
    categoriesExcluded: data.categoriesExcluded ? data.categoriesExcluded : [],

    // Rules
    quantityType: data.quantityType ? data.quantityType : null, // null || "minimum" || "exact",
    quantityValue: data.quantityValue ? data.quantityValue : null,
    minPurchaseEnabled: data.minPurchaseEnabled
      ? data.minPurchaseEnabled
      : false,
    minPurchaseValue: data.minPurchaseValue ? data.minPurchaseValue : 0,

    // Options
    departmentIds: data.departmentIds ? data.departmentIds : [],
    branchIds: data.branchIds ? data.branchIds : [],
    unitIds: data.unitIds ? data.unitIds : []

    // Schedules
  });

  useEffect(() => data.name && setFormValues(data), [data]);

  // Functions
  const handleState = (key: string, value: any) => {
    const tempState = { ...formValues };
    tempState[key] = value;

    setFormValues(tempState);
  };

  const handleSubmit = () => {
    const document: any = { ...formValues };

    if (document.__typename) delete document.__typename;

    submit(document);
  };

  const renderButtons = () => {
    const cancelButton = (
      <Link to="/pricing/discounts">
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}
        <Button btnStyle="success" icon="check-circle" onClick={handleSubmit}>
          {/* {isActionLoading && <SmallLoader />} */}
          Save
        </Button>
      </Button.Group>
    );
  };

  return (
    <StepWrapper>
      <Steps>
        <Step img="/images/icons/erxes-12.svg" title="Contents">
          <ContentStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-24.svg" title="Rules">
          <RulesStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-03.svg" title="Options">
          <OptionsStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-21.svg" title="Expiration">
          <ExpirationStep formValues={formValues} handleState={handleState} />
        </Step>
      </Steps>
      <ControlWrapper>
        <Indicator>
          {__('You are ') + (data._id ? __('editing') : __('creating'))}{' '}
          <strong>{__('Discount')}</strong>
        </Indicator>
        {renderButtons()}
      </ControlWrapper>
    </StepWrapper>
  );
};

export default Form;
