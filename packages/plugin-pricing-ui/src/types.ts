export type DiscountData = {
  name: string;
  status: 'active' | 'archive' | 'draft' | 'completed';
  value: number | string;
  type: 'fixed' | 'subtraction' | 'percentage' | 'bonus';
  bonusProduct?: string;

  applyType: 'category' | 'product';

  products: string[];
  productsExcluded: string[];
  categories: string[];
  categoriesExcluded: string[];

  isStartDateEnabled: boolean;
  isEndDateEnabled: boolean;

  startDate: Date | null;
  endDate: Date | null;

  departmentIds: string[];
  branchIds: string[];
  boardId: string;
  pipelineId: string;
  stageId: string;

  isQuantityEnabled: boolean;
  quantityRules: [
    {
      type?: string;
      typeValue?: string;
      discountValue?: string;
    }
  ];

  isPriceEnabled: boolean;
  priceRules: [
    {
      type?: string;
      typeValue?: string;
      discountValue?: string;
    }
  ];

  isExpiryEnabled: boolean;
  expiryRules: [
    {
      type?: string;
      typeValue?: string;
      discountValue?: string;
    }
  ];

  isRepeatEnabled: boolean;
  repeatRules: [
    {
      type?: string;
      value?: string;
    }
  ];
};
