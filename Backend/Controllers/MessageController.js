import catchAsyncError from "../MiddleWare/CatchAsyncError.cjs";
import MessageModel from "../models/MessageModel.js";
import ConversationModel from "../models/ConversationModel.js";
import mongoose from "mongoose";

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const receiverId = req?.params?.id;
  const senderId = req.user?._id;
  const MSG = req?.body?.msg;
  try {
    if (!receiverId || !senderId || !MSG) {
      return res
        .status(404)
        .json({ message: "Not receive Data ", success: false });
    }

    // console.log(MSG, receiverId, senderId);

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      msg: MSG,
    });
    // console.log(newMessage);

    let Conversation;

     Conversation = await ConversationModel.findOne({participants:{$all :[receiverId,senderId]} });
    if (!Conversation) {
     Conversation = await ConversationModel.create({participants:[receiverId,senderId],messages:[newMessage?._id]});
    }else{
      Conversation.messages.push(newMessage?._id);

    }


    await Promise.all([Conversation.save({validateBeforeSave:false}),
    newMessage.save({validateBeforeSave:false})])
    
    // console.log(Conversation);
    
    if (!Conversation) {
      throw Error('not found Conversation')
    }

    res.status(200).json({
      message: "Message sent successfully",
      success: true,
      Conversation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });

  }
});
export const getAllMessages = catchAsyncError(async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

export const getSingleMassage=catchAsyncError(async(req,res,next)=>{
    try {
        const id =req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)||!id) {
          return res.status(400).json({ message: "Invalid ObjectId" });

        }

      const Conversation =await ConversationModel.findOne({participants:{$all:[id]}}).populate('messages')
        // console.log(Conversation);
        if (!Conversation) {
          return res.status(401).json({success:false,Conversation:null})
        }
      return  res.status(200).json({Conversation,success:true});
        
    } catch (error) {
        console.log(error);

    }
})
// export const sendMessage=catchAsyncError(async(req,res,next)=>{
//     try {

//     } catch (error) {
//         console.log(error);

//     }
// })
// export const sendMessage=catchAsyncError(async(req,res,next)=>{
//     try {

//     } catch (error) {
//         console.log(error);

//     }
// })
// export const sendMessage=catchAsyncError(async(req,res,next)=>{
//     try {

//     } catch (error) {
//         console.log(error);

//     }
// })
