const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
    superAdmin: {
        type: String,
        required: true
    },
    superEmail: {
        type: String,
        required: true
    },
    superNumber: {
        type: String,
        required: true
    },
    superImg: {
        type: String,
        required: true
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
    isSuperAdmin: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
