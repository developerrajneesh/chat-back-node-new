const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members:[]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
