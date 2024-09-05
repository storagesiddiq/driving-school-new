const catchAsyncError = require("../middlewares/catchAsyncError");
const errorHandler = require("../utils/errorHandler");
const Chat = require('../models/chatModel')
const User = require('../models/UserModel');

const Message = require('../models/messageModel');

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  try {
   const {content, chatId} = req.body

   if(!content || !chatId){
    return next(new errorHandler("Invalid data passed!", 400));
   }

   var newMessage = {
    sender: req.user.id,
    content,
    chat:chatId
   }
   var message = await Message.create(newMessage)
   message = await message.populate('sender', 'name avatar')
   message = await message.populate('chat')
   message = await User.populate(message, {
    path:'chat.users',
    select:'name avatar email'
   })
       // Update the chat with the latest message
       await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message
    });
    res.status(200).json({ success: true, message });

  } catch (error) {
    return next(new errorHandler("Server error", 500));
  }
});

exports.allMessages = catchAsyncError(async (req, res, next) => {
  try {
   const messages = await Message.find({chat:req.params.chatId})
   .populate('sender','name avatar email').populate('chat')

   res.json(messages)
  
  } catch (error) {
    return next(new errorHandler(error, 500));
  }
});

