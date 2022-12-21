import { Sequelize, DataTypes } from 'sequelize';
import { generateModels } from '../src/connectionResolver';

/**
 * Connects to mysql server and extracts
 */

export const connectToMysql = async (req, res) => {
  const sequelize = new Sequelize('test_db', 'nandi', 'password', {
    host: 'localhost',
    dialect: 'mysql'
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(error => {
      console.error('Unable to connect to the database: ', error);
    });

  const Timeclock = sequelize.define('attlog', {
    authDateTime: {
      type: DataTypes.DATE
    },
    authDate: {
      type: DataTypes.DATEONLY
    },
    authTime: {
      type: DataTypes.TIME
    },
    direction: {
      type: DataTypes.STRING
    },
    deviceName: {
      type: DataTypes.STRING
    },
    deviceSerialNo: {
      type: DataTypes.STRING
    },
    employeeName: {
      type: DataTypes.STRING
    },
    cardNo: {
      type: DataTypes.STRING
    }
  });

  extractAllData(Timeclock);
  res.json('success');
};

const extractAllData = (db: any) => {
  let data;
  db.findAll({
    raw: true
  })
    .then(resss => {
      data = resss;
    })
    .catch(error => {
      console.error('Failed to retrieve data : ', error);
    });

  console.log(data);
};
