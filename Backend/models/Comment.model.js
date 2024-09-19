import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    messages: [{ type: String }],
    OwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    SenderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Content:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

export default CommentModel = mongoose.model("Comment", CommentSchema);
