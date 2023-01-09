import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { IModels } from '../connectionResolver';
import {
  checkRepeatRule,
  calculatePriceRule,
  calculateQuantityRule,
  calculateDiscountValue,
  calculateExpiryRule
} from './rule';
import { getAllowedProducts } from './product';

export const checkPricing = async (
  models: IModels,
  subdomain: string,
  totalAmount: number,
  departmentId: string,
  branchId: string,
  orders: any
) => {
  const now = dayjs(new Date());
  const nowISO = now.toISOString();
  const productIds = orders.map(p => p.productId);
  const result: any = {};

  let allowedProductIds: any = [];

  // Finding valid discounts
  const conditions: any = {
    status: 'active',
    $and: [
      {
        $or: [
          {
            branchIds: { $in: [branchId] },
            departmentIds: { $size: 0 }
          },
          {
            branchIds: { $size: 0 },
            departmentIds: { $in: [departmentId] }
          },
          {
            branchIds: { $size: 0 },
            departmentIds: { $size: 0 }
          }
        ]
      },
      {
        $or: [
          {
            isStartDateEnabled: false,
            isEndDateEnabled: false
          },
          {
            isStartDateEnabled: true,
            isEndDateEnabled: false,
            startDate: {
              $lt: nowISO
            }
          },
          {
            isStartDateEnabled: false,
            isEndDateEnabled: true,
            endDate: {
              $gt: nowISO
            }
          },
          {
            isStartDateEnabled: true,
            isEndDateEnabled: true,
            startDate: {
              $lt: nowISO
            },
            endDate: {
              $gt: nowISO
            }
          }
        ]
      }
    ]
  };

  const sortArgs: any = {
    isPriority: -1,
    value: 1
  };

  const plans: any = await models.PricingPlans.find(conditions).sort(sortArgs);
  let priorityApplied: any = false;

  if (plans.length === 0) {
    return;
  }

  // Calculating discount
  for (const plan of plans) {
    // Take all products that can be discounted
    allowedProductIds = await getAllowedProducts(subdomain, plan, productIds);

    // Prepare object to save calculated data
    for (const productId of allowedProductIds) {
      if (!Object.keys(result).includes(productId)) {
        result[productId] = {
          type: '',
          value: 0,
          bonusProduct: ''
        };
      }
    }

    result.default = {
      type: plan.type || '',
      value: plan.value || 0,
      bonusProduct: plan.bonusProduct || ''
    };

    // Check repeat rule first
    const repeatPassed: boolean = checkRepeatRule(plan);
    if (!repeatPassed) {
      continue;
    }

    let planApplied: boolean = false;
    let appliedBundleCounts: number = Number.POSITIVE_INFINITY;
    let appliedBundleItems: any[] = [];

    // Check rest of the rules
    for (const item of orders) {
      if (!allowedProductIds.includes(item.productId)) {
        continue;
      }

      if (appliedBundleCounts > item.quantity)
        appliedBundleCounts = item.quantity;

      let type: string = '';
      let value: number = 0;
      let bonusProduct: string = '';
      const defaultValue: number = calculateDiscountValue(
        plan.type,
        plan.value,
        item.price
      );

      // Check price rules
      const priceRule: any = calculatePriceRule(plan, item, totalAmount);

      // Check quantity rule
      const quantityRule: any = calculateQuantityRule(plan, item);

      // Check expiry rule
      const expiryRule: any = calculateExpiryRule(plan, item);

      // Checks if all rules are passed!
      if (priceRule.passed && quantityRule.passed && expiryRule.passed) {
        if (!plan.isPriority && priorityApplied === true) {
          continue;
        }

        // Bonus product will always be prioritized
        if (priceRule.type === 'bonus') {
          bonusProduct = priceRule.bonusProduct;
        }
        if (quantityRule.type === 'bonus') {
          bonusProduct = quantityRule.bonusProduct;
        }
        if (expiryRule.type === 'bonus') {
          bonusProduct = expiryRule.bonusProduct;
        }
        if (bonusProduct.length !== 0) {
          type = 'bonus';
          value = 0;
          bonusProduct = bonusProduct;
          continue;
        }

        // Prioritize highest value between rules
        if (
          priceRule.value > quantityRule.value &&
          priceRule.value > expiryRule.value
        ) {
          type = priceRule.type;
          value = priceRule.value;
        } else if (
          quantityRule.value > priceRule.value &&
          quantityRule.value > expiryRule.value
        ) {
          type = quantityRule.type;
          value = quantityRule.value;
        } else {
          type = expiryRule.type;
          value = expiryRule.value;
        }

        if (type.length === 0) {
          type = plan.type;
          value = defaultValue;
          bonusProduct = plan.bonusProduct;
        }

        // Priority calculation
        if (
          (plan.isPriority && !priorityApplied) ||
          (plan.isPriority &&
            priorityApplied &&
            result[item.productId].value < value) ||
          (!plan.isPriority &&
            !priorityApplied &&
            result[item.productId].value < value)
        )
          if (plan.isPriority) {
            priorityApplied = true;
          }
        planApplied = true;
        appliedBundleItems.push(item);
        result[item.productId].type = type;
        result[item.productId].value = value;
        result[item.productId].bonusProduct = bonusProduct;
      }
    }

    // Calculate bundle
    if (planApplied && plan.applyType === 'bundle') {
      appliedBundleItems.map((item: any) => {
        if (result[item.productId].type !== 'bonus') {
          result[item.productId].value = Math.floor(
            (result[item.productId].value / item.quantity) * appliedBundleCounts
          );
        }
      });
    }
  }

  return result;
};
