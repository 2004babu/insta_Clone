import React, { useEffect } from "react";
import MsgList from "./MsgList";
import axios from "axios";
import { setUsers } from "../../redux/Slices/authSlice";
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'



const WholeMsgContain = () => {
    const navigate=useNavigate()
    const dispatch =useDispatch()
    const {users}=useSelector(state=>state?.auth);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const FetchData = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/auth/getallusers`,
          { withCredentials: true }
        );

        console.log(res?.data?.users);
        dispatch(setUsers(res?.data?.users))
      } catch (error) {
        console.log(error);
      }
    };

    FetchData();
  }, []);


  const handelOpenMsg =(user)=>{
    console.log('open',user);
    navigate('/viewmsg',{state:{user}})
    
  }
  return (
    <div className="overflow-y-scroll  hide-scrollbar w-full h-full bg-black z-10 col-span-3 flex flex-col justify-start items-center gap-3">
      <div className="text-white w-full text-left p-3 ml-4 font-bold text-xl">
        Message
      </div>
      {users &&
        users?.map((value) => (
          <div key={value._id} onClick={()=>handelOpenMsg(value)} className=" p-2 border-t-2 border-slate-800 text-white w-full flex bg-black  justify-start gap-4 items-center">
            <div className="msgimgContainer bg-black w-fit">
              <img
                className="object-contain rounded-full img "
                src={value?.profilePic ? value?.profilePic : 'http://localhost:8080/uploads/images/IMG_20240506_09300564.jpg'}
              />
            </div>
            <div className="text-white h-full pt-3 flex flex-col gap-3 ">
              <p className="text-white">{value?.userName}</p>
              <h5>msg</h5>
            </div>
          </div>
        ))}
    </div>
  );
};

export default WholeMsgContain;
