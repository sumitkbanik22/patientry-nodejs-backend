const mongoose = require("mongoose");

const User = mongoose.model(
    "Users",
    new mongoose.Schema({

        id: {
            type: String,
            required: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        mobile_number: {
            type: Number,
            required: true,
            unique: true
        },
        user_name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        district: {
            type: String,
            required: false
        },
        pin_code: {
            type: Number,
            required: false
        },
        state: {
            type: String,
            required: false
        },
        country: {
            type: String,
            required: false
        },
    }, { timestamps: true })
);

module.exports = User;