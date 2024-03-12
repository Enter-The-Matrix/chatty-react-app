import Conversation from "../model/conversation.model.js";
import Messages from "../model/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Messages({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save()
    // await newMessage.save()
    // to run above 2 code parallel

    await Promise.all([conversation.save(), newMessage.save()]);

        // socket io functionality here

        const receiverSocketId = getReceiverSocketId(receiverId)

        if(receiverSocketId){
          io.to(receiverSocketId).emit("newMessage", newMessage)
        }



    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const senderId = req.user._id;
    // console.log("userToChat:", userToChat);
    // console.log("senderId:", senderId);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChat] },
    }).populate("messages");

    if(!conversation){
      return res.status(200).json([])
    }

    res.status(200).json(conversation.messages);
    
  } catch (error) {
    console.log("Error in getMessage controller", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
