const SendOtp = require("../models/sendOtp");
const { generateOTP, fast2smsSendOtp } = require("../utils/otp.util");

exports.sendOTP = async (req, res, next) => {
    try {

        // generate otp
        const otp = generateOTP(6);

        // save OTP to sendOtp collection
        await SendOtp.insertMany({
            mobile: req.body.mobile_number,
            otp: otp
        })

        await fast2smsSendOtp(
            {
              message: `Your OTP is ${otp}`,
              contactNumber: req.body.mobile_number,
            },
            next
        );

        res.status(201).json({
            type: "success",
            message: "OTP sent to your entered mobile number"
        });
        
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {

    try {

        const { mobile_number, otp } = req.body;

        const sentOtpObj = await SendOtp.findOne({mobile : mobile_number, otp: otp});

        console.log(sentOtpObj);

        if (!sentOtpObj) {
            next({ status: 400, message: 'OTP not verified' });
            return;
        } else if (sentOtpObj) {
            const otp_entered_time = new Date();
            if (otp_entered_time.getTime() > (new Date(sentOtpObj.expireAt)).getTime()) {
                await SendOtp.deleteOne({mobile : mobile_number, otp: otp});
                next({ status: 400, message: 'OTP has expired' });
                return;
            }
        }

        res.status(201).json({
            type: "success",
            message: "OTP verified successfully"
        });

        await SendOtp.deleteOne({mobile : mobile_number, otp: otp});

    } catch (error) {
        next(error);
    }
};


