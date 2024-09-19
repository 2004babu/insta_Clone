import { io } from "socket.io-client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const socketcontext = createContext();
export const useContextSocket = () => {
  return useContext(socketcontext);
};
const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState("");
  const [onlineUsers, setOnlineUsers] = useState("");
  // console.log(user);

  useEffect(() => {
    if (user?._id) {
      const socketInstance = io("ws://localhost:8080", {
        query: { userId: user._id },
      });
      setSocket(socketInstance);

      const handleConnect = () => {
        console.log("Connected with Socket ID:", socketInstance?.id);
      };
      const handleOnlineUsers = (OnlineUsers) => {
        console.log(OnlineUsers);
        setOnlineUsers(OnlineUsers);
      };
      socketInstance.on("connect", handleConnect);
      socketInstance.on("onlineUsers", handleOnlineUsers);

      // console.log(socketInstance);
      return () => {
        socketInstance.off("connect", handleConnect);
        // socketInstance.off("onlineUsers", handleOnlineUsers);
        socketInstance.close();
      };
    }
  }, [user]);
  return (
    <socketcontext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketcontext.Provider>
  );
};

export default SocketProvider;
