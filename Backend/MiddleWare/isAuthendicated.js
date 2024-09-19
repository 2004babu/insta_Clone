
import { User } from "../models/user.model.js";
import CatchAsyncError from "./CatchAsyncError.cjs";
import jwt from "jsonwebtoken";
export const isAuthendicated = CatchAsyncError(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: "your Not Varified User..pls Login First not cookie " });
    }
    const userId = await jwt.verify(token, process.env.SECRECT_KEY,{algorithms:"HS256"});
    console.log(userId.id);

    const user = await User.findById(userId?.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "your Not Varified User..pls Login First 22" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({ error });
  }
});
