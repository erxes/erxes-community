import mongoDb from 'mongodb';

var MongoClient = mongoDb.MongoClient;

var MONGO_URL = process.argv[2];

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

var client = new MongoClient(MONGO_URL);

console.log('Connected to ', MONGO_URL);

let db;

let Conformity;
let Car;

var command = async () => {
  await client.connect();
  db = client.db();

  Conformity = db.collection('conformities');
  Car = db.collection('cars');

  var conformities = await Conformity.find({
    $or: [{ mainType: 'car' }, { relType: 'car' }]
  }).toArray();

  await Conformity.deleteMany({
    $or: [{ mainType: 'car' }, { relType: 'car' }]
  });

  for (var conformity of conformities) {
    if (conformity.mainType === 'customer' && conformity.relType === 'car') {
      await Car.updateOne(
        { _id: conformity.relTypeId },
        {
          $push: {
            customerIds: conformity.mainTypeId
          }
        }
      );
    }
    if (conformity.mainType === 'car' && conformity.relType === 'customer') {
      await Car.updateOne(
        { _id: conformity.mainTypeId },
        {
          $push: { customerIds: conformity.relTypeId }
        }
      );
    }
    if (conformity.mainType === 'company' && conformity.relType === 'car') {
      await Car.updateOne(
        { _id: conformity.relTypeId },
        {
          $push: { companyIds: conformity.mainTypeId }
        }
      );
    }

    if (conformity.mainType === 'car' && conformity.relType === 'company') {
      await Car.updateOne(
        { _id: conformity.mainTypeId },
        {
          $push: { companyIds: conformity.relTypeId }
        }
      );
    }
  }

  console.log(`Process finished at: ${new Date()}`);

  process.exit();
};

command();
