const SendOtp = require("../models/sendOtp");
const User = require("../models/user");

const { generateOTP, fast2smsSendOtp } = require("../utils/otp.util");
const { generateUniqueUserId } = require("../utils/user.util");

const authJWT = require("../middleware/authJWT.middleware");

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
            if ((otp_entered_time) > (new Date(sentOtpObj.expireAt))) {
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

exports.registerUser = async (req, res, next) => {

    try{
        
        const { email, mobile_number, user_name } = req.body;

        const user_exist = await User.findOne({
            $or: [{
                email: email
            }, {
                mobile_number: mobile_number
            }, {
                user_name: user_name
            }]
        });

        if (user_exist) {
            if (user_exist.email === email) {
                next({ status: 400, message: 'Email already exists' });
                return;
            } else if (user_exist.mobile_number === mobile_number) {
                next({ status: 400, message: 'Mobile number already exists' });
                return;
            } else if (user_exist.user_name === user_name) {
                next({ status: 400, message: 'User name already exists' });
                return;
            } 
        }

        const user_id = generateUniqueUserId();

        const user_data = {
            id: user_id,
            ...req.body,
        };

        await User.insertMany({...user_data});

        res.status(201).json({
            type: "success",
            message: "User registered successfully",
            data: {
                ...user_data
            }
        });


    }catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {

    try{

        const user_exist = await User.findOne({ user_name: req.body.user_name});

        if (!user_exist) {
            next({ status: 400, message: 'User name does not exist' });
            return;
        }

        if (user_exist && user_exist.password !== req.body.password) {
            next({ status: 400, message: 'Incorrect Password' });
            return;
        }

        const payload = {
            id : user_exist.id,
            email: user_exist.email,
            mobile_number: user_exist.mobile_number,
            user_name: user_exist.user_name
        };

        const access_token = authJWT.getAccessToken(payload);
        const refresh_token = authJWT.getRefreshToken(payload);

        // console.log(access_token);
        // console.log(refresh_token);

        await res.status(201).json({
            type: 'success',
            data: {
                first_name: user_exist.first_name,
                last_name : user_exist.last_name,
                email: user_exist.email,
                mobile_number: user_exist.mobile_number,
                user_name: user_exist.user_name,
                address: user_exist.address,
                city: user_exist.city,
                district: user_exist.district,
                pin_code: user_exist.pin_code,
                state: user_exist.state,
                country: user_exist.country,
                access_token: access_token,
                refresh_token: refresh_token
            }
        })
        

    } catch (error) {
        next(error);
    }
};

