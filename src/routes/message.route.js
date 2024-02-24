const express = require('express')
const router = express.Router();
const {massegegetAll,massegegeDelete,massegeUpdate,massegePost,massegegetSingleByChatId,massegegetSingle} = require("../controllers/message.controller");

router.get('/get-all',massegegetAll)
router.get('/getsingle-byId/:id',massegegetSingle)
router.get('/getsingle-byChatId/:chatId',massegegetSingleByChatId)
router.post('/post',massegePost)
router.put('/update/:id',massegeUpdate)
router.delete('/delete/:id',massegegeDelete)

module.exports = router;
