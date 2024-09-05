const catchAsyncError = require("../middlewares/catchAsyncError");
const errorHandler = require("../utils/errorHandler");
const Chat = require('../models/chatModel')
const User = require('../models/UserModel');


exports.accessChats = catchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return next(new errorHandler("UserId parameter not found", 400));
        }

        // Find existing chat
        let isChat = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate('users', 'avatar name email ')
            .populate('latestMessage');

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name avatar email '
        });

        if (isChat.length > 0) {
            // If chat exists, return the first chat
            return res.status(200).json({ success: true, chat: isChat[0] });
        } else {
            // If no chat exists, create a new chat
            const chatData = {
                chatName: "sender",
                users: [req.user.id, userId]
            };

            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate('users', "avatar name email ");

            return res.status(200).json({ success: true, chat: fullChat });
        }

    } catch (error) {
        return next(new errorHandler(error.message, 500));
    }
});


exports.fetchChats = catchAsyncError(async (req, res, next) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "avatar name email") 
            .populate("latestMessage") 
            .sort( '-1'); 

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name avatar email" 
        });

        res.status(200).json({ success: true, chats });

    } catch (error) {
        return next(new errorHandler(error.message, 500));
    }
});

