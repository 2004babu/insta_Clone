import jwt from "jsonwebtoken";

const  SetWepToken = async (res, user, status) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.SECRECT_KEY, {
      expiresIn: "1d",
      algorithm:'HS256'
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(status).cookie("token", token, options).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};


export default SetWepToken;