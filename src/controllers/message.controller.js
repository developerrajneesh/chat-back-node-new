
const Message = require('../models/message.modal')
const User = require('../models/user.model')

const massegegetAll =  async (req, res) => {
    try {
        const messages = await Message.find();
        res.send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
}
const massegegetSingle =  async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).send();
        }
        res.send(message);
    } catch (error) {
        res.status(500).send(error);
    }
}
const massegegetSingleByChatId =  async (req, res) => {
    try {
       
        const messages = await Message.find({ conversationId: req.params.chatId });
        res.send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
}
const massegePost =  async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        if (req.body.new) {
          await  saveConversationId(req.body.userReceiverId,req.body.conversationId)
          await  saveConversationId(req.body.userSenderId,req.body.conversationId)
        }
        res.status(201).send(newMessage);
    } catch (error) {
        res.status(400).send(error);
    }
}

const saveConversationId = async(userId ,conversationIds)=>{


    try {
        const user = await User.findById(userId);
        if (!user) {
            return // res.status(404).json({ error: "User not found" });
        }

        user.conversations = [...user.conversations, conversationIds];
        await user.save();

        //res.json({ message: "Conversation IDs updated successfully" });
    } catch (error) {
        console.log(error);
        //res.status(500).json({ error: error.message });
    }
}


const massegeUpdate =  async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!message) {
            return res.status(404).send();
        }
        res.send(message);
    } catch (error) {
        res.status(400).send(error);
    }
}
const massegegeDelete =  async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).send();
        }
        res.send(message);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {massegegetAll,massegegeDelete,massegeUpdate,massegePost,massegegetSingleByChatId,massegegetSingle}