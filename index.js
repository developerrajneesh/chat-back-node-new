const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const cors = require("cors");
const MessageSchema = require("./src/models/message.modal");
const UserSchema = require("./src/models/user.model");
const port =  4050;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ origin: "*", credentials: true }));
app.use("/", express.static("public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

app.use("/api/v1/user", require("./src/routes/user.route"));
app.use("/api/v1/message", require("./src/routes/message.route"));

// io.on('connection', socket => {
let usersData = [];
let TypingUsersData = [];
function checkSenderId(messages, senderIdToCheck) {
  for (let i = 0; i < messages.length; i++) {
      if (messages[i].senderId === senderIdToCheck) {
          return true; // Sender ID found
      }
  }
  return false; // Sender ID not found
}
io.on("connection", (socket) => {

  socket.on("senderdata", async (userId) => {
    try {
      const isSoketExist = usersData.find((user) => user.socketId === socket.id);
      // const isUserExist = usersData.find((user) => user.userId === userId);
      const newArr = usersData.filter(user => user.userId !== userId) 

      console.log('=>>1',usersData, socket.id); 
      if (!isSoketExist) {
        const user = { userId, socketId: socket.id };
        newArr.push(user);
        usersData = []
        usersData = newArr

        // io.emit('getUsers', users);
      }
      
      const user = await UserSchema.findById(userId);
      console.log('user = >',user);
      socket?.emit("getsenderdata", user);
      io.emit("ActiveUsers", usersData);
   
    } catch (error) {
      console.log(error);
    }


  });






  socket.on("typingUser", async (user) => {
   
    
    if (!checkSenderId(TypingUsersData,user.senderId)) {
      TypingUsersData.push(user)
      const receiver = usersData.find(
        (entry) => entry.userId == user.receiverId
      );
      io.to(receiver?.socketId).emit('GetTypingUsers',TypingUsersData)
    }
  })
  socket.on("typingUserStop", async (user) => {
    // if (!checkSenderId(TypingUsersData,user.senderId)) {
      TypingUsersData =  TypingUsersData.filter(item => item.senderId !== user.senderId)
      const receiver = usersData.find(
        (entry) => entry.userId == user.receiverId
      );
      io.to(receiver?.socketId).emit('GetTypingUsers',TypingUsersData)
    
    // }
  })

  socket.on("message", async (message) => {
    // console.log(message);
    try {
      const newMessage = new MessageSchema(message);
      console.log('newMessage =>',newMessage);
      console.log('newMessage c=>',message);
      await newMessage.save();
      if (message.new) {
        await saveConversationId(
          message.userReceiverId,
          message.conversationId
        );
        await saveConversationId(message.userSenderId, message.conversationId);
      }

      const messages = await MessageSchema.find({
        conversationId: message.conversationId,
      });

      const receiverID = messages.find(
        (user) => user.userReceiverId === message.userReceiverId
      );

      const receiver = usersData.find(
        (entry) => entry.userId === message.userReceiverId
      );

          
      if (receiver?.socketId) {
        io.to(socket.id).to(receiver?.socketId).emit("getmessage", {messages:messages,receiverId:message.userReceiverId,senderId:message.userSenderId});
      }else{
        io.to(socket.id).to(receiver?.socketId).emit("getmessage", {messages:messages,receiverId:message.userReceiverId,senderId:message.userSenderId});
      }
      console.log('messages =>',messages);
      socket.emit('getllUser')  
      const user = await UserSchema.findById(message.userSenderId);
      socket?.emit("getsenderdata", user);    
    } catch (error) {
      console.log(error);
    }
  });
        
  
  socket.on('Userdisconnect', async (userId) => {
    usersData = usersData.filter(user => user.socketId !== socket.id);
    const user = await UserSchema.findByIdAndUpdate(userId, {lastSeen:Date.now()}, { new: true, runValidators: true });
    io.emit("ActiveUsers", usersData);
    console.log('a user has been left',userId,user);  
    io.emit('getllUser')      
});

socket.emit('getllUser')
});
// })
const saveConversationId = async (userId, conversationIds) => {
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return; // res.status(404).json({ error: "User not found" });
    }

    user.conversations = [...user.conversations, conversationIds];
    await user.save();

    //res.json({ message: "Conversation IDs updated successfully" });
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: error.message });
  }
};

try {
  mongoose
    .connect('mongodb+srv://developerrajneeshshukla:developerrajneeshshukla@cluster0.g2znvz4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => console.log("Connection unsuccessfull", err));
} catch (err) {
  console.log(err);
}

server.listen(port, () =>
  console.log("Server and Socket.IO are running on :", port)
);
