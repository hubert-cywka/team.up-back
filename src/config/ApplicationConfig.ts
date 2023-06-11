import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { PORT, ADMIN_PASSWORD, ADMIN_EMAIL } = process.env;

if (!PORT || !ADMIN_PASSWORD || !ADMIN_EMAIL) {
  Logger.error('Failed to initialize application env variables.');
  process.exit(1);
}

export default {
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
  port: parseInt(PORT)
};
