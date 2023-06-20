import { IModels } from './connectionResolver';
import { sendCommonMessage } from './messageBroker';
import { IPageDocument } from './models/definitions/pages';
import { ISiteDocument } from './models/definitions/sites';

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

const pluginReplacer = async (args: {
  subdomain: string;
  site: ISiteDocument;
  content: string;
  options;
}) => {
  const { subdomain, content, site, options } = args;

  let html = pathReplacer(subdomain, content, site);

  // regex to find plugin placeholer
  const matches = html.matchAll(/{{plugin-(\w+):(.+)}}/g) || [];

  for (const match of matches) {
    const [holder, pluginname, action] = match;

    const pluginHtml = await sendCommonMessage({
      subdomain,
      serviceName: pluginname,
      action: 'webbuilder.replacer',
      isRPC: true,
      defaultValue: '',
      data: {
        sitename: site.name,
        action,
        ...options
      }
    });

    html = html.replace(new RegExp(holder, 'g'), pluginHtml);
  }

  return html;
};

const pageReplacer = async (args: {
  models: IModels;
  subdomain: string;
  page: IPageDocument;
  site: ISiteDocument;
  options?: { query?: any; params?: any; replaceCss?: boolean };
}) => {
  const { models, subdomain, page, site, options } = args;
  const { query, params } = options || {};

  let html = pathReplacer(subdomain, page.html, site);

  html = html.replace(/{{ sitename }}/g, site.name);

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

  html = await pluginReplacer({
    subdomain,
    site,
    content: html,
    options
  });

  html =
    `
    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
  ` + html;

  const extendsmatch = html.match(/{% extends (\w+) %}/);

  if (extendsmatch && extendsmatch.length > 0) {
    const extendspagename = extendsmatch[1];
    const extendsPage = await models.Pages.findOne({ name: extendspagename });

    if (!extendsPage) {
      throw new Error('Extends page not found');
    }

    let newhtml = await pluginReplacer({
      subdomain,
      site,
      content: extendsPage.html,
      options
    });

    newhtml = newhtml.replace('{% content %}', html);

    html = `
      ${newhtml}

      <style>
        ${extendsPage.css}
      </style>
    `;
  }

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
