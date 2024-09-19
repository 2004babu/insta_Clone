// import CatchAsyncError from "../MiddleWare/CatchAsyncError.js";
import bycrpt from "bcrypt";
import { User } from "../models/user.model.js";
import jwt from "../utils/jwt.js";
import CatchAsyncError from "../MiddleWare/CatchAsyncError.cjs";
import jsonwebtoken from "jsonwebtoken";

export const get = async (req, res) => {
  res.status(200).send("jfhdjfjdfhjdfvh");
};

export const sighUp = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    if (!email || !password || !userName) {
      return res
        .status(401)
        .json({ message: "Check Entered Values ", success: false });
    }
    let image;

    const hasedPassword = await bycrpt.hash(password, 10);
    let user;

    if (req.file) {
      let BASE_URL = `${process.env.BACKEND_URL}/uploads/images/${req.file.originalname}`;

      image = BASE_URL;
      if (process.env.NODE_ENV === "Production") {
        image = BASE_URL = `${req.protocol}://${req.get(
          "host"
        )}/uploads/images/${req.file.originalname}`;
      }

      console.log(BASE_URL);

      user = await User.create({
        email,
        userName,
        password: hasedPassword,
        profilePic: image,
      });

      await user.save();
    } else {
      user = await User.create({
        email,
        userName,
        password: hasedPassword,
      });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "error in creating user Id ", success: false });
    }
    console.log(user);

    jwt(res, user, 200);
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({ error });
  }
});

export const login = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Check Entered Values ", success: false });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not Found This Email !. ", success: false });
    }

    const hasedPassword = await bycrpt.compare(password, user.password);

    if (!hasedPassword) {
      return res
        .status(200)
        .json({ message: "password Doesnot match . ", success: false });
    }
    jwt(res, user, 200);
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({ error });
  }
});

export const logout = CatchAsyncError(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not Authendicated user", success: false });
    }
    res
      .status(200)
      .cookie("token", "", { maxage: 0 })
      .json({ message: "Logout Success" });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({ error });
  }
});

//////profile

export const EditProfile = CatchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { userName, bio } = req.body;
  if (!userName)
    return res
      .status(401)
      .json({ message: "No value found  ", success: false });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Not Authendicated user", success: false });
  }
  if (!bio) {
    const user = await User.findByIdAndUpdate(user._id, { userName });
  } else {
    const user = await User.findByIdAndUpdate(user._id, { userName, bio });
  }
  return res.status(200).json({ user });
});

export const followUnFollow = CatchAsyncError(async (req, res, next) => {
  try {
    if (req?.user?._id === req.params.id) {
      return res.statu(200).json({ message: "You Cont follow yourSelf..." });
    }

    if (!req.user._id || !req.params.id) {
      return res
        .status(401)
        .json({ message: "Not Found users   ", success: false });
    }

    const logedInUserId = await User.findById(req.user._id);
    const anotherUserId = await User.findById(req.params.id);

    if (!logedInUserId || !anotherUserId) {
      return res
        .status(401)
        .json({ message: "Not Found users   ", success: false });
    }

    if (!logedInUserId.followings.includes(anotherUserId)) {
      logedInUserId.followings.push(anotherUserId);
      anotherUserId.followers.push(logedInUserId);
    } else {
      logedInUserId.followings = logedInUserId.followings.filter(
        (item) => item !== anotherUserId
      );
      anotherUserId.followers = anotherUserId.followers.filter(
        (item) => item !== anotherUserId
      );
    }

    await Promise.all([
      await logedInUserId.save({ validateBeforeSave: true }),
      await anotherUserId.save({ validateBeforeSave: true }),
    ]);

    res.status(200).json({
      user: logedInUserId,
      anotherUserId,
      message: "add followings list you requested id ",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(501).json({ error });
  }
});

export const loaduser = CatchAsyncError(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({
        user: null,
        message: "You`re not Authorized User login to handle ....",
      });
    }
    // console.log("process.env.SECRECT_KEY", process.env.SECRECT_KEY);

    const { id } = await jsonwebtoken.verify(token, process.env.SECRECT_KEY, {
      algorithms: "HS256",
    });
    // console.log(id);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        user: null,
        message: "You`re not Authorized User login to handle this ....",
      });
    } else return res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid token. Please log in again." });
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
});

export const getAllUsers = CatchAsyncError(async (req, res, next) => {
  try {
    const loggedUser = req.user;

    if (loggedUser) {
      const users = await User.find({ _id: { $ne: loggedUser._id } }).sort({
        created: 1,
      });
      // console.log(users);
      return res.status(200).json({ users });
    } else {
      return res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});
