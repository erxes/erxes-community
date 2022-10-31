import { Document } from 'mongoose';
export interface IRiskAssessmentsDocument extends Document {
  _id: string;
  createdAt: Date;
  name: String;
  description: String;
  categoryId: String;
  status: String;
}

export interface IOperationsDocument extends Document {
  _id: string;
  createdAt: Date;
  name: String;
  description: String;
  categoryId: String;
  order: String;
  code: String;
}
export interface IOperationCategoriesDocument extends Document {
  _id: string;
  name: String;
  code: String;
  order: String;
  parentId: String;
}

export interface IRiskAssessmentCategoriesDocument extends Document {
  _id: String;
  name: String;
  formId: String;
  parentId: String;
  order: String;
  code: String;
}

export interface PaginateField {
  perPage?: number;
  searchValue?: string;
  sortDirection?: number;
  sortFromDate?: string;
  sortToDate?: string;
}
type IRiskAssessmentCalculateLogicsField = {
  key: string;
  name: string;
  value: number;
  value2: number;
  logic: string;
};
export interface IRiskAssessmentField {
  name?: string;
  description?: string;
  createdAt?: string;
  categoryId?: string;
  status?: string;
  calculateMethod?: string;
  calculateLogics?: IRiskAssessmentCalculateLogicsField[];
}

export interface IRiskAssessmentCategoriesField extends PaginateField {
  _id?: string;
  name: string;
  formId: string;
  parentId: string;
  code: string;
}

export interface IRiskConformitiesField {
  _id: string;
  cardId: string;
  cardType: string;
  riskAssessmentId: string;
}

export interface IRiskConformitiesParams {
  cardId: string;
  cardType: string;
  riskAssessmentId?: string;
}

export interface IRiskFormSubmissionsParams {
  cardId: string;
  cardType: string;
  userId: string;
  formId: string;
  formSubmissions: {
    [key: string]: string;
  };
}

export type IRiskFormSubmissionsField = {
  _id: string;
  cardId: string;
  userId: string;
  formId: string;
  fieldId: string;
  value: number;
};

export interface IRiskConformitiesDocument extends Document {
  _id: string;
  cardId: string;
  riskAssessmentId: string;
}

export interface IRiskFormSubmissionsDocument extends Document {
  _id: String;
  cardId: String;
  userId: String;
  formId: String;
  fieldId: String;
  value: Number;
}
