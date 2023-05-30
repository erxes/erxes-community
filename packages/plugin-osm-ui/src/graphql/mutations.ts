const add = `
  mutation osmsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    osmsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation osmsRemove($_id: String!){
    osmsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation osmsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    osmsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    osmTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    osmTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    osmTypesEdit(_id: $_id, name: $name){
      _id
    }
  }
`;

export default {
  add,
  remove,
  edit,
  addType,
  removeType,
  editType
};
