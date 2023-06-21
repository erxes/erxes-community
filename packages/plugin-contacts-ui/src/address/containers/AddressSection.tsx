import { gql, useMutation, useLazyQuery } from '@apollo/client';
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

const osmAddressFields = `
  fullAddress
  city
  country
  countryCode

  district
  houseNumber
  lat
  lng
  osmId
  osmType
  postcode
  quarter
  road
  state
  boundingbox
`;

const reverseGeoLocationQry = gql`
query OsmReverseGeoLocation($location: Location!, $language: String) {
  osmReverseGeoLocation(location: $location, language: $language) {
    ${osmAddressFields}
  }
}
`;

const searchAddressQry = gql`
query OsmSearchAddress($query: String!, $language: String) {
  osmSearchAddress(query: $query, language: $language) {
    ${osmAddressFields}
  }
}
`;

function Container(props: Props) {
  const { _id } = props;

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
