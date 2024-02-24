const express = require("express");
const env = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const cors = require("cors");
const Message = require("./src/models/message.modal");
const User = require("./src/models/user.model");
const port = process.env.PORT || 4050;

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
io.on("connection", (socket) => {

  socket.on("senderdata", async (userId) => {
    try {
      const isSoketExist = usersData.find((user) => user.socketId === socket.id);
      const isUserExist = usersData.find((user) => user.userId === userId);
      const newArr = usersData.filter(user => user.userId !== userId) 

      console.log('=>>1',usersData, socket.id);
      if (!isSoketExist) {
        const user = { userId, socketId: socket.id };
        newArr.push(user);
        usersData = []
        usersData = newArr

        // io.emit('getUsers', users);
      }
      
      const user = await User.findById(userId);
      socket?.emit("getsenderdata", user);
      
      console.log('=>>@',usersData, socket.id);
    } catch (error) {
      console.log(error);
    }


  });

  socket.on("message", async (message) => {
    try {
      const newMessage = new Message(message);
      await newMessage.save();
      if (message.new) {
        await saveConversationId(
          message.userReceiverId,
          message.conversationId
        );
        await saveConversationId(message.userSenderId, message.conversationId);
      }

      const messages = await Message.find({
        conversationId: message.conversationId,
      });

      const receiverID = usersData.find(
        (user) => user.userId === message.userReceiverId
      );

      const senderID = usersData.find(
        (entry) => entry.userId === message.userSenderId
      );

      console.log("User usersData", usersData,);
        io.to(senderID?.socketId)
        .to(receiverID?.socketId)
        .emit("getmessage", messages);
                
    } catch (error) {
      console.log(error);
    }
  });
        
  
  socket.on('Userdisconnect', (userId) => {
    usersData = usersData.filter(user => user.socketId !== socket.id);
    // io.emit('getUsers', usersData);
    console.log('a user has been left',userId,usersData);
});

  console.log('=====',usersData, socket.id);
});
// })
const saveConversationId = async (userId, conversationIds) => {
  try {
    const user = await User.findById(userId);
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
    .connect(process.env.mongodb_uri)
    .then(() => console.log("Connected to database successfully"))
    .catch((err) => console.log("Connection unsuccessfull", err));
} catch (err) {
  console.log(err);
}

server.listen(port, () =>
  console.log("Server and Socket.IO are running on :", port)
);
