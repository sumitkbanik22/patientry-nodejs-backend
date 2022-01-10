const mongoose = require("mongoose");

const SendOtp = mongoose.model(
  "SendOtp",
  new mongoose.Schema({
    mobile : Number,
    otp: Number,
    expireAt: { type: Date, default: Date.now}
  }, { timestamps: true })
);

module.exports = SendOtp;