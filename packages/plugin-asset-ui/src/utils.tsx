import { generateCategoryOptions } from '@erxes/ui/src/utils';
import { ASSET_TYPE_CHOISES, ASSET_CATEGORIES_STATUS_FILTER } from './constants';

export { generateCategoryOptions };

export const assetTypeChoises = __ => {
  const options: Array<{ value: string; label: string }> = [];

  for (const key of Object.keys(ASSET_TYPE_CHOISES)) {
    options.push({
      value: key,
      label: __(ASSET_TYPE_CHOISES[key])
    });
  }

  return options;
};

export const categoryStatusChoises = __ => {
  const options: Array<{ value: string; label: string }> = [];

  for (const key of Object.keys(ASSET_CATEGORIES_STATUS_FILTER)) {
    options.push({
      value: key,
      label: __(ASSET_CATEGORIES_STATUS_FILTER[key])
    });
  }

  return options;
};
