const mongoose = require("mongoose");

const RefreshToken = mongoose.model(
    'RefreshToken',
    new mongoose.Schema({
        id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        refresh_token: {
            type: String,
            required: true
        }
    }, { timestamps: true })
);

module.exports = RefreshToken;