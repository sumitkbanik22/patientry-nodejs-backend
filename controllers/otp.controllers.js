const Send_Otp = require('sendotp');
const { msg91_authkey } = require('../configs/config');

const send_otp = new Send_Otp(msg91_authkey);
