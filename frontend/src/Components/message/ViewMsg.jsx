import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import MsgList from "./MsgList";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import {
  setAllMessages,
  setSingleUserMsg,
} from "../../redux/Slices/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useContextSocket } from "../../SocketProvider";

const ViewMsg = () => {
  const msglist = document.getElementById("msglist");
  const location = useLocation();
  const [refresh,setRefresh]=useState(false)
  const user = location?.state.user;
  const scrolDIV = useRef();
  const inputRef = useRef();
  const [msgInput, setMsgInput] = useState("");
  const dispatch = useDispatch();
  const { AllMessages = [], singleUserMsg = {} } = useSelector(
    (state) => state.message
  );

  const { socket } = useContextSocket();


  

  const autoScroll = async () => {
    if (scrolDIV?.current) {
      scrolDIV.current.scrollTo(0, scrolDIV.current.scrollHeight);
    }
  };


  const sendNodification = async (msg) => {
    

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        // alert("notification Not Garnted");
        return;
      }
    }
   const notification= new Notification(msg,{
      body:"hey",
      tag:"22"
    });
    
    return notification;
  };
  // document.addEventListener("visibilitychange", (e) => {
  //  let notify
  //   if(document.visibilityState==='hidden'){

  //     notify= sendNodification('hii bro')
  //   }else{
  //     setRefresh(!refresh)
  //     if (notify) {
  //       notify.close()
  //     }
  //   }

  // });


  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('fetchSingleMsg');

    
    try {
      const fetchSingleMsg = async () => {
        const res = await axios.get(`${apiUrl}/msg/get/${user?._id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(res.data.Conversation);

        if (res?.data?.Conversation)
          dispatch(setSingleUserMsg(res?.data?.Conversation));
        console.log(
          AllMessages.some(
            (message) => message._id === res?.data?.Conversation?._id
          ),
          AllMessages.length > 0,
          res?.data?.Conversation?._id
        );
        // console.log();

        if (
          AllMessages.some(
            (message) => message._id === res?.data?.Conversation?._id
          )
        ) {
          console.log(AllMessages);
        } else {
          let current_data = [];
          current_data.push(...AllMessages, res?.data?.Conversation);
          dispatch(setAllMessages(current_data));
        }
      };

      fetchSingleMsg();
     
    } catch (error) {
      console.log(error);
      dispatch(setSingleUserMsg(null));
    }
  }, []);

 useEffect(()=>{
  autoScroll()
 },[singleUserMsg])
  const handleSendMsg = async (e, id) => {
    e.preventDefault();
    try {
      console.log(id);
      if (!msgInput) {
        throw Error("Enter Any msg!");
      }

      const res = await axios.post(
        `${apiUrl}/msg/send/${id}`,
        { msg: msgInput },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res);

      if (true) {
        if (!socket) {
          console.log(socket);
          toast.success(` socket not Connet refresh Pls`, {
            theme: "dark",
            transition: Slide,
            autoClose: 2000,
            position: "bottom-right",
            hideProgressBar: true,
          });
          return;
        }
        console.log("enterd");

        socket?.emit("sendMessage", { user, msgInput });

        msglist.innerHTML += ` <div class='text-white w-full mt-1   px-5 flex justify-end'>
                <p class='bg-blue-600 w-fit p-2 rounded'>${msgInput}</p>  
                </div>`;
        autoScroll();
        setMsgInput("");
        if (inputRef?.current) {
          inputRef.current.focus()
        }
        return () => {
          socket.close("sendMessage", { user, msgInput });
        };
      }
    } catch (error) {
      console.log(error);
      toast(error.message, {
        type: "warning",
        theme: "dark",
        transition: Slide,
        autoClose: 2000,
        position: "bottom-right",
        hideProgressBar: true,
      });
    }
  };

  const receiveSocketHandler = (e) => {
    msglist.innerHTML += ` <div class='text-white w-full mt-1   px-5 flex justify-start'>
    <p class='bg-blue-600 w-fit p-2 rounded'>${e.toString()}</p>  
    </div>`;
    autoScroll();
    sendNodification(e.toString());
   
    console.log(e);
  };

  

  useEffect(() => {
    if (socket) {
      socket.on("receiveMsg", receiveSocketHandler);


      return () => socket.close("receiveMsg", receiveSocketHandler);
    }
  }, [socket]);

  return (
    <>
      <div className="static overflow-hidden  w-full h-full bg-black z-10 col-span-3 flex flex-col justify-between items-between gap-2">
        <div className="text-white w-full text-left p-3 pl-7  flex gap-4 text-sm border-b-2 border-sky-600">
          <div className="msgimgContainer bg-black w-fit h-fit col-span-3">
            <img
              className="h-24 object-contain rounded-full img "
              src={user?.profilePic}
            />
          </div>
          <div className="text-white h-full pt-3 flex flex-col gap-3 ">
            <p className="text-white">{user?.userName}</p>
          </div>
        </div>

        <div
          id="msglist"
          ref={scrolDIV}
          className="overflow-y-scroll hide-scrollbar  w-full h-full bg-black z-10  flex  flex-col   "
        >

          {singleUserMsg?.messages?.length > 0 &&
            singleUserMsg?.messages?.map((value) => <MsgList key={value._id} item={value} />)}
        </div>

        <form
          onSubmit={(e) => handleSendMsg(e, user?._id)}
          className="bg-white relative bottom-0 left-0 flex gap-5 flex-row justify-between items-center p-2"
        >
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="text-gray outline-none  w-full  rounded-sm "
            name="msg"
            id="msg"
            onChange={(e) => setMsgInput(e.target.value)}
            value={msgInput}
          />
          <button
            className="bg-sky-500 hover:bg-sky-700 px-4 py-2 rounded-lg"
            type="submit"
          >
            send
          </button>
        </form>
      </div>
    </>
  );
};

export default ViewMsg;
