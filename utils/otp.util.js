const fast2sms = require("fast-two-sms");
const { fast2sms_authkey } = require('../configs/config');

exports.generateOTP = (otp_length) => {
    
    const Otp = Math.floor(Math.random() * (9 * (Math.pow(10, otp_length - 1)))) + (Math.pow(10, otp_length - 1));

    return Otp;
    
};

exports.fast2smsSendOtp = async ({ message, contactNumber }, next) => {
    try {
      const res = await fast2sms.sendMessage({
        authorization: fast2sms_authkey,
        message,
        numbers: [contactNumber],
      });
      console.log(res);
    } catch (error) {
      next(error);
    }
};
