import React from 'react';
import { ICar } from '../../types';
import { SectionBodyItem } from '@erxes/ui/src/layout/styles';
import { Link } from 'react-router-dom';
import EmptyState from '@erxes/ui/src/components/EmptyState';

type contentProps = {
  name: string;
  car: ICar;
};

type State = {};

export default class CustomerCompany extends React.Component<
  contentProps,
  State
> {
  constructor(props) {
    super(props);

    this.state = {
      carIds: []
    };
  }

  render() {
    const { name, car } = this.props;

    if (name === 'customers') {
      return (
        <div>
          {car.customers?.map(customer => (
            <SectionBodyItem>
              <Link to={`/contacts/details/${customer._id}`}>
                {customer.firstName || 'Unknown'}
              </Link>
            </SectionBodyItem>
          ))}
          {!car.customerIds?.length && (
            <EmptyState icon="user-6" text="No customer" />
          )}
        </div>
      );
    } else if (name === 'companies') {
      return (
        <div>
          {car.companies?.map(company => (
            <SectionBodyItem>
              <Link to={`/companies/details/${company._id}`}>
                {company.names || 'Unknown'}
              </Link>
            </SectionBodyItem>
          ))}
          {!car.companyIds?.length && (
            <EmptyState icon="building" text="No company" />
          )}
        </div>
      );
    }
  }
}
