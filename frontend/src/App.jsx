import { useContext, useEffect, useState } from "react";
import { Navigate, redirect, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Whole from "./Components/Whole";
import SocketProvider from "./SocketProvider.jsx";
import axios from "axios";
import { setUser } from "./redux/Slices/authSlice.js";
import { useDispatch } from "react-redux";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import LeftSideNav from "./Components/LeftSideNav.jsx";
import Feed from "./Components/Feed.jsx";
import WholeMsgContain from "./Components/message/WholeMsgContain.jsx";
import Suggestions from "./Components/Suggestions.jsx";
import ContextProvider, { useContextProvider } from "./Context/ContextProvider.jsx";
import ViewMsg from "./Components/message/ViewMsg.jsx";

function App() {

  const {sidebarNavigate ,setSidebarNavigate}=useContextProvider()
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate=useNavigate()
  useEffect(() => {
    try {
      const loadUser = async () => {
        const res = await axios.get(
          `${apiUrl}/auth/loaduser`,
          { withCredentials: true }
        );
        console.log(res);
        if (!res.data.user) {
          
          navigate('/login')
        }
        dispatch(setUser(res.data.user));
        if (res.data?.user?._id) {
          toast.success(` welcome Back! _ ${res.data.user.userName}`, {
            theme: "dark",
            transition: Slide,
            autoClose: 2000,
            position: "bottom-right",
            hideProgressBar: true,
          });
        }
      };

      loadUser();
    } catch (error) {
      console.log(error);
      if(error.response.status===401){
        console.log(error);
        
      }
    }


  }, []);

  // useEffect(()=>{



  // },[])

  return (
    <>
      
        <ToastContainer />
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Whole />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route
              path="/viewmsg"
              element={
                <div className=" overflow-hidden w-screen h-screen bg-black grid grid-cols-5 ">
                  <LeftSideNav
                  sidebarNavigate={sidebarNavigate}
                  setSidebarNavigate={setSidebarNavigate}
                  />
                <ViewMsg/>
                  <Suggestions />
                </div>
              }
            />
          </Routes>
        </SocketProvider>
     
    </>
  );
}

export default App;
