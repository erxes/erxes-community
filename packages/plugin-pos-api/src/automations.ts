import { generateModels } from './connectionResolver';

export default {
  receiveActions: async ({
    subdomain,
    data: { actionType, action, execution }
  }) => {
    const models = await generateModels(subdomain);

    if (actionType === 'create') {
      return actionCreate({ models, subdomain, action, execution });
    }
  },
  constants: {
    triggers: [
      {
        type: 'pos:posOrder',
        img: 'automation3.svg',
        icon: 'lamp',
        label: 'Pos order',
        description:
          'Start with a blank workflow that enralls and is triggered off Pos orders'
      }
    ],
    actions: [
      {
        type: 'pos:pos.create',
        icon: 'file-plus-alt',
        label: 'Create pos',
        description: 'Create pos',
        isAvailable: true
      }
    ]
  }
};

const actionCreate = async ({ models, subdomain, action, execution }) => {
  /* write action creation code here */
  console.log('creating action.......');
};
