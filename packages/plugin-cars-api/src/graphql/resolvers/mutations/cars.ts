import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { IContext } from '../../../connectionResolver';
import messageBroker, { sendCoreMessage } from '../../../messageBroker';
import {
  putCreateLog,
  putDeleteLog,
  putUpdateLog
} from '@erxes/api-utils/src/logUtils';

const carMutations = {
  carsAdd: async (_root, doc, { user, docModifier, models, subdomain }) => {
    const car = models.Cars.createCar(docModifier(doc), user);

    await putCreateLog(
      subdomain,
      messageBroker(),
      {
        type: 'car',
        newData: doc,
        object: car,
        extraParams: { models }
      },
      user
    );

    return car;
  },

  carsEdit: async (_root, { _id, ...doc }, { models, user, subdomain }) => {
    const car = await models.Cars.getCar(_id);
    const updated = await models.Cars.updateCar(_id, doc);

    await putUpdateLog(
      subdomain,
      messageBroker(),
      {
        type: 'car',
        object: car,
        newData: { ...doc },
        updatedDocument: updated,
        extraParams: { models }
      },
      user
    );

    return updated;
  },

  carsEditOnCustomer: async (_root, { _id, ...doc }, { models }: IContext) => {
    const cars = await models.Cars.getCarsByCustomerId(doc.cusId);
    const oldCarIds = cars.map(car => car._id);

    if (doc.carIds.length === 0) {
      return models.Cars.removeCustomerFromCars(doc.cusId);
    }

    for (const carId of oldCarIds) {
      if (!doc.carIds.includes(carId)) {
        await models.Cars.updateOne(
          { _id: carId },
          {
            $pull: { customerIds: doc.cusId }
          }
        );
      }
    }

    for (const carId of doc.carIds) {
      if (!oldCarIds.includes(carId)) {
        await models.Cars.updateOne(
          { _id: carId },
          {
            $push: { customerIds: doc.cusId }
          }
        );
      }
    }
  },

  carsRemove: async (
    _root,
    { carIds }: { carIds: string[] },
    { models, user, subdomain }: IContext
  ) => {
    const cars = await models.Cars.find({ _id: { $in: carIds } }).lean();

    await models.Cars.removeCars(subdomain, carIds);

    // for (const car of cars) {
    //   messageBroker().sendMessage("putActivityLog", {
    //     action: "removeActivityLog",
    //     data: { contentTypeId: car._id },
    //   });

    //   await putDeleteLog(
    //     messageBroker(),
    //     gatherDescriptions,
    //     { type: "car", object: car, extraParams: { models } },
    //     user
    //   );
    // }

    return carIds;
  },

  carsMerge: async (
    _root,
    { carIds, carFields },
    { models, subdomain, user }: IContext
  ) => {
    return models.Cars.mergeCars(subdomain, carIds, carFields, user);
  },

  carCategoriesAdd: async (
    _root,
    doc,
    { docModifier, models, subdomain, user }
  ) => {
    const carCategory = await models.CarCategories.createCarCategory(
      docModifier(doc)
    );

    await putCreateLog(
      subdomain,
      messageBroker(),
      {
        type: 'car-category',
        newData: { ...doc, order: carCategory.order },
        object: carCategory,
        extraParams: { models }
      },
      user
    );

    return carCategory;
  },

  carCategoriesEdit: async (
    _root,
    { _id, ...doc },
    { models, subdomain, user }
  ) => {
    const carCategory = await models.CarCategories.getCarCatogery({
      _id
    });
    const updated = await models.CarCategories.updateCarCategory(_id, doc);

    await putUpdateLog(
      subdomain,
      messageBroker(),
      {
        type: 'car-category',
        object: carCategory,
        newData: doc,
        updatedDocument: updated,
        extraParams: { models }
      },
      user
    );

    return updated;
  },

  carCategoriesRemove: async (
    _root,
    { _id }: { _id: string },
    { models, subdomain, user }: IContext
  ) => {
    const carCategory = await models.CarCategories.getCarCatogery({
      _id
    });
    const removed = await models.CarCategories.removeCarCategory(_id);

    await putDeleteLog(
      subdomain,
      messageBroker(),
      { type: 'car-category', object: carCategory, extraParams: { models } },
      user
    );

    return removed;
  },

  cpCarsAdd: async (
    _root,
    doc,
    { docModifier, models, subdomain, user }: IContext
  ) => {
    const car = await models.Cars.createCar(docModifier(doc), user);

    if (doc.customerId) {
      await sendCoreMessage({
        subdomain,
        action: 'conformities.addConformities',
        data: {
          mainType: 'customer',
          mainTypeId: doc.customerId,
          relType: 'car',
          relTypeId: car._id
        }
      });
    }

    if (doc.companyId) {
      await sendCoreMessage({
        subdomain,
        action: 'conformities.addConformities',
        data: {
          mainType: 'company',
          mainTypeId: doc.companyId,
          relType: 'car',
          relTypeId: car._id
        }
      });
    }

    return car;
  },

  cpCarsEdit: async (_root, { _id, ...doc }, { models }) => {
    await models.Cars.getCar(_id);
    const updated = await models.Cars.updateCar(_id, doc);

    return updated;
  },

  cpCarsRemove: async (_root, { carIds }: { carIds: string[] }, { models }) => {
    await models.Cars.removeCars(carIds);
    return carIds;
  }
};

requireLogin(carMutations, 'manageCars');

checkPermission(carMutations, 'carsAdd', 'manageCars');
checkPermission(carMutations, 'carsEdit', 'manageCars');
checkPermission(carMutations, 'carsRemove', 'manageCars');
checkPermission(carMutations, 'carsMerge', 'manageCars');
checkPermission(carMutations, 'carCategoriesAdd', 'manageCars');
checkPermission(carMutations, 'carCategoriesEdit', 'manageCars');
checkPermission(carMutations, 'carCategoriesRemove', 'manageCars');

export default carMutations;
