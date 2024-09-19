import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true ,unique:true},
  email: { type: String, required: true ,unique:true},
  password: { type: String, required: true ,select:false},
  profilePic: { type: String, default:'' },
  bio: { type: String, default:'' },
  gender: { type: String, default:'',ennum:['Male','Female'] },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
},{timestamps:true});

export const User =mongoose.model('User',userSchema)
  // export default User;