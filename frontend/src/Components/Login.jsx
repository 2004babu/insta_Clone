import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/Slices/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;


  const changeHandeler = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const submitHandeler = async (e) => {
    e.preventDefault();
if (!userInfo.email|| !userInfo.email) {
  return
}
    try {
      const res = await axios.post(
          `${apiUrl}/auth/login`,
        userInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res?.data?.user);
      navigate("/");
      dispatch(setUser(res?.data?.user));
      setUserInfo({ email: "", password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <form
        className="flex flex-col justify-center rounded gap-3 items-center bg-gray-200 p-4 border-3 border-black text-center "
        onSubmit={submitHandeler}
      >
        <h1 className="text-center font-bold">LOGIN</h1>
        <div className=" w-fit flex flex-col justify-center gap-3 items-center mt-3 p-2 ">
          <label htmlFor="email" className="w-full text-start">
            {" "}
            Email
          </label>
          <input
            value={userInfo.email}
            onChange={changeHandeler}
            type="text"
            name="email"
            id="email"
            className="mt2 p-2 w-fit outline-none rounded"
          />
        </div>
        <div className=" w-fit flex flex-col justify-center gap-3 items-center  p-2  ">
          <label htmlFor="password" className="w-full text-start">
            {" "}
            password
          </label>
          <input
            value={userInfo.password}
            onChange={changeHandeler}
            type="text"
            name="password"
            id="password"
            className="mt2 p-2 outline-none rounded"
          />
        </div>

        <div className="flex flex-col justify-center items-center w-full ">
          <button className="bg-blue-500 rounded  px-3 py-2 w-fit ">
            {" "}
            submit{" "}
          </button>
          <Link
            to={"/register"}
            className="w-full font-semibold text-xs text-end mt-2 text-blue-900 underline "
          >
            Have Alread Account ?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
