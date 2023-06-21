import { gql, useQuery, useLazyQuery } from '@apollo/client';
import React from 'react';
import EditForm from '../components/EditForm';
// import { mutations, queries } from '../../graphql';
import { IAddress } from '@erxes/ui-contacts/src/customers/types';

type Props = {
  addresses: IAddress[];
  closeModal: () => void;
  onSave: (addresses: IAddress[]) => void;
};

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
  //   const participantsQuery = useQuery(gql(queries.participants), {
  //     variables: { dealId },
  //     fetchPolicy: 'network-only'
  //   });
  const [searchValue, setSearchValue] = React.useState('');

  const [
    reverseGeoLocationQuery,
    { data: reverseGeoLocationData }
  ] = useLazyQuery(reverseGeoLocationQry);
  //   const [
  //     searchAddressQuery,
  //     { data: searchAddressData, loading: searchLoading },
  //   ] = useQuery(searchAddressQry);

  const { data, loading, error } = useQuery(searchAddressQry, {
    fetchPolicy: 'network-only',
    skip: !searchValue,
    variables: {
      query: searchValue
    }
  });

  const reverseGeoLocation = (location: any, callback: any) => {
    reverseGeoLocationQuery({
      variables: { location }
    }).then(res => {
      callback(res.data.osmReverseGeoLocation);
    });
  };

  return (
    <EditForm
      {...props}
      searchLoading={loading}
      searchResult={data?.osmSearchAddress || []}
      searchAddress={setSearchValue}
      reverseGeoJson={reverseGeoLocation}
    />
  );
}

export default Container;
