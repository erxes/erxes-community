import { isEnabled } from '@erxes/api-utils/src/serviceDiscovery';
import { IModels } from './connectionResolver';
import { sendCommonMessage } from './messageBroker';
import { IPageDocument } from './models/definitions/pages';
import { ISiteDocument } from './models/definitions/sites';

const generateUrl = (subdomain: string, sitename: string, path: string) => {
  return (
    (subdomain === 'localhost' ? `/pl:webbuilder/` : `gateway/pl:webbuilder/`) +
    `${sitename}/${path}`
  );
};

const pathReplacer = (subdomain: string, html: any, site: ISiteDocument) => {
  const siteHolder = `{{sitename}}`;
  const path = `{{pl:webbuilder}}/`;

  if (html.includes(siteHolder)) {
    html = html.replace(new RegExp(siteHolder, 'g'), site.name);
  }

  if (html.includes(path)) {
    if (site.domain && site.domain.includes('http')) {
      html = html.replace(new RegExp(path, 'g'), '');
    }

    // path replacer
    const replacer =
      subdomain === 'localhost' ? `pl:webbuilder/` : `gateway/pl:webbuilder/`;

    html = html.replace(new RegExp(path, 'g'), replacer);
  }

  return html;
};

const entryReplacer = async (
  models: IModels,
  subdomain: string,
  site: ISiteDocument,
  page: IPageDocument,
  limit: any,
  skip: any
) => {
  let subHtml = '';
  const html = pathReplacer(subdomain, page.html, site);

  if (page.name.includes('_entry')) {
    const contentTypeCode = page.name.replace('_entry', '');

    const contentType = await models.ContentTypes.findOne({
      siteId: site._id,
      code: contentTypeCode
    });

    const entries = await models.Entries.find({
      contentTypeId: contentType?._id
    })
      .limit(limit)
      .skip(skip);

    for (const entry of entries) {
      let entryHtml = html.replace(/{{entry._id}}/g, entry._id);

      for (const evalue of entry.values) {
        const { fieldCode, value } = evalue;

        const target = `{{entry.${fieldCode}}}`;

        entryHtml = entryHtml.replace(new RegExp(target, 'g'), value);
      }

      subHtml += entryHtml + `<style>${page.css}</style>`;
    }
  } else {
    subHtml = `${html} <style>${page.css}</style>`;
  }

  return subHtml;
};

const replaceProductInfo = (html, product) => {
  if (!product) {
    return html;
  }

  let replacedHtml = html.replace('{{ product._id }}', product._id);

  replacedHtml = replacedHtml.replace('{{ product.name }}', product.name);
  replacedHtml = replacedHtml.replace(
    '{{ product.image }}',
    product.attachment ? product.attachment.url : ''
  );

  return replacedHtml;
};

const ecommerceReplacer = async ({
  models,
  subdomain,
  site,
  page,
  html,
  queryParams = {}
}: {
  models: IModels;
  subdomain: string;
  site: ISiteDocument;
  page: IPageDocument;
  html: string;
  queryParams?: any;
}) => {
  const isProductsEnabled = await isEnabled('products');

  if (!isProductsEnabled) {
    return html;
  }

  if (html.includes('{{ productCategories }}')) {
    const productCategories = await sendCommonMessage({
      subdomain,
      serviceName: 'products',
      action: 'categories.find',
      isRPC: true,
      data: {}
    });

    let categoriesHtml = '';

    for (const category of productCategories) {
      categoriesHtml += `
        <ul>
          <li>
            <a href="${generateUrl(
              subdomain,
              site.name,
              `product-category/${category._id}`
            )}">${category.name}</a>
          </li>
        </ul>
      `;
    }

    html = html.replace('{{ productCategories }}', categoriesHtml);

    return html;
  }

  if (html.includes('{{ products }}')) {
    const productEntryPage = await models.Pages.findOne({
      siteId: site._id,
      name: `product_entry`
    });

    let productEntryHtml = '';
    let productEntryCss = '';

    if (productEntryPage) {
      productEntryHtml = productEntryPage.html;
      productEntryCss = productEntryPage.css;
    }

    const products = await sendCommonMessage({
      subdomain,
      serviceName: 'products',
      action: 'find',
      isRPC: true,
      data: { query: { categoryId: queryParams.categoryId } }
    });

    let productsHtml = '';

    for (const product of products) {
      let replacedHtml = replaceProductInfo(productEntryHtml, product);
      productsHtml += ` <div class="product-item">${replacedHtml}</div>`;
    }

    html = html.replace(
      '{{ products }}',
      `${productsHtml}<style>${productEntryCss}</style>`
    );

    return html;
  }

  if (page.name === 'product_detail') {
    const product = await sendCommonMessage({
      subdomain,
      serviceName: 'products',
      action: 'findOne',
      isRPC: true,
      data: { _id: queryParams.productId }
    });

    html = replaceProductInfo(html, product);
  }

  return html;
};

const pageReplacer = async (args: {
  models: IModels;
  subdomain: string;
  page: IPageDocument;
  site: ISiteDocument;
  options?: { queryParams?: any; replaceCss: boolean };
}) => {
  const { models, subdomain, page, site, options } = args;
  const { queryParams } = options || {};

  let html = pathReplacer(subdomain, page.html, site);

  html = await ecommerceReplacer({
    models,
    subdomain,
    site,
    page,
    html,
    queryParams
  });

  const pages = await models.Pages.find({
    siteId: site._id,
    name: { $ne: page.name }
  });

  for (const p of pages) {
    const holder = `{{${p.name}}}`;

    if (html.includes(holder)) {
      let skip;
      let limit;

      // regex to find the entry limit
      const regex = `\\${holder}-([0-9]+):([0-9]+)\\b`;

      // find an entry limit from the html
      const match = html.match(regex) || [];

      // check the entry limit exists in page
      if (match[1] && match[2]) {
        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);

        // remove an entry limit from html
        html = html.replace(`${holder}-${start}:${end}`, `${holder}`);

        limit = end - start + 1;
        skip = start - 1;
      }

      html = html.replace(
        new RegExp(holder, 'g'),
        await entryReplacer(models, subdomain, site, p, limit, skip)
      );
    }
  }

  let productDetailScript = '';

  if (page.name === 'product_detail') {
    productDetailScript = `
      <div id="quantity-chooser">
        <button id="quantity-chooser-minus">-<button>
          <span id="quantity-chooser-quantity"><span>
        <button id="quantity-chooser-plus">+</button>
      </div>

      <script>
        let quantity = 1;

        function showQuantity() {
          $("#quantity-chooser-quantity").text(quantity);
        }

        $(document).ready(() => {
          showQuantity();

          $("#quantity-chooser-minus").click(() => {
            if (quantity > 1) {
              quantity--;
              showQuantity();
            }
          });

          $("#quantity-chooser-plus").click(() => {
            quantity++;
            showQuantity();
          });

          $("#add-to-cart").click(() => {
            $.ajax({
              url: "${generateUrl(subdomain, site.name, 'add-to-cart')}",
              method: "post",
              data: {
                quantity,
                productId: "${queryParams.productId}"
              },
              success: () => {
                alert('Success');
              }
            })
          });
        });
      </script>
    `;
  }

  html += `
    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
    ${productDetailScript}
  `;

  if (options && options.replaceCss) {
    return `
      ${html}
      <style>
        ${page.css}
      </style>
    `;
  }

  return html;
};

export { pageReplacer };
