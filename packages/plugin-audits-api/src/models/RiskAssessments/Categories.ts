import { paginate } from '@erxes/api-utils/src';
import { escapeRegExp } from '@erxes/api-utils/src/core';
import { Model } from 'mongoose';
import { IModels } from '../../connectionResolver';
import { sendFormsMessage } from '../../messageBroker';
import { IRiskAssessmentCategoriesField, PaginateField, IRiskAssessmentCategoriesDocument } from '../../common/types/riskAssessment';
import { riskAssessmentCategoriesSchema } from '../definitions/riskAssessments';

export interface IRiskAssessmentCategoriesModel extends Model<IRiskAssessmentCategoriesDocument> {
  addCategory(params: IRiskAssessmentCategoriesField): Promise<IRiskAssessmentCategoriesDocument>;
  removeCategory(params: { _id: string }): Promise<IRiskAssessmentCategoriesDocument>;
  editCategory(params: IRiskAssessmentCategoriesField): Promise<IRiskAssessmentCategoriesDocument>;
  getCategories(params: IRiskAssessmentCategoriesField): Promise<IRiskAssessmentCategoriesDocument>;
  getCategory(_id: string): Promise<IRiskAssessmentCategoriesDocument>;
  getFormDetail(_id: string): Promise<IRiskAssessmentCategoriesDocument>;
  removeUnsavedRiskAssessmentCategoryForm(formId: string): Boolean;
}

const generateFilter = (params: IRiskAssessmentCategoriesField & PaginateField) => {
  let filter: any = {};

  if (params.formId) {
    filter.formId = params.formId;
  }

  if (params.code) {
    filter.code = params.code;
  }
  if (params.searchValue) {
    filter.name = { $regex: new RegExp(escapeRegExp(params.searchValue), 'i') };
  }

  return filter;
};

export const loadAssessmentCategories = (models: IModels, subdomain: string) => {
  class CategoriesClass {
    public static addCategory = async (params: IRiskAssessmentCategoriesField) => {
      const { name, code, parentId } = params;
      if (!params) {
        throw new Error('please type the assessment category fields');
      }

      const isParamsHasError = await this.checkParams(params, true);

      if (isParamsHasError) {
        throw new Error(isParamsHasError);
      }

      const order = await this.getOrder(parentId, code, name);

      const result = models.RiskAssessmentCategories.create({ ...params, order });
      return result;
    };

    public static getCategories = (params: IRiskAssessmentCategoriesField) => {
      const filter = generateFilter(params);

      return paginate(models.RiskAssessmentCategories.find(filter), params);
    };

    public static getCategory = async (_id: string) => {
      const category = await models.RiskAssessmentCategories.findOne({ _id }).lean();

      if (!category) {
        throw new Error('Not found assessment category');
      }

      const parent = await models.RiskAssessmentCategories.findOne({ _id: category.parentId });

      if (parent) {
        category.parent = parent;
      }

      const form = await sendFormsMessage({
        subdomain,
        action: 'findOne',
        data: {
          _id: category.formId
        },
        isRPC: true,
        defaultValue: {}
      });

      if (form) {
        const formfields = await sendFormsMessage({
          subdomain,
          action: 'fields.find',
          data: {
            contentId: form._id,
            contentType: 'form'
          },
          isRPC: true,
          defaultValue: []
        });
        category.formName = form.title;
      }

      return category;
    };

    public static removeCategory = async (params: { _id: string }) => {
      if (!params._id) {
        throw new Error('Not found risk assessment category');
      }

      const { _id, formId } = await models.RiskAssessmentCategories.findOne({
        _id: params._id
      }).lean();

      try {
        const riskAssessments = await models.RiskAssessments.find({ categoryId: { $in: _id } });
        const riskAssessmentIds = riskAssessments.map(p => p._id);
        await models.RiskAssessments.deleteMany({ categoryId: _id });
        await models.RiskConformities.deleteMany({ riskAssessmentId: { $in: riskAssessmentIds } });
        await sendFormsMessage({
          subdomain,
          action: 'removeForm',
          data: {
            formId
          },
          isRPC: true,
          defaultValue: []
        });
        return await models.RiskAssessmentCategories.findByIdAndDelete(params._id);
      } catch (error) {
        throw new Error(error.message);
      }
    };

    public static editCategory = async (params: IRiskAssessmentCategoriesField) => {
      const { _id, name, code, parentId, formId } = params;

      const category = await models.RiskAssessmentCategories.findOne({ _id }).lean();

      if (!category) {
        throw new Error('Not found risk assessment category');
      }

      const isParamsHasError = await this.checkParams(params);

      if (isParamsHasError) {
        throw new Error(isParamsHasError);
      }

      const order = await this.getOrder(parentId, code, name);

      return models.RiskAssessmentCategories.updateOne({ _id }, { $set: { ...category, ...params, order } });
    };

    public static async getFormDetail(_id) {
      const form = await sendFormsMessage({
        subdomain,
        action: 'findOne',
        data: { _id },
        isRPC: true,
        defaultValue: {}
      });

      return form;
    }

    public static async removeUnsavedRiskAssessmentCategoryForm(formId) {
      try {
        const form = await sendFormsMessage({
          subdomain,
          action: 'removeForm',
          data: { formId },
          isRPC: true,
          defaultValue: {}
        });
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    static async getOrder(_id: string, code: string, name: string) {
      const parent = await models.RiskAssessmentCategories.findOne({ _id });
      return parent ? `${parent.order}/${code}` : `${name}${code}`;
    }

    static async checkParams(params: IRiskAssessmentCategoriesField, checkCode?: boolean) {
      if (!params.formId) {
        return 'You must a build form';
      }

      if (!params.name) {
        return 'You must a provide category name';
      }

      if (!params.code) {
        return 'You must provide code';
      }

      if (checkCode && (await models.RiskAssessmentCategories.findOne({ code: params.code }))) {
        return 'Code must be unique';
      }
    }
  }
  riskAssessmentCategoriesSchema.loadClass(CategoriesClass);
  return riskAssessmentCategoriesSchema;
};
