const mongoose = require("mongoose");

const SendOtp = mongoose.model(
  "SendOtp",
  new mongoose.Schema({
    mobile : Number,
    otp: Number,
    expireAt: { type: Date, default: new Date((new Date()).getTime() + 60000) }
  })
);

module.exports = SendOtp;