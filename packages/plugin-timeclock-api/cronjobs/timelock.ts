import { Sequelize, DataTypes, Op } from 'sequelize';
import { generateModels } from '../src/connectionResolver';

/**
 * Connects to mysql server and extracts
 */

export interface ITimeClock {
  userId?: string;
  solved?: boolean;
  status?: string;
  shiftStart: Date;
  shiftEnd?: Date;
  shiftActive?: boolean;
  branchName?: number;
  latitude?: number;
}

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
    _ID: {
      type: DataTypes.DATE
    },
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

  const data = extractAllData(Timeclock);
  extractNewData(Timeclock);
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

  return data;
};

const extractNewData = (db: any) => {
  // find all time clock of today
  const time = new Date('2022-12-22');

  const arr = db
    .findAll({
      raw: true,
      authDateTime: {
        where: { [Op.gte]: time }
      }
    })
    .then(res => {
      // console.log('22222222222222', res);
    });
};
