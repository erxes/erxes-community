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
`;
