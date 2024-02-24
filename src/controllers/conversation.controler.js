
const Conversation = require('../models/conversation.modal')

const createConversation = async()=>{
    try {
        
        const conversation = new Conversation(req.body);
        await conversation.save();
    //    await saveConversationId( userId, req.body)
        res.status(201).json(conversation);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

const saveConversationId = async(userId ,conversationIds)=>{


    try {
        const user = await User.findById(userId);
        if (!user) {
            return // res.status(404).json({ error: "User not found" });
        }

        user.conversations = [...user.conversations, ...conversationIds];
        await user.save();

        //res.json({ message: "Conversation IDs updated successfully" });
    } catch (error) {
        //res.status(500).json({ error: error.message });
    }
}

const getConversation = async()=>{
    try {
        const conversations = await Conversation.find();
        res.json(conversations);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}


const getSingleConversation = async()=>{

    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
          return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json(conversation);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      
}

module.exports ={getSingleConversation,getConversation,createConversation}