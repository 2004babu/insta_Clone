import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    
    images: { type: String, required: true },
    OwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content:{type:String,required:true},
    captions: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref:'Comments'}],
  },
  
  { timestamps: true }
);

export const  PostModel = mongoose.model("Post", postSchema);
