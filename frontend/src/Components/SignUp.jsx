import axios from "axios";
import React, { useState } from "react";

const Login = () => {

  // const [userName,setUserName]=useState('')
  // const [password,setPassword]=useState('')
  // const [email,setEmail]=useState('')
  // const [avatar,setAvatar]=useState('')
  const apiUrl = import.meta.env.VITE_API_URL;


  const [userInfo,setUserInfo]=useState({
    userName:"",
    email:"",
    password:"",
    image:""
  })

  const changeHandeler= async(e)=>{

    if (e.target.name==='image') {
      
      setUserInfo({...userInfo,[e.target.name]:e.target.files[0]})
    }else{
      setUserInfo({...userInfo,[e.target.name]:e.target.value})
    }


  } 
  const submitHandler =async (e)=>{

    e.preventDefault()
    const formData =new FormData()

    formData.append('userName',userInfo.userName)
    formData.append('email',userInfo.email)
    formData.append('password',userInfo.password)
    formData.append('image',userInfo.image)


    try {
     const res = await axios.post(`${apiUrl}/auth/register`,formData,{headers:{
        'Content-Type':"multipart/from-data"
      },withCredentials:true});
console.log(res);
    } catch (error) {
      console.log(error);
    }


  }
  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center">
      <form onSubmit={submitHandler} className="flex flex-col bg-gray-200  p-6 justify-center items-center  border-black border-2 rounded">
        <h3 className="text-center font-semibold">REGISTER</h3>
        <div className="flex flex-col justify-center items-center p-2">
            <label htmlFor="userName  " className="w-full text-start mb-3 font-semibold"> userName</label>
          <input
            type="text"
            name="userName"
            id="userName"
            className="mt2 p-2 "
            value={userInfo?.userName}
            onChange={changeHandeler}
          />
        </div>
        <div className="flex flex-col justify-center items-center p-2">
            <label htmlFor="email  " className="w-full text-start  font-semibold"> Email</label>
          <input
            type="text"
            name="email"
            id="email"
            className="mt2 p-2 "value={userInfo.email}
            onChange={changeHandeler}
          />
        </div>
        <div className="flex flex-col justify-center items-center p-2 ">
        <label htmlFor="password" className="w-full text-start font-semibold"> password</label>
          <input
            type="text"
            name="password"
            id="password"
            className="mt2 p-2 "        value={userInfo.password}
                onChange={changeHandeler}
          />
        </div>
        <div className="flex flex-col justify-center items-center p-2 ">
        <label htmlFor="image" className="w-full text-start text-base font-semibold mb-1"> image</label>
          <input
            type="file"
            accept="image"
            name="image"
            id="image"
            className="p-2"
            hidden={true}
            onChange={changeHandeler}
          />
        <button type="button" className="bg-blue-500 py-2 px-4 rounded"><label htmlFor="image" className="w-full text-start text-xs"> image select From Cpmputer</label></button>
        </div>
       <button className="bg-green-500 py-2 px-4 rounded " > submit</button>
      </form>
      
    </div>
  );
};

export default Login;
