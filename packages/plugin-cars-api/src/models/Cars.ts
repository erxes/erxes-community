import {
  carCategorySchema,
  carSchema,
  ICarCategoryDocument,
  ICarDocument,
  ICar,
  ICarCategory
} from './definitions/cars';
import { sendInternalNotesMessage } from '../messageBroker';

import { Model } from 'mongoose';
import { validSearchText } from '@erxes/api-utils/src';
import { IModels } from '../connectionResolver';
import { IUser } from '@erxes/api-utils/src/types';

export interface ICarModel extends Model<ICarDocument> {
  checkDuplication(
    carFields: { plateNumber?: string; vinNumber?: string },
    idsToExclude?: string[]
  ): unknown;
  createCar(doc: ICar, user: any): Promise<ICarDocument>;
  getCar(_id: string): Promise<ICarDocument>;
  updateCar(_id: string, doc: ICar): Promise<ICarDocument>;
  removeCars(subdomain: string, carIds: string[]): Promise<ICarDocument>;
  mergeCars(
    subdomain: string,
    carIds: string,
    carFields: any,
    user: IUser
  ): Promise<ICarDocument>;
  getCarsByCustomerId(customerId: string): Promise<ICarDocument[]>;
  getCarsByCompanyId(companyId: string): Promise<ICarDocument[]>;
  deleteCars(cusId: string, carIds: string[]): Promise<ICarDocument>;
  fillSearchText(doc: ICar): string;
  removeCustomerFromCars(customerId: string): Promise<ICarDocument>;
  removeCompanyFromCars(companyId: string): Promise<ICarDocument>;
}

export interface ICarCategoryModel extends Model<ICarCategoryDocument> {
  getCarCategory(selector: any): Promise<ICarCategoryDocument>;
  createCarCategory(doc: ICarCategory): Promise<ICarCategoryDocument>;
  updateCarCategory(
    _id: string,
    doc: ICarCategory
  ): Promise<ICarCategoryDocument>;
  removeCarCategory(_id: string): Promise<ICarCategoryDocument>;
  generateOrder(
    parentCategory: any,
    doc: ICarCategory
  ): Promise<ICarCategoryDocument>;
}

export const loadCarClass = (models: IModels) => {
  class Car {
    /**
     * Checking if car has duplicated unique properties
     */
    public static async checkDuplication(
      carFields: {
        plateNumber?: string;
        vinNumber?: string;
      },
      idsToExclude?: string[] | string
    ) {
      const query: { status: {}; [key: string]: any } = {
        status: { $ne: 'Deleted' }
      };
      let previousEntry;

      // Adding exclude operator to the query
      if (idsToExclude) {
        query._id = { $nin: idsToExclude };
      }

      if (carFields.plateNumber) {
        // check duplication from primaryName
        previousEntry = await models.Cars.find({
          ...query,
          plateNumber: carFields.plateNumber
        });

        if (previousEntry.length > 0) {
          throw new Error('Duplicated plate number');
        }
      }

      if (carFields.vinNumber) {
        // check duplication from code
        previousEntry = await models.Cars.find({
          ...query,
          vinNumber: carFields.vinNumber
        });

        if (previousEntry.length > 0) {
          throw new Error('Duplicated VIN number');
        }
      }
    }

    public static fillSearchText(doc) {
      return validSearchText([
        doc.plateNumber || '',
        doc.vinNumber || '',
        doc.description || '',
        doc.categoryId || ''
      ]);
    }

    public static getCarName(car) {
      return car.plateNumber || car.vinNumber || 'Unknown';
    }

    /**
     * Retreives car
     */
    public static async getCar(_id: string) {
      const car = await models.Cars.findOne({ _id });

      if (!car) {
        throw new Error('Car not found');
      }

      return car;
    }

    public static async getAllCar(carIds: string) {
      for (const carId of carIds) {
        await models.Cars.find({ _id: carId });
      }
      const car = await models.Cars.find({ _id: carIds });

      if (!car) {
        throw new Error('Car not found');
      }

      return car;
    }

    public static async getCarsByCustomerId(customerId: string) {
      const cars = await models.Cars.find({
        customerIds: customerId
      }).lean();

      return cars;
    }

    public static async getCarsByCompanyId(companyId: string) {
      const cars = await models.Cars.find({
        companyIds: companyId
      }).lean();

      return cars;
    }
    /**
     * Create a car
     */
    public static async createCar(doc, user) {
      // Checking duplicated fields of car
      await models.Cars.checkDuplication(doc);

      if (!doc.ownerId && user) {
        doc.ownerId = user.name;
      }

      const car = await models.Cars.create({
        ...doc,
        createdAt: new Date(),
        modifiedAt: new Date(),
        searchText: models.Cars.fillSearchText(doc)
      });

      return car;
    }

    /**
     * Update car
     */
    public static async updateCar(_id, doc) {
      // Checking duplicated fields of car
      await models.Cars.checkDuplication(doc, [_id]);

      const searchText = models.Cars.fillSearchText(
        Object.assign(await models.Cars.getCar(_id), doc)
      );
      await models.Cars.updateOne(
        { _id },
        { $set: { ...doc, searchText, modifiedAt: new Date() } }
      );

      return models.Cars.findOne({ _id });
    }

    /**
     * Remove car
     */
    public static async removeCars(subdomain, carIds) {
      for (const carId of carIds) {
        await sendInternalNotesMessage({
          subdomain,
          action: 'removeInternalNotes',
          data: {
            contentType: 'car',
            contentTypeId: carId
          },
          defaultValue: {}
        });
      }

      return models.Cars.deleteMany({ _id: { $in: carIds } });
    }

    public static async removeCustomerFromCars(customerId: string) {
      return models.Cars.updateMany(
        { customerIds: customerId },
        { $pull: { customerIds: customerId } }
      );
    }

    public static async removeCompanyFromCars(companyId: string) {
      return models.Cars.updateMany(
        { companyIds: companyId },
        { $pull: { companyIds: companyId } }
      );
    }

    /**
     * Merge cars
     */
    public static async mergeCars(subdomain, carIds, carFields, user) {
      // Checking duplicated fields of car
      await this.checkDuplication(carFields, carIds);

      // Merging car tags
      for (const carId of carIds) {
        models.Cars.getCar(carId);
        await models.Cars.findByIdAndUpdate(carId, {
          $set: { status: 'Deleted' }
        });
      }

      // Creating car with properties
      const car = await models.Cars.createCar(
        {
          ...carFields,
          mergedIds: carIds
        },
        user
      );

      // Removing modules associated with current cars
      // await models.InternalNotes.changeCar(car._id, carIds);

      return car;
    }
  }

  carSchema.loadClass(Car);

  return carSchema;
};

export const loadCarCategoryClass = models => {
  class CarCategory {
    /**
     *
     * Get Car Cagegory
     */

    public static async getCarCatogery(selector: any) {
      const carCategory = await models.CarCategories.findOne(selector);

      if (!carCategory) {
        throw new Error('Car & service category not found');
      }

      return carCategory;
    }

    /**
     * Create a car categorys
     */
    public static async createCarCategory(doc) {
      const parentCategory = doc.parentId
        ? await models.CarCategories.findOne({ _id: doc.parentId }).lean()
        : undefined;

      // Generating order
      doc.order = await this.generateOrder(parentCategory, doc);

      return models.CarCategories.create(doc);
    }

    /**
     * Update Car category
     */
    public static async updateCarCategory(_id, doc) {
      const parentCategory = doc.parentId
        ? await models.CarCategories.findOne({ _id: doc.parentId }).lean()
        : undefined;

      if (parentCategory && parentCategory.parentId === _id) {
        throw new Error('Cannot change category');
      }

      // Generatingg  order
      doc.order = await this.generateOrder(parentCategory, doc);

      const carCategory = await models.CarCategories.getCarCatogery({
        _id
      });

      const childCategories = await models.CarCategories.find({
        $and: [
          { order: { $regex: new RegExp(carCategory.order, 'i') } },
          { _id: { $ne: _id } }
        ]
      });

      await models.CarCategories.updateOne({ _id }, { $set: doc });

      // updating child categories order
      childCategories.forEach(async category => {
        let order = category.order;

        order = order.replace(carCategory.order, doc.order);

        await models.CarCategories.updateOne(
          { _id: category._id },
          { $set: { order } }
        );
      });

      return models.CarCategories.findOne({ _id });
    }

    /**
     * Remove Car category
     */
    public static async removeCarCategory(_id) {
      await models.CarCategories.getCarCatogery({ _id });

      let count = await models.Cars.countDocuments({ categoryId: _id });

      count += await models.CarCategories.countDocuments({ parentId: _id });

      if (count > 0) {
        throw new Error("Can't remove a car category");
      }

      return models.CarCategories.deleteOne({ _id });
    }

    /**
     * Generating order
     */
    public static async generateOrder(parentCategory, doc) {
      const order = parentCategory
        ? `${parentCategory.order}/${doc.code}`
        : `${doc.code}`;

      return order;
    }
  }

  carCategorySchema.loadClass(CarCategory);

  return carCategorySchema;
};
