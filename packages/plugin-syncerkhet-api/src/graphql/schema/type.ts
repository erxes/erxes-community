export const types = `
  type CheckResponse {
    _id: String
    isSynced: Boolean
    syncedDate: Date
    syncedBillNumber: String
  }
  type CategoryResponse {
    code: String
    name: String
    parent: Int
    cost_account: String
    sale_account: String
    is_citytax: Boolean
    is_raw: Boolean
    citytax_row: String
    is_service: Boolean
    is_sellable: Boolean
    order: String
  }
  type ProductResponse {
    code: String
    name: String
    category: String
    barcodes: String
    cost_account: String
    sale_account: String
    bulk_price: Float
    unit_price: Float
    vat_type: String
    vat_type_code: Int
    group: String
    brand: String
    weight: Float
    extra: String
  }
  input ErkhetCategory {
    citytax_row: Int 
    code: String
    cost_account: String 
    is_citytax: Boolean
    is_raw: Boolean
    is_sellable: Boolean 
    is_service: Boolean 
    name: String 
    order: String 
    parent: Int
    sale_account: String 
  }
  input ErkhetProduct {
    barcode: String
    barcodes: String 
    brand: String
    bulk_price: String 
    category: Int
    code: String 
    cost_account: Int 
    extra: String 
    group: String
    is_deleted: Boolean 
    measure_unit: Int
    name: String
    nickname: String 
    picture: String
    ratio_measure_unit: String 
    remainder_dic: String
    sale_account: Int
    sub_measure_unit: String 
    unit_price: String 
    united_code: Int 
    vat_type: String
    vat_type_code: Int 
    weight: String 
  }
`;
