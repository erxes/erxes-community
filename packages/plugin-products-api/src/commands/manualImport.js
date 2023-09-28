
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const { data, images } = require('./data')

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

const nanoid = (len = 21) => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let randomString = '';

  for (let i = 0; i < len; i++) {
    const position = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(position, position + 1);
  }

  return randomString;
};

const command = async () => {
  await client.connect();
  console.log(Boolean(client))
  db = client.db();
  console.log(Boolean(db))

  const extentions = ['jpg', 'png', 'jpeg'];
  notFoundImages = [];

  ProductCategories = db.collection('product_categories');
  Products = db.collection('products');

  console.log(`Process start at: ${new Date()}`);

  const defaultCat = await ProductCategories.findOne({ _id: 'n3YKs5DKKnEPz2TLF' });

  const now = new Date();

  for (const info of data) {
    const { categoryName } = info;
    const imageName = `jurur/${categoryName.replace(/ /g, '_').replace(/\\./g, '_').replace('`', '')}`

    let extention = ''
    for (const ext of extentions) {
      if (images.includes(`${imageName}.${ext}`)) {
        extention = ext;
        continue;
      }
    }
    let attachment;

    if (!extention) {
      notFoundImages.push(imageName);
    } else {
      const imgFullName = `${imageName.replace('jurur/', '')}.${extention}`

      attachment = {
        url: imgFullName,
        name: imgFullName,
        type: `image/${extention}`,
        size: 405740
      }
    }

    let category = await ProductCategories.findOne({ name: categoryName });
    categorySameDoc = {
      attachment,
      isSimilarity: true,
      similarities: [
        {
          id: Math.random().toString(),
          title: "Хэмжээ сонгох",
          groupId: "WZ6Mdwj3hYRzftkBt",
          fieldId: "hxeqroQPBnav2mZYA"
        },
        {
          id: Math.random().toString(),
          title: "Амт сонгох",
          groupId: "WZ6Mdwj3hYRzftkBt",
          fieldId: "N8KjYpZBZ3A4yDKJZ"
        }
      ]
    }

    if (category) {
      ProductCategories.updateOne({ _id: category._id }, {
        $set: { ...categorySameDoc }
      })

    } else {
      const catId = nanoid();
      await ProductCategories.insertOne({
        _id: catId,
        code: categoryName,
        name: categoryName,
        description: "Зөвхөн тоо болон нэр солино гэдгийг анхаарна уу.",
        meta: "24",
        createdAt: now,
        parentId: defaultCat._id,
        ...categorySameDoc
      })

      category = ProductCategories.findOne({ _id: catId });
    }

    const oldProduct = await Products.findOne({ code: info.code }) || {};

    let _id = oldProduct._id;
    if (!oldProduct || !_id) {
      _id = nanoid();
    }

    const doc = {
      createdAt: now,
      ...oldProduct,
      ...info,
      status: "active",
      categoryId: category._id,
      uom: 'ш',
      type: 'product',
      attachment
    };

    await Products.updateOne({ _id }, { $set: { ...doc } }, { upsert: true });
  }
  console.log('notFoundImages', notFoundImages)
  console.log(`Process finished at: ${now}`);

  process.exit();
};

command();
