import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { JWT_TIME, JWT_SECRET } = process.env;

if (!JWT_TIME || !JWT_SECRET) {
  Logger.error('Failed to initialize tokens env variables.');
  process.exit(1);
}

export default {
  timeToExpire: parseInt(JWT_TIME),
  secret: JWT_SECRET
};
