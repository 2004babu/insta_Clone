import React, { useEffect, useRef, useState } from "react";
import StoryLineUp from "./Story/StoryLineUp";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/Slices/postSlice";

const Feed = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const [muteAll,setMuteAll]=useState(true)
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/post/getallpost`,
          { withCredentials: true }
        );
        dispatch(setPosts(res?.data?.posts))
        console.log(res?.data?.posts);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (user?._id) {
      fetchPost()
    }

    return ()=> fetchPost();
    
  }, [user]);
// console.log(muteAll);

  return (
    <div className="overflow-y-scroll  hide-scrollbar w-full h-full bg-black z-10 col-span-3 flex flex-col justify-start items-center gap-3">
      <StoryLineUp />

      {
        posts?.length >0 ? posts.map(item=><Post key={item._id} post={item} muteAll={muteAll} setMuteAll={setMuteAll}/>):<p className="text-white">rondom Posts Show Pls </p>
      }
    </div>
  );
};

export default Feed;
