import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  MONGO_TEST_USER,
  MONGO_TEST_PATH,
  MONGO_TEST_PASSWORD,
  NODE_ENV
} = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_PATH) {
  Logger.error('Failed to initialize database env variables.');
  process.exit(1);
}

if (NODE_ENV === 'test' && (!MONGO_TEST_PATH || !MONGO_TEST_PASSWORD || !MONGO_TEST_USER)) {
  Logger.error('Failed to initialize database test env variables.');
  process.exit(1);
}

export default {
  connectionPath: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`,
  testConnectionPath: `mongodb+srv://${MONGO_TEST_USER}:${MONGO_TEST_PASSWORD}@${MONGO_TEST_PATH}`
};
