import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { PORT, ADMIN_PASSWORD, ADMIN_EMAIL, FRONTEND_URL } = process.env;

if (!PORT || !ADMIN_PASSWORD || !ADMIN_EMAIL || !FRONTEND_URL) {
  Logger.error('Failed to initialize application env variables.');
  process.exit(1);
}

export default {
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
  port: parseInt(PORT),
  frontendUrl: FRONTEND_URL
};
