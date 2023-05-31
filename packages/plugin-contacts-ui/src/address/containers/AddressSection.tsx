import { gql, useMutation } from '@apollo/client';
import React from 'react';
import AddressSection from '../components/AddressSection';
// import { mutations, queries } from '../../graphql';
import { IAddress } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  _id: string;
  type: 'customer' | 'company';
  addresses: IAddress[];
};

const customerAddressMutation = gql`
  mutation CustomersEditAddresses($id: String!, $addresses: [JSON]) {
    customersEditAddresses(_id: $id, addresses: $addresses) {
      _id
    }
  }
`;

const companyAddressMutation = gql`
  mutation CompaniesEditAddresses($id: String!, $addresses: [JSON]) {
    companiesEditAddresses(_id: $id, addresses: $addresses) {
      _id
    }
  }
`;

function Container(props: Props) {
  const { _id } = props;

  //   const participantsQuery = useQuery(gql(queries.participants), {
  //     variables: { dealId },
  //     fetchPolicy: 'network-only'
  //   });

  const [editMutation] = useMutation(customerAddressMutation);

  const editAddresses = (newAddresses: IAddress[]) => {
    // console.log('editAddresses', addresses);
    editMutation({
      variables: { id: _id, addresses: newAddresses }
    });
  };

  return <AddressSection {...props} save={editAddresses} />;
}

export default Container;
