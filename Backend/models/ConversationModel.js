import mongoose from "mongoose";

const ConversationSchema =new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    ],
    messages:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:'Message',
        }
    ]
},{timestamps:true})

const ConversationModel =mongoose.model('Conversation',ConversationSchema)

export default ConversationModel;