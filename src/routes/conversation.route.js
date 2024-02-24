const express = require('express')
const router = express.Router();
const {getSingleConversation,getConversation,createConversation} = require("../controllers/conversation.controler");

router.get('/get-all',getConversation)
router.get('/getsingle-byId/:id',getSingleConversation)
router.post('/post',createConversation)


module.exports = router;
