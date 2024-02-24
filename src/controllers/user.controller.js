const User = require('../models/user.model')

const  userRegister = async (req, res) => {
    try {

const newdata = {...req.body,userImg:req.file. filename}

console.log(newdata);
        const newUser = new User(newdata);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
}

const  userGetAll = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

const  userGetSingleUser =async  (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

const  userupdate = async (req, res) => {
    const updates = Object.keys(req.body);

    const allowedUpdates = ['userName', 'userEmail', 'userNumber', 'userImg', 'password', 'isAdmin', 'isAccess','conversations', 'accountStatus'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}


const  userDelete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}


const userLogin= async(req, res) => {
const {email ,password} = req?.body
const user = await User.findOne({ userEmail:email})

if (!user) {
  return  res.status(404).send({login:false,msg:'No user found with this email address'});
}
if (password == user.password) {
    res.status(200).send({login:true,user});
}else{
    res.status(404).send({login:false,msg:'Invalid password'});
}
// console.log(user);
}

module.exports ={userRegister,userLogin, userGetAll,userGetSingleUser,userupdate,userDelete}