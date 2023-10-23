import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const typeSchema = new Schema({
  name: String
});

export const msdynamicSchema = new Schema({
  name: String,
  createdAt: Date,
  expiryDate: Date,
  checked: Boolean,
  typeId: String
});

export const loadTypeClass = () => {
  class Type {
    public static async getType(_id: string) {
      const type = await Types.findOne({ _id });

      if (!type) {
        throw new Error('Type not found');
      }

      return type;
    }
    // create type
    public static async createType(doc) {
      return Types.create({ ...doc });
    }
    // remove type
    public static async removeType(_id: string) {
      return Types.deleteOne({ _id });
    }

    public static async updateType(_id: string, doc) {
      return Types.updateOne({ _id }, { $set: { ...doc } });
    }
  }

  typeSchema.loadClass(Type);
  return typeSchema;
};

export const loadMsdynamicClass = () => {
  class Msdynamic {
    public static async getMsdynamic(_id: string) {
      const msdynamic = await Msdynamics.findOne({ _id });

      if (!msdynamic) {
        throw new Error('Msdynamic not found');
      }

      return msdynamic;
    }

    // create
    public static async createMsdynamic(doc) {
      return Msdynamics.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateMsdynamic(_id: string, doc) {
      await Msdynamics.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }
    // remove
    public static async removeMsdynamic(_id: string) {
      return Msdynamics.deleteOne({ _id });
    }
  }

  msdynamicSchema.loadClass(Msdynamic);

  return msdynamicSchema;
};

loadMsdynamicClass();
loadTypeClass();

// tslint:disable-next-line
export const Types = model<any, any>('msdynamic_types', typeSchema);

// tslint:disable-next-line
export const Msdynamics = model<any, any>('msdynamics', msdynamicSchema);
