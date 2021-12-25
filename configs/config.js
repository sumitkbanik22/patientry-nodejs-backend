const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  base_url: process.env.BASE_URL,
  fast2sms_authkey: process.env.FAST2SMS_AUTHKEY,
  db_user: process.env.DB_USER,
  db_pass: process.env.DB_PASS,
  db_name: process.env.DB_NAME,
  node_env: process.env.NODE_ENV
};