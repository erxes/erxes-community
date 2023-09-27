const dotenv = require('dotenv');
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');
const FormData = require('form-data');
const fs = require('fs');

dotenv.config();

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);

const imagesPath = '/home/munkhgoy/Downloads/JURUR_CustomizedCakes_imgs/';
let db;
let ProductCategories;
let Products;

const uploadToCFImages = async (file) => {
  const CLOUDFLARE_ACCOUNT_ID = '7c8392aff8ac4518aa06dfa4b6337ef2';
  const CLOUDFLARE_API_TOKEN = '7qkOs6vzTjqz428rLSEr-zh2K2opXDJLAqRjzN3n';
  const CLOUDFLARE_BUCKET_NAME = 'jurur';

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
  const headers = {
    Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
  };

  const fileName = `${file.name.replace(/ /g, '_').replace(/\\./g, '_')}`;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(file.path));
  formData.append('id', `${CLOUDFLARE_BUCKET_NAME}/${fileName}`);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Error uploading file to Cloudflare Images ${file.name}`);
  }

  if (data.result.variants.length === 0) {
    throw new Error(`Error uploading file to Cloudflare Images ${file.name}`);
  }

  return data.result.variants[0];
};

const extentions = ['jpg', 'png', 'jpeg']

const productInfos = [{ imageName: 'black pink' }, { imageName: 'boss baby' }, { imageName: 'double birthday cake' }, { imageName: 'Heart letter' }, { imageName: 'international womens day' }, { imageName: 'jack daniels' }, { imageName: 'notebook' }, { imageName: 'Only mans' }, { imageName: 'Pubg' }, { imageName: 'Sevleg Rectangle' }, { imageName: 'womens day' }];
const command = async () => {
  await client.connect();
  db = client.db();

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  const uploadedImages = [];
  const notFoundImages = [];
  for (const productData of productInfos) {
    const { imageName } = productData;
    let extention = ''
    for (const ext of extentions) {
      if (fs.existsSync(`${imagesPath}/${imageName}.${ext}`)) {
        extention = ext;
        continue;
      }
    }

    if (!extention) {
      notFoundImages.push(imageName);
      continue;
    }

    const lastName = `${imageName}.${extention}`
    const nameOrLink = await uploadToCFImages({ name: lastName, path: `${imagesPath}/${lastName}` });
    console.log(`success: ${nameOrLink}`)
    uploadedImages.push(nameOrLink)
  }

  console.log(notFoundImages)

  console.log(`Process finished at: ${new Date()}, count: ${uploadedImages.length}`);

  process.exit();
};

command();
