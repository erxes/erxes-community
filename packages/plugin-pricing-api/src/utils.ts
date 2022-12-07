import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import { IModels } from './connectionResolver';
import { sendProductsMessage } from './messageBroker';

const calculateDiscountValue = (
  rule: any,
  price: number,
  discount?: { type: string; value: number }
) => {
  switch (rule.discountType) {
    case 'fixed':
      return rule.discountValue;
    case 'subtraction':
      return price - rule.discountValue;
    case 'percentage':
      return Math.floor(price * (1 - rule.discountValue / 100));
    case 'default':
      if (discount)
        return calculateDiscountValue(
          { discountType: discount.type, discountValue: discount.value },
          price
        );

      return 0;
    default:
      return 0;
  }
};

const checkRuleValidity = (rule: any, checkValue: number) => {
  switch (rule.type) {
    case 'exact':
      if (checkValue === rule.value) return true;
    case 'minimum':
    case 'every':
      if (checkValue >= rule.value) return true;
    default:
      return false;
  }
};

const getParentsOrders = (order: string) => {
  const orders: string[] = [];
  const splitOrders = order.split('/');
  let currentOrder = '';

  for (const oStr of splitOrders) {
    if (oStr) {
      currentOrder = `${currentOrder}${oStr}/`;
      orders.push(currentOrder);
    }
  }

  return orders;
};

export const checkPricing = async (
  models: IModels,
  subdomain: string,
  totalAmount: number,
  departmentId: string,
  branchId: string,
  orders: any
) => {
  const now = new Date();
  const dayOfWeek = dayjs(now).day();
  const dayOfMonth = dayjs(now).date();
  const nowISO = now.toISOString();
  const productIds = orders.map(p => p.productId);
  const result: any = {};

  let allowedProductIds: any = [];

  /**
   * Fetching every categories given products can have
   */
  let orderProducts: any = [];
  let orderProductCategories: any = [];
  let allOrderProductCategories: any = [];
  let isFetchedCategories: boolean = false;

  // Finding valid discounts
  const conditions: any = {
    status: 'active',
    $and: [
      {
        $or: [
          {
            branchIds: { $in: branchId },
            departmentIds: { $size: 0 }
          },
          {
            branchIds: { $size: 0 },
            departmentIds: { $in: departmentId }
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
    value: -1
  };

  const discounts: any = await models.Discounts.find(conditions).sort(sortArgs);

  if (discounts.length === 0) return;

  /**
   * Calculating discount
   */
  for (const discount of discounts) {
    /**
     * Take all products that can be discounted
     */
    if (discount.applyType === 'product')
      allowedProductIds = _.intersection(productIds, discount.products);

    if (discount.applyType === 'category') {
      if (!isFetchedCategories) {
        orderProducts = await sendProductsMessage({
          subdomain,
          action: 'find',
          data: {
            query: { _id: { $in: productIds } },
            sort: { _id: 1, categoryId: 1 }
          },
          isRPC: true,
          defaultValue: []
        });

        orderProductCategories = await sendProductsMessage({
          subdomain,
          action: 'categories.find',
          data: {
            query: { _id: { $in: orderProducts.map(p => p.categoryId) } },
            sort: { _id: 1 }
          },
          isRPC: true,
          defaultValue: []
        });

        let allOrders: string[] = [];

        for (const category of orderProductCategories)
          allOrders = allOrders.concat(getParentsOrders(category.order));

        allOrderProductCategories = await sendProductsMessage({
          subdomain,
          action: 'categories.find',
          data: {
            query: { order: { $in: allOrders } },
            sort: { order: 1 }
          },
          isRPC: true,
          defaultValue: []
        });

        isFetchedCategories = true;
      }

      for (const item of orderProducts) {
        const order = orderProductCategories.find(
          category => category._id === item.categoryId
        ).order;
        const parentOrders = getParentsOrders(order);

        const categories = allOrderProductCategories.filter(category =>
          parentOrders.includes(category.order)
        );
        const categoryIds = categories.map(category => category._id);

        const isCategoryIncluded =
          _.intersection(categoryIds, discount.categories).length !== 0;
        const isCategoryExcluded =
          _.intersection(categoryIds, discount.categoriesExcluded).length === 0;
        const isProductExcluded =
          discount.productsExcluded.findIndex(id => id === item._id) === -1;

        if (isCategoryIncluded && isCategoryExcluded && isProductExcluded)
          allowedProductIds.push(item._id);
      }
    }

    /**
     * Prepare object to save calculated data
     */
    for (const productId of allowedProductIds) {
      if (!Object.keys(result).includes(productId)) {
        result[productId] = {
          type: '',
          value: 0,
          bonusProduct: ''
        };
      }
    }

    result.defaultBonusProduct = discount.bonusProduct;

    /**
     * Check repeat rules
     */
    let repeatPassed = false;

    if (!discount.isRepeatEnabled) repeatPassed = true;
    if (
      discount.isRepeatEnabled &&
      discount.repeatRules &&
      discount.repeatRules.length !== 0
    )
      for (const rule of discount.repeatRules) {
        if (repeatPassed) break;

        switch (rule.type) {
          case 'everyDay':
            repeatPassed = true;
            break;
          case 'everyWeek':
            if (
              rule.weekValue &&
              rule.weekValue.find(i => i.value == dayOfWeek.toString())
            )
              repeatPassed = true;
            break;
          case 'everyMonth':
            if (
              rule.monthValue &&
              rule.monthValue.find(i => i.value === dayOfMonth.toString())
            )
              repeatPassed = true;
            break;
          case 'everyYear':
            if (
              rule.yearStartValue &&
              rule.yearStartValue < nowISO &&
              rule.yearEndValue &&
              rule.yearEndValue > nowISO
            )
              repeatPassed = true;
            break;
          default:
            break;
        }
      }

    if (!repeatPassed) continue;

    /**
     * Check rest of the rules
     */
    for (const item of orders) {
      if (!allowedProductIds.includes(item.productId)) break;

      let pricePassed = false;
      let quantityPassed = false;

      let discountType = '';
      let discountValue = Number.POSITIVE_INFINITY;
      let discountBonusProduct = '';

      /**
       * Check price rules
       */
      if (!discount.isPriceEnabled) pricePassed = true;
      if (
        discount.isPriceEnabled &&
        discount.priceRules &&
        discount.priceRules.length !== 0
      )
        for (const rule of discount.priceRules) {
          pricePassed = checkRuleValidity(rule, totalAmount);
          if (!pricePassed) continue;

          if (rule.discountType === 'bonus') {
            discountType = rule.discountType;
            discountBonusProduct = rule.discountBonusProduct;
            continue;
          }

          let calculatedValue: number = calculateDiscountValue(
            rule,
            item.price,
            discount
          );

          // Checks if value is lower than past calculated price, override it
          discountType = rule.discountType;
          discountValue = calculatedValue;
        }

      /**
       * Check quantity rules
       */
      if (!discount.isQuantityEnabled) quantityPassed = true;
      if (
        discount.isQuantityEnabled &&
        discount.quantityRules &&
        discount.quantityRules.length !== 0
      )
        for (const rule of discount.quantityRules) {
          quantityPassed = checkRuleValidity(rule, item.quantity);
          if (!quantityPassed) continue;

          if (rule.discountType === 'bonus') {
            discountType = rule.discountType;
            discountBonusProduct = rule.discountBonusProduct;
            continue;
          }

          let calculatedValue: number = calculateDiscountValue(
            rule,
            item.price,
            discount
          );

          // Calculate remainder product's price
          if (rule.type === 'every') {
            let discountQuantity =
              Math.floor(item.quantity / rule.value) * rule.value;
            if (discountQuantity >= rule.value) {
              let undiscountedQuantity = item.quantity - discountQuantity;
              let totalUndiscountedPrice = item.price * undiscountedQuantity;
              let totalDiscountedPrice = calculatedValue * discountQuantity;
              calculatedValue = Math.floor(
                (totalDiscountedPrice + totalUndiscountedPrice) / item.quantity
              );
            }
          }

          // Checks if value is lower than past calculated price, override it
          if (calculatedValue < discountValue) {
            discountType =
              rule.discountType === 'default'
                ? discount.type
                : rule.discountType;
            discountValue = calculatedValue;
          }
        }

      // TODO: Check expiry rules

      // Checks if value is lower than past calculated price, override it
      if (
        pricePassed &&
        quantityPassed
        // expiryPassed &&
      ) {
        result[item.productId].type = discountType;
        result[item.productId].value = discountValue;
        result[item.productId].bonusProduct = discountBonusProduct;
      }

      console.log(result);
    }
  }

  return result;
};
