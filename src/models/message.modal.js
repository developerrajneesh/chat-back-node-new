const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId:{
        type: String,
        required: true
    },
    userSenderId: {
        type: String,
        required: true
    },
    new: {
        type: Boolean,
        default: true
    },
    userReceiverId: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    messageDate: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
