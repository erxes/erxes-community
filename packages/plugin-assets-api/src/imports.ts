import { generateModels } from './connectionResolver';

export const EXPORT_TYPES = [
  {
    text: 'Assets & Movements',
    contentType: 'asset',
    icon: 'piggy-bank'
  }
];

export const IMPORT_TYPES = [
  {
    text: ' Assets & Movements',
    contentType: 'asset',
    icon: 'piggybank'
  }
];

export default {
  exportTypes: EXPORT_TYPES,
  importTypes: IMPORT_TYPES,

  insertImportItems: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { docs } = data;

    console.log(docs);
  },
  prepareImportDocs: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);
    const { result, properties } = data;

    const bulkDoc: any = [];

    for (const fieldValue of result) {
      const doc: any = {
        customFieldData: []
      };

      let colIndex: number = 0;
      let ratios = [];

      for (const property of properties) {
        const value = (fieldValue[colIndex] || '').toString();
        switch (property.name) {
          case 'customProperty':
            {
              doc.customFieldData.push({
                field: property.id,
                value: fieldValue[colIndex]
              });
            }
            break;
          case 'groupName':
            {
              const group = await models.AssetGroup.findOne({
                name: { $regex: new RegExp(`^${value}$`, 'i') }
              });
              doc.groupId = group ? group._id : '';
            }

            break;
          case 'parentName':
            {
              const parent = await models.Asset.findOne({
                name: { $regex: new RegExp(`^${value}$`, 'i') }
              });

              doc.parentId = parent ? parent._id : '';
            }
            break;
          default: {
            doc[property.name] = value;
            if (property.name === 'createdAt' && value) {
              doc.createdAt = new Date(value);
            }
          }
        }

        colIndex++;
      }
    }

    return bulkDoc;
  }
};
