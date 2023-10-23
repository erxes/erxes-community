const add = `
  mutation msdynamicsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    msdynamicsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation msdynamicsRemove($_id: String!){
    msdynamicsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation msdynamicsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    msdynamicsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    msdynamicTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    msdynamicTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    msdynamicTypesEdit(_id: $_id, name: $name){
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
