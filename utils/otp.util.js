const fast2sms = require("fast-two-sms");
const { fast2sms_authkey } = require('../configs/config');

exports.generateOTP = (otp_length) => {
    // Declare a digits variable
    // which stores all digits
    var digits = "123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    if (OTP) {
      return Number(OTP);
    }
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
