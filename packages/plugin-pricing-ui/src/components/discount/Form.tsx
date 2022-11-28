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
import GeneralStep from './step/General';
import OptionsStep from './step/Options';
import PriceStep from './step/Price';
import QuantityStep from './step/Quantity';
import RepeatStep from './step/Repeat';
import ExpiryStep from './step/Expiry';
import { DiscountData } from '../../types';

type Props = {
  submit: (data: any) => void;
  data: any;
};

export default function Form(props: Props) {
  const { submit, data = {} } = props;

  // Hooks
  const [formValues, setFormValues] = useState<DiscountData>({
    // General
    name: data.name ? data.name : '',
    status: data.status ? data.status : 'active', // "active", "archive", "draft", "completed"
    type: data.type ? data.type : 'fixed', // "fixed", "subtraction", "percentage", "bonus"
    value: data.value ? data.value : 0,
    bonusProduct: data.bonusProduct ? data.bonusProduct : null,

    applyType: data.applyType ? data.applyType : 'category', // "product", "category"
    products: data.products ? data.products : [],
    productsExcluded: data.productExcluded ? data.productExcluded : [],
    categories: data.categories ? data.categories : [],
    categoriesExcluded: data.categoriesExcluded ? data.categoriesExcluded : [],

    isStartDateEnabled: data.isStartDateEnabled
      ? data.isStartDateEnabled
      : false,
    isEndDateEnabled: data.isEndDateEnabled ? data.isEndDateEnabled : false,
    startDate: data.startDate ? data.startDate : null,
    endDate: data.endData ? data.endData : null,

    // Options
    departmentIds: data.departmentIds ? data.departmentIds : [],
    branchIds: data.branchIds ? data.branchIds : [],
    boardId: data.boardId ? data.boardId : null,
    pipelineId: data.pipelineId ? data.pipelineId : null,
    stageId: data.stageId ? data.stageId : null,

    // Rules
    isQuantityEnabled: data.isQuantityEnabled ? data.isQuantityEnabled : false,
    quantityRules: data.quantityRules ? data.quantityRules : [],

    isPriceEnabled: data.isPriceEnabled ? data.isPriceEnabled : false,
    priceRules: data.priceRules ? data.priceRules : [],

    isExpiryEnabled: data.isExpiryEnabled ? data.isExpiryEnabled : false,
    expiryRules: data.expiryRules ? data.expiryRules : [],

    isRepeatEnabled: data.isRepeatEnabled ? data.isRepeatEnabled : false,
    repeatRules: data.repeatRules ? data.repeatRules : []
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

    if (document.quantityRules)
      document.quantityRules.map(
        (item: any) => item.__typename && delete item.__typename
      );

    if (document.priceRules)
      document.priceRules.map(
        (item: any) => item.__typename && delete item.__typename
      );

    if (document.expiryRules)
      document.expiryRules.map(
        (item: any) => item.__typename && delete item.__typename
      );

    if (document.repeatRules)
      document.repeatRules.map(
        (item: any) => item.__typename && delete item.__typename
      );

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
        <Step img="/images/icons/erxes-12.svg" title="General">
          <GeneralStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-03.svg" title="Options">
          <OptionsStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-06.svg" title="Price">
          <PriceStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-24.svg" title="Quantity">
          <QuantityStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-21.svg" title="Repeat">
          <RepeatStep formValues={formValues} handleState={handleState} />
        </Step>
        <Step img="/images/icons/erxes-14.svg" title="Expiry">
          <ExpiryStep formValues={formValues} handleState={handleState} />
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
}
