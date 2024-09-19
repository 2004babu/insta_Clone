import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/Slices/authSlice";
import CreateTap from "./CreateTap";
const LeftSideNav = ({sidebarNavigate,setSidebarNavigate}) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createtaped, setcreatetaped] = useState(false);
  const dispatch = useDispatch();
  console.log(sidebarNavigate);

  const sideBar = [
    {
      icon: "fa-solid fa-house",
      value: "Home",
    },
    {
      icon: "fa-brands fa-searchengin",
      value: "Search",
    },
    {
      icon: "fa-solid fa-compass",
      value: "Explore",
    },
    {
      icon: "fa-solid fa-play",
      value: "Reels",
    },
    {
      icon: "fa-solid fa-message",
      value: "Message",
    },
    {
      icon: "fa-regular fa-heart",
      value: "Notifications",
    },
    {
      icon: "fa-regular fa-square-plus",
      value: "Create",
    },
  ];

  const handleClick = (name) => {
    switch (name) {
      case "logout":
        if (user?._id) {
          logoutHandler();
        }
        break;
      case "Create":
        setcreatetaped(!createtaped);
        break;
      case "Message":
        setSidebarNavigate('message');
        break;
      case "Home":
        navigate('/')
        setSidebarNavigate('')
        break;
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${apiUrl}/auth/logout`, {
        withCredentials: true,
      });
      console.log(res);
      dispatch(setUser());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="h-full bg-blue-400  flex  flex-col justify-start items-start p-3 py-6">
        <h1>LOGO</h1>
        <div className="flex flex-col p-2 gap-5 justify-start items-start mt-6">
          {sideBar.map((item, index) => (
            <div
              onClick={() => handleClick(item.value)}
              key={index}
              className="flex pl-1 flex-row justify-between items-center cursor-pointer"
            >
              <i className={`${item.icon}`}></i>
              <span className="pl-4">{item.value}</span>
            </div>
          ))}
          <div
            onClick={() => handleClick("Profile")}
            className="flex  flex-row justify-between items-center cursor-pointer"
          >
            <img
              src={`${
                user?.profilePic
                  ? user?.profilePic
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcyI9Cvp53aaP9XeRn-ZKbJDH2QaWC72O26A&s"
              }`}
              className="rounded-full objet-fit w-7 h-7 border-2 m-0 p-0"
            ></img>
            <span className="pl-2">Profile</span>
          </div>
          <div
            onClick={
              user?._id ? () => handleClick("logout") : () => navigate("/login")
            }
            className="flex pl-1 mt-20 flex-row justify-between items-center cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="pl-2">{user?._id ? "logout" : "login"}</span>
          </div>
        </div>
      </div>
      {createtaped ? <CreateTap setcreatetaped={setcreatetaped} /> : null}
    </>
  );
};

export default LeftSideNav;
