import _ from 'lodash';
import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import {
  __,
  FieldStyle,
  SidebarCounter,
  SidebarList,
  Table
} from '@erxes/ui/src';
import { FinanceAmount, FlexRow } from '../../styles';
import { IOverallWorkDet } from '../types';
import { ICustomer } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  work: IOverallWorkDet;
};

type State = {};

class PutResponseDetail extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  displayValue(work, name) {
    const value = _.get(work, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  }

  renderRow(label, value) {
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <SidebarCounter>{value || '-'}</SidebarCounter>
        </FlexRow>
      </li>
    );
  }

  renderEditRow(label, key) {
    const value = this.state[key];
    const onChangeValue = e => {
      this.setState({ [key]: Number(e.target.value) } as any);
    };
    return (
      <li>
        <FlexRow>
          <FieldStyle>{__(`${label}`)}:</FieldStyle>
          <FormControl type="number" onChange={onChangeValue} value={value} />
        </FlexRow>
      </li>
    );
  }

  generateLabel = customer => {
    const { firstName, primaryEmail, primaryPhone, lastName } =
      customer || ({} as ICustomer);

    let value = firstName ? firstName.toUpperCase() : '';

    if (lastName) {
      value = `${value} ${lastName}`;
    }
    if (primaryPhone) {
      value = `${value} (${primaryPhone})`;
    }
    if (primaryEmail) {
      value = `${value} /${primaryEmail}/`;
    }

    return value;
  };

  render() {
    const { work } = this.props;
    return (
      <SidebarList>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>{__('Product')}</th>
              <th>{__('Count')}</th>
              <th>{__('Unit Price')}</th>
              <th>{__('Amount')}</th>
            </tr>
          </thead>
          <tbody id="orderItems">
            {/* {(work.items || []).map(item => (
              <tr key={item._id}>
                <td>{item.productName}</td>
                <td>{item.count}</td>
                <td>{item.unitPrice}</td>
                <td>{item.count * item.unitPrice}</td>
              </tr>
            ))} */}
          </tbody>
        </Table>

        {this.renderRow('Total Amount', this.displayValue(work, 'totalAmount'))}

        <ul>
          {this.renderEditRow('Cash Amount', 'cashAmount')}
          {this.renderEditRow('Card Amount', 'cardAmount')}
          {this.renderEditRow('Mobile Amount', 'mobileAmount')}
          {this.renderEditRow('Receivable Amount', 'receivableAmount')}
        </ul>
      </SidebarList>
    );
  }
}

export default PutResponseDetail;
