import process from 'process';
import Logger from '../helpers/Logger';

require('dotenv').config();
const { PORT, ADMIN_PASSWORD, ADMIN_EMAIL, FRONTEND_URL, RATE_LIMIT, RATE_LIMIT_TIMESPAN } = process.env;

if (!PORT || !ADMIN_PASSWORD || !ADMIN_EMAIL || !FRONTEND_URL || !RATE_LIMIT || !RATE_LIMIT_TIMESPAN) {
  Logger.error('Failed to initialize application env variables.');
  process.exit(1);
}

export default {
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
  port: parseInt(PORT),
  frontendUrl: FRONTEND_URL,
  rateLimit: parseInt(RATE_LIMIT),
  rateLimitTimespan: parseInt(RATE_LIMIT_TIMESPAN)
};
