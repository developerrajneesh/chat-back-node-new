const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userNumber: {
        type: String,
        required: true
    },
    userImg: {
        type: String,
        default: 'N/A'
    },
    password: {
        type: String,
        required: true
    },
    token: [{
        type: String
    }],
    isLogin: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    oldpassword: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    accessRoutes:[{
        type: String
    }],
    loginhistory: [{
        type: String
    }],
    accountStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    conversations:[],
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
