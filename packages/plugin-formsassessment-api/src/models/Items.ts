import { paginate } from '@erxes/api-utils/src';
import { escapeRegExp } from '@erxes/api-utils/src/core';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';
import { sendFormsMessage } from '../messageBroker';
import { validateCalculateMethods, validItems } from '../utils';
import { IItemsField, PaginateField } from './definitions/common';
import {
  IItemsGroupsDocument,
  IItemsDocument,
  itemsGroupsSchema,
  itemsSchema
} from './definitions/items';

export interface IItemsModel extends Model<IItemsDocument> {
  items(
    params: { tagIds: string[] } & IItemsField & PaginateField
  ): Promise<IItemsDocument>;
  itemsTotalCount(
    params: { tagIds: string[] } & IItemsField & PaginateField
  ): Promise<IItemsDocument>;
  itemDetail(params: { _id: string; fieldsSkip: any }): Promise<IItemsDocument>;
  itemAdd(params: IItemsField): Promise<IItemsDocument>;
  itemRemove(_ids: string[]): void;
  itemUpdate(_id?: string, doc?: IItemsField): Promise<IItemsDocument>;
  removeItemUnusedForms(ids: string[]): Promise<IItemsDocument>;
}

const statusColors = {
  Unacceptable: '#393c40',
  Error: '#ea475d',
  Warning: '#f7ce53',
  Danger: '#ff6600',
  Success: '#3ccc38',
  In_Progress: '#3B85F4',
  No_Result: '#888'
};

const generateFilter = (
  params: {
    _id?: string;
    ids?: string[];
    tagIds?: string[];
    ignoreIds?: string[];
    branchId?: string;
    departmentId?: string;
    operationId?: string;
  } & IItemsField &
    PaginateField
) => {
  let filter: any = {};

  if (params._id) {
    filter._id = params._id;
  }

  if (!!params?.ids?.length) {
    filter._id = { $in: params.ids };
  }

  if (params.tagIds) {
    filter.tagIds = { $in: params.tagIds };
  }

  if (params.sortFromDate) {
    if (parseInt(params.sortFromDate)) {
      params.sortFromDate = new Date(parseInt(params.sortFromDate)).toString();
    }
    filter.createdAt = { $gte: new Date(params.sortFromDate) };
  }

  if (params.sortToDate) {
    if (parseInt(params.sortToDate)) {
      params.sortToDate = new Date(parseInt(params.sortToDate)).toString();
    }
    filter.createdAt = {
      ...filter.createdAt,
      $lte: new Date(params.sortToDate)
    };
  }

  if (params.status) {
    filter.statusColor = statusColors[params.status];
  }
  if (params.searchValue) {
    filter.name = { $regex: new RegExp(escapeRegExp(params.searchValue), 'i') };
  }

  if (params.ignoreIds) {
    filter._id = { $nin: params.ignoreIds };
  }

  if (params?.branchId) {
    filter.branchIds = { $in: [params.branchId] };
  }
  if (params?.departmentId) {
    filter.departmentIds = { $in: [params.departmentId] };
  }
  if (params?.operationId) {
    filter.operationIds = { $in: [params.operationId] };
  }

  return filter;
};

const generateOrderFilters = (params: IItemsField & PaginateField) => {
  const filter: any = {};

  filter.createdAt = -1;

  if (params.sortDirection) {
    filter.createdAt = params.sortDirection;
  }

  return filter;
};

export const loadItems = (model: IModels, subdomain: string) => {
  class ItemsClass {
    public static async items(
      params: {
        tagId: string;
        ignoreIds: string[];
      } & IItemsField &
        PaginateField
    ) {
      const filter = generateFilter(params);
      const sort = generateOrderFilters(params);
      return paginate(model.Items.find(filter).sort(sort), params);
    }
    public static async itemsTotalCount(
      params: {
        tagId: string;
        ignoreIds: string[];
      } & IItemsField &
        PaginateField
    ) {
      const filter = generateFilter(params);
      return await model.Items.find(filter).countDocuments();
    }

    public static async itemAdd(params: IItemsField) {
      try {
        await validItems(params);
      } catch (e) {
        throw new Error(e.message);
      }

      return model.Items.create({ ...params });
    }

    public static async itemRemove(_ids: string[]) {
      if (!_ids) {
        throw new Error('Please select a list of assessment IDs');
      }
      try {
        return await model.Items.deleteMany({ _id: { $in: _ids } });
      } catch (e) {
        throw new Error(e.message);
      }
    }

    public static async itemUpdate(_id: string, doc: IItemsField) {
      if (!_id && !doc) {
        throw new Error('Not found assessment');
      }

      try {
        return await model.Items.findByIdAndUpdate(_id, doc);
      } catch (e) {
        throw new Error('Something went wrong');
      }
    }

    public static async itemDetail(params: { _id: string; fieldsSkip: any }) {
      const filter = generateFilter(params);
      const { fieldsSkip } = params;
      if (!filter._id) {
        throw new Error('You must provide a _id parameter');
      }

      return await model.Items.findOne(filter).select(fieldsSkip);
    }

    public static async removeItemUnusedForms(ids: string[]) {
      try {
        await sendFormsMessage({
          subdomain,
          action: 'removeForm',
          data: { $in: ids },
          isRPC: true,
          defaultValue: {}
        });
        return { status: 'removed' };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  itemsSchema.loadClass(ItemsClass);
  return itemsSchema;
};

export interface IItemsGroupsModel extends Model<IItemsGroupsDocument> {
  addGroup(doc: any): Promise<IItemsDocument>;
  updateGroup(_id: string, doc: any): Promise<any>;
  removeGroups(ids: string[]): Promise<any>;
}

export const loadItemsGroups = (models: IModels, subdomain: string) => {
  class ItemsGroupsClass {
    public static async addGroup(doc) {
      await this.validateItemsGroups(doc);

      return await models.ItemsGroups.create({ ...doc });
    }
    public static async updateGroup(_id: string, doc: any) {
      const group = await models.ItemsGroups.findOne({ _id });
      if (!group) {
        throw new Error('Items groups not found');
      }
      await this.validateItemsGroups(doc);
      return await models.ItemsGroups.updateOne(
        { _id },
        { $set: { ...doc, modifiedAt: new Date() } }
      );
    }
    public static async removeGroups(ids: string[]) {
      return await models.ItemsGroups.deleteMany({ _id: { $in: ids } });
    }
    static async validateItemsGroups(params) {
      let totalPercentWeight = 0;

      if ((params.groups || []).length > 1) {
        for (const group of params.groups) {
          if (!group.percentWeight) {
            throw new Error('Group must provide a percent weight');
          }
          totalPercentWeight += group.percentWeight;
        }
        await validateCalculateMethods(params);
      }

      if (totalPercentWeight > 100) {
        throw new Error('Total percent weight must be lower than 100');
      }

      for (const group of params.groups || []) {
        if (!(group.itemIds || []).length) {
          throw new Error('You should select some item each group');
        }
        await validateCalculateMethods(group);
      }
    }
  }

  itemsGroupsSchema.loadClass(ItemsGroupsClass);
  return itemsGroupsSchema;
};
