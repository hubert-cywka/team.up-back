import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_PATH) {
  Logger.error('Failed to initialize database env variables.');
  process.exit(1);
}

export default {
  connectionPath: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`
};
