const add = `
  mutation kbcgwsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    kbcgwsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation kbcgwsRemove($_id: String!){
    kbcgwsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation kbcgwsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    kbcgwsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    kbcgwTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    kbcgwTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    kbcgwTypesEdit(_id: $_id, name: $name){
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
