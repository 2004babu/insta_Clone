import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Post = ({ post, muteAll, setMuteAll }) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleVideo = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuteAll((prev) => !prev);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", (e) => {
      setMuteAll(true);
    });
  }, []);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleFollow = async (id) => {
    console.log("follow");

    try {
      const res =await axios.post(`${apiUrl}/auth/follow/${id}`,{},{withCredentials:true});
      console.log(res);

    } catch (error) {
      console.log(error);

    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlayVideo = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Attempt to play video when it is in view
          // Ensure video is muted
          if (!muteAll) {
            videoElement.muted = muteAll;
            console.log("play muted", muteAll);
          }
          videoElement
            .play()
            .catch((err) => console.log("Playback error:", err));
        } else {
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handlePlayVideo, {
      threshold: 0.5, // Adjust as needed
    });

    if (videoElement) {
      observer.observe(videoElement);
    }

    
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [muteAll]);

  return (
    <div className="px-6 mt-5 w-fit h-fit bg-black flex flex-col justify-center items-center">
      <div className="flex w-full px-8 py-2 justify-start">
        <img
          src={post?.OwnerId?.profilePic}
          className="rounded-full h-10 w-10 object-cover border-2 border-gray-800"
          alt="Profile"
        />
        <div className="flex">
          {" "}
          <p className="text-white pl-3 ">{post?.OwnerId?.userName}</p>
         {!(user?._id ===post?.OwnerId?._id) ? <p
            className=" cursor-pointer ml-2 text-blue-600 text-sm"
            onClick={() => handleFollow(post?.OwnerId?._id)}
          >
            follow
          </p>:null}
        </div>
      </div>
      {post.content === "reels" ? (
        <div className="relative rounded-1 h-70 w-80 border-2 border-gray-800 flex justify-center items-center">
          <video
            onClick={handleVideo}
            ref={videoRef}
            muted={muteAll}
            className="object-cover h-70 w-60"
            src={post.images}
          />
          <button
            onClick={toggleMute}
            className=" text-xs absolute bottom-4 right-10  mt-2 text-white"
          >
            {!muteAll ? (
              <i className="text-xs fa-solid fa-volume-high"></i>
            ) : (
              <i className="fa-solid fa-volume-xmark"></i>
            )}
          </button>
        </div>
      ) : (
        <div className="relative rounded-1 h-70 w-80 border-2 border-gray-800 flex justify-center items-center">
          <img className="object-cover h-70 w-60" src={post.images} />

          {/* Future may I Add Music For posts  */}
          {/* <button onClick={toggleMute} className=" text-xs absolute bottom-4 right-10  mt-2 text-white">
     {!isMuted?  <i className="text-xs fa-solid fa-volume-high"></i> : <i className="fa-solid fa-volume-xmark"></i>}
      </button> */}
        </div>
      )}
      <div className="mt-3 flex justify-between w-full px-8 text-white">
        <div className="gap-2 flex">
          <i className="fa-regular fa-heart"></i>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
        </div>
        <i className="fa-regular fa-bookmark"></i>
      </div>
      <p className="font-semibold mt-1 text-sm w-full flex px-8 justify-start text-white">
        {post?.captions}
      </p>
      <p className="font-small hover:text-gray-900 mt-1 text-sm w-full flex px-8 justify-start text-white">
        view Comments...
      </p>
    </div>
  );
};

export default Post;
