import {
  Button,
  Chooser,
  CollapseContent,
  ControlLabel,
  FormControl,
  FormGroup,
  Icon,
  ModalTrigger,
  MainStyleTitle as Title,
  Wrapper
} from '@erxes/ui/src';
import { dimensions } from '@erxes/ui/src';
import styled from 'styled-components';

import React from 'react';
import { JOURNALS_KEY_LABELS } from '../constants';
import { IContractTypeDetail } from '../types';
import { __ } from 'coreui/utils';
import ProductChooser from '@erxes/ui-products/src/containers/ProductChooser';
import { CollateralButton } from '../../contracts/styles';

const ContentBox = styled.div`
  padding: ${dimensions.coreSpacing}px;
  max-width: 640px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  background: white;
`;

type Props = {
  contractType: IContractTypeDetail;
  saveItem: (doc: IContractTypeDetail, callback?: (item) => void) => void;
};

type State = {
  currentMap: any;
};

class GeneralSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentMap: this.props.contractType.config || {}
    };
  }

  save = e => {
    e.preventDefault();
    const { contractType } = this.props;
    const { currentMap } = this.state;

    this.props.saveItem({ ...contractType, config: currentMap });
  };

  onChangeConfig = (code: string, value) => {
    const { currentMap } = this.state;

    currentMap[code] = value;

    this.setState({ currentMap });
  };

  onChangeInput = (code: string, e) => {
    this.onChangeConfig(code, e.target.value);
  };

  onChangeCheckbox = (code: string, e) => {
    this.onChangeConfig(code, e.target.checked);
  };

  renderItem = (key: string, description?: string, controlProps?: any) => {
    const { currentMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{__(JOURNALS_KEY_LABELS[key])}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          {...controlProps}
          defaultValue={currentMap[key]}
          onChange={this.onChangeInput.bind(this, key)}
        />
      </FormGroup>
    );
  };

  renderCheckbox = (key: string, description?: string, backElement?: any) => {
    const { currentMap } = this.state;

    return (
      <FormGroup>
        <ControlLabel>{__(JOURNALS_KEY_LABELS[key])}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          checked={currentMap[key]}
          onChange={this.onChangeCheckbox.bind(this, key)}
          componentClass="checkbox"
        />
        {backElement}
      </FormGroup>
    );
  };

  renderCollateralTrigger(collateral?: any) {
    let content = (
      <div>
        {__('Choose Collateral')} <Icon icon="plus-circle" />
      </div>
    );

    // if collateral selected
    if (collateral) {
      content = (
        <div>
          {collateral.name} <Icon icon="pen-1" />
        </div>
      );
    }

    return <CollateralButton>{content}</CollateralButton>;
  }

  renderProductModal(collateralData: any, key: string) {
    const collateralOnChange = (collaterals: any[]) => {
      const collateral =
        collaterals && collaterals.length === 1 ? collaterals[0] : null;

      if (collateral) {
        this.onChangeInput.bind(collateral._id, key);
      }
    };

    const content = props => (
      <ProductChooser
        {...props}
        onSelect={collateralOnChange}
        // onChangeCategory={this.onChangeCategory}
        // categoryId={this.state.categoryId}
        data={{
          name: 'Collateral',
          products: collateralData.collateral ? [collateralData.collateral] : []
        }}
        limit={1}
        chooserComponent={Chooser}
      />
    );

    return (
      <ModalTrigger
        title="Choose collateral"
        trigger={this.renderCollateralTrigger(collateralData.collateral)}
        size="lg"
        content={content}
      />
    );
  }

  render() {
    const actionButtons = (
      <Button
        btnStyle="primary"
        onClick={this.save}
        icon="check-circle"
        uppercase={false}
      >
        {__('Save')}
      </Button>
    );

    const content = (
      <ContentBox>
        <CollapseContent title={__('Loan payment')}>
          {this.renderItem('transAccount')}
          {this.renderItem('normalAccount')}
          {this.renderItem('expiredAccount')}
          {this.renderItem('doubtfulAccount')}
          {this.renderItem('negativeAccount')}
          {this.renderItem('badAccount')}
          {this.renderCheckbox('amountHasEBarimt')}
        </CollapseContent>

        <CollapseContent title={__('Interest')}>
          {this.renderItem('interestAccount')}
          {this.renderCheckbox('interestHasEBarimt')}
        </CollapseContent>

        <CollapseContent title={__('Insurance')}>
          {this.renderItem('insuranceAccount')}
        </CollapseContent>

        <CollapseContent title={__('Loss')}>
          {this.renderItem('undueAccount')}
          {this.renderCheckbox('undueHasEBarimt')}
        </CollapseContent>

        <CollapseContent title={__('Other')}>
          {this.renderItem('debtAccount')}
          {this.renderItem('otherReceivable')}
          {this.renderItem('feeIncomeAccount')}
        </CollapseContent>

        <CollapseContent title={__('EBarimt')}>
          {this.renderItem('eBarimtAccount')}
          {this.renderItem('organizationRegister')}
          {this.renderCheckbox(
            'isAmountUseEBarimt',
            undefined,
            this.renderCollateralModal({}, 'amountEBarimtProduct')
          )}
          {this.renderCheckbox(
            'isInterestUseEBarimt',
            undefined,
            this.renderCollateralModal({}, 'amountEBarimtProduct')
          )}
          {this.renderCheckbox(
            'isUndueUseEBarimt',
            undefined,
            this.renderCollateralModal({}, 'amountEBarimtProduct')
          )}
        </CollapseContent>

        <CollapseContent title={__('Classification')}>
          {this.renderItem('normalExpirationDay', 'Normal /Expiration Day/', {
            type: 'number'
          })}
          {this.renderItem('expiredExpirationDay', 'Expired /Expiration Day/', {
            type: 'number'
          })}
          {this.renderItem('doubtExpirationDay', 'Doubt /Expiration Day/', {
            type: 'number'
          })}
          {this.renderItem(
            'negativeExpirationDay',
            'Negative /Expiration Day/',
            {
              type: 'number'
            }
          )}
          {this.renderItem('badExpirationDay', 'Bad /Expiration Day/', {
            type: 'number'
          })}
        </CollapseContent>
        <CollapseContent title={__('Range config')}>
          {this.renderItem('minInterest', 'Min interest /Month/', {
            type: 'number'
          })}
          {this.renderItem('maxInterest', 'Max interest /Month/', {
            type: 'number'
          })}
          {this.renderItem('defaultInterest', 'Default interest /Month/', {
            type: 'number'
          })}
          {this.renderItem('minTenor', 'Min tenor /Month/', {
            type: 'number'
          })}
          {this.renderItem('maxTenor', 'Max tenor /Month/', {
            type: 'number'
          })}
          {this.renderItem('minAmount', 'Min amount /Month/', {
            type: 'number',
            useNumberFormat: true
          })}
          {this.renderItem('maxAmount', 'Max amount /Month/', {
            type: 'number',
            useNumberFormat: true
          })}
        </CollapseContent>
      </ContentBox>
    );

    return (
      <ContentWrapper>
        <Wrapper.ActionBar
          left={<Title>{__('Journals configs')}</Title>}
          right={actionButtons}
        />
        {content}
      </ContentWrapper>
    );
  }
}

export default GeneralSettings;
