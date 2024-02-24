const express = require('express')
const router = express.Router();
const {userRegister,userLogin, userGetAll,userGetSingleUser,userupdate,userDelete} = require("../controllers/user.controller");
const  multerUpload  = require('../../utils/multerFile');
router.get('/get-all',userGetAll)
router.get('/getsingle/:id',userGetSingleUser)
router.post('/register',multerUpload.single('userImg'),userRegister)
router.post('/login',userLogin)
router.put('/update/:id',userupdate)
router.delete('/delete/:id',userDelete)

module.exports = router;
