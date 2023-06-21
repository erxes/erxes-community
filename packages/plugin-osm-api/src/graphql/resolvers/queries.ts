import { ADDRESS_API_URL, ROUTE_API_URL } from '../../constants';
import { IContext } from '@erxes/api-utils/src/types';
import { sendRequest } from '@erxes/api-utils/src';

interface IOsmAddress {
  fullAddress: string;
  country: string;
  countryCode: string;
  city: string;
  district: string;
  quarter: string;
  road: string;
  state: string;
  postcode: string;
  houseNumber: string;

  lat: number;
  lng: number;

  osmId: string;
  osmType: string;
  boundingbox: string[];
}

type RouteParams = {
  start: {
    lat: number;
    lng: number;
  };
  end: {
    lat: number;
    lng: number;
  };

  profile: 'car' | 'bike' | 'foot';
  alternatives?: number;
  steps?: boolean;
  annotations?: boolean;
  geometries?: string;
  overview?: string;
};

const getDistrict = (address: any) => {
  if (address.district) {
    return address.district;
  }

  if (address.city_district) {
    return address.city_district;
  }

  if (address.suburb) {
    return address.suburb;
  }

  if (address.borough) {
    return address.borough;
  }

  if (address.subdivision) {
    return address.subdivision;
  }

  return '';
};

const getQuarter = (address: any) => {
  if (address.quarter) {
    return address.quarter;
  }

  if (address.neighbourhood) {
    return address.neighbourhood;
  }

  if (address.allotments) {
    return address.allotments;
  }

  return '';
};

const getState = (address: any) => {
  if (address.state) {
    return address.state;
  }

  if (address.county) {
    return address.county;
  }

  if (address.region) {
    return address.region;
  }

  return '';
};

const convertToOsmAddress = (
  obj: any,
  lat?: number,
  lng?: number
): IOsmAddress => ({
  fullAddress: obj.display_name,
  country: obj.address.country,
  countryCode: obj.address.country_code,
  city: obj.address.city,
  district: getDistrict(obj.address),
  quarter: getQuarter(obj.address),
  road: obj.address.road,
  state: getState(obj.address),
  postcode: obj.address.postcode,
  houseNumber: obj.address.house_number,

  lat: Number(lat || obj.lat),
  lng: Number(lng || obj.lon),

  osmId: obj.osm_id,
  osmType: obj.osm_type,
  boundingbox: obj.boundingbox
});

const osmQueries = {
  async osmReverseGeoLocation(
    _root,
    { location, language },
    _context: IContext
  ) {
    const { lat, lng } = location;
    try {
      const result = await sendRequest({
        url: `${ADDRESS_API_URL}/reverse`,
        method: 'GET',
        params: {
          format: 'json',
          lat,
          lon: lng,
          zoom: '18',
          addressdetails: '1',
          'accept-language': language || 'en'
        }
      });

      if (!result) {
        throw new Error('Address not found');
      }

      const address = convertToOsmAddress(result, lat, lng);

      return { ...address, lat, lng };
    } catch (err) {
      throw new Error(err);
    }
  },

  async osmSearchAddress(_root, { query, language }, _context: IContext) {
    const url = `${ADDRESS_API_URL}/search?q=${query
      .split(' ')
      .filter(word => word.length > 1)
      .join('+')}&format=json&addressdetails=1`;

    try {
      const result = await sendRequest({
        url,
        method: 'GET',
        params: {
          'accept-language': language || 'en'
        }
      });

      if (!result || !result.length) {
        throw new Error('Address not found');
      }

      const addresses: IOsmAddress[] = result.map(r => convertToOsmAddress(r));

      return addresses;
    } catch (err) {
      throw new Error(err);
    }
  },

  async osmFindRoutes(_root, args: RouteParams, _context: IContext) {
    const { start, end, profile = 'car', ...params } = args;

    if (params.alternatives && params.alternatives > 3) {
      throw new Error('Maximum number of alternatives is 3');
    }

    try {
      const result = await sendRequest({
        url: `${ROUTE_API_URL}/route/v1/${profile || 'car'}/${start.lng},${
          start.lat
        };${end.lng},${end.lat}`,
        method: 'GET',
        params: params as any
      });

      if (!result) {
        throw new Error('Route not found');
      }

      if (result.code !== 'Ok') {
        throw new Error(result.code);
      }

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};

export default osmQueries;
