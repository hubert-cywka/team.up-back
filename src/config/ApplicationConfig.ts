import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { PORT } = process.env;

if (!PORT) {
  Logger.error('Failed to initialize application env variables.');
  process.exit(1);
}

export default {
  port: parseInt(PORT)
};
