import { Model } from 'mongoose';
import {
  IProductCategoryDocument,
  IProductDocument,
  productCategorySchema,
  productSchema
} from './definitions/products';

export interface IProductModel extends Model<IProductDocument> {
  getProduct(selector: any): Promise<IProductDocument>;
}

export const loadProductClass = models => {
  class Product {
    public static async getProduct(selector: any) {
      const product = await models.Products.findOne(selector).lean();

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    }
  } // end Product class

  productSchema.loadClass(Product);

  return productSchema;
};

export interface IProductCategoryModel extends Model<IProductCategoryDocument> {
  getProductCategory(selector: any): Promise<IProductCategoryDocument>;
}

export const loadProductCategoryClass = models => {
  class ProductCategory {
    public static async getProductCategory(selector: any) {
      const productCategory = await models.ProductCategories.findOne(
        selector
      ).lean();

      if (!productCategory) {
        throw new Error('Product & service category not found');
      }

      return productCategory;
    }
  }

  productCategorySchema.loadClass(ProductCategory);

  return productCategorySchema;
};
