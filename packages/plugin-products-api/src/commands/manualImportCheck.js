const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data } = require('./data')

dotenv.config();

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);
console.log(client)

let db;
let ProductCategories;
let Products;

const command = async () => {
  await client.connect();
  db = client.db();

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  console.log(`Process start at: ${new Date()}`);

  const defaultCat = await ProductCategories.findOne({ _id: 'n3YKs5DKKnEPz2TLF' });

  for (const info of data) {
    const { categoryName } = info;
    let category = await ProductCategories.findOne({ name: categoryName });
    if (!category) {
      console.log(categoryName)
    }
  }

  console.log(`Process finished at: ${new Date()}`);

  process.exit();
};

command();
