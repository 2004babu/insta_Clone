import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const CreateTap = ({ setcreatetaped }) => {
  const [selectUpload, setSElectUpload] = useState('');
  const [file, setFile] = useState(null);
  const [captions, setCaptions] = useState('');
  const fileRef = useRef();
  const liRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSelectuploads = async (e, event) => {
  await Promise.resolve( setSElectUpload(event));
  console.log(event);
  




    e.stopPropagation();

    if (file&&selectUpload) {
      const formdata = new FormData();
      formdata.append(`${selectUpload}`, file);
      formdata.append(`content`, selectUpload);
      formdata.append(`captions`, captions);
      
       // Correctly append the file
       console.log(file.type);
       console.log(formdata);

      try {
        const res = await axios.post(
          `${apiUrl}/upload/${selectUpload}`,
          formdata,{
            headers:{
              'Content-Type':'multipart/form-data'
            },withCredentials:true
          }
        );
        console.log(res);
        if (res.data.success) {
          setcreatetaped(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []); 
  
  // Added dependency array
console.log(file);

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    // accept: "image/*,video/*",
    multiple: false,
  });

  return (
    <div
      onClick={() => setcreatetaped(false)}
      className="z-40 flex justify-center absolute items-center h-full w-full"
    >
      <div
        
        onClick={(e) => e.stopPropagation()}
        className="hover:border-2 box-content rounded p-2 border-red-900 bg-gray-700 flex flex-col lg:h-64 lg:w-80 md:w-80 sm:h-48 md:h-64"
      >
        <div className="p-2 flex flex-col h-80 justify-between items-center w-full">
          <div {...getRootProps()} className="border-2 border-dashed h-full w-full">
            <input ref={fileRef} {...getInputProps()} hidden />
            <div className="flex flex-col justify-center items-center h-full">
              <button
                onClick={() => fileRef?.current?.click()}
                type="button"
                className="py-2 px-3 bg-blue-400 rounded"
              >
                Select from Computer
              </button>
              <p className="mt-6 text-sm"> {file ? 'One File Selected':""}</p>
            </div>
          </div>

          <input
            type="text"
            name="captions"
            id="captions"
            placeholder="Add Captions...! "
            className="text-white w-full outline-none bg-transparent rounded-4"
            onChange={(e)=>setCaptions(e.target.value)}
            value={captions}
          />
        </div>

        <ul className="box-content flex justify-evenly w-full items-end h-fit bg-blue-500">
          <Link
            ref={liRef}
            onClick={(e) => handleSelectuploads(e, "post")}
            className={`box-content hover:border-b-2 ${
              selectUpload === "post" ? "bg-blue-600" : ""
            } border-gray-900 ease-in duration-100`}
           
          >
            POST
          </Link>
          <Link
            onClick={(e) => handleSelectuploads(e, "reels")}
            className="box-content hover:border-b-2 border-gray-900 ease-in duration-100"
            
          >
            REELS
          </Link>
          <Link
            onClick={(e) => handleSelectuploads(e, "story")}
            className="box-content hover:border-b-2 border-gray-900 ease-in duration-100"
          
          >
            STORY
          </Link>
          <Link
            onClick={(e) => handleSelectuploads(e, "live")}
            className="box-content hover:border-b-2 border-gray-900 ease-in duration-100"
            
          >
            LIVE
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default CreateTap;
