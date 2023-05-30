import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const typeSchema = new Schema({
  name: String
});

export const osmSchema = new Schema({
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

export const loadOsmClass = () => {
  class Osm {
    public static async getOsm(_id: string) {
      const osm = await Osms.findOne({ _id });

      if (!osm) {
        throw new Error('Osm not found');
      }

      return osm;
    }

    // create
    public static async createOsm(doc) {
      return Osms.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateOsm(_id: string, doc) {
      await Osms.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }
    // remove
    public static async removeOsm(_id: string) {
      return Osms.deleteOne({ _id });
    }
  }

  osmSchema.loadClass(Osm);

  return osmSchema;
};

loadOsmClass();
loadTypeClass();

// tslint:disable-next-line
export const Types = model<any, any>('osm_types', typeSchema);

// tslint:disable-next-line
export const Osms = model<any, any>('osms', osmSchema);
