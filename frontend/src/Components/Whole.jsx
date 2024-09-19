import React, { useState } from 'react'
import LeftSideNav from './LeftSideNav'
import Feed from './Feed'
import Suggestions from './Suggestions'
import WholeMsgContain from './message/WholeMsgContain'
import { useLocation } from 'react-router-dom'
import { useContextProvider } from '../Context/ContextProvider'

const Whole = () => {

  const {sidebarNavigate ,setSidebarNavigate}=useContextProvider()
  // useEffect(()=>{



  // },[])
  const location =useLocation();
console.log(sidebarNavigate);

  return (
    <div className=" overflow-hidden w-screen h-screen bg-white grid grid-cols-5 ">
              <LeftSideNav sidebarNavigate={sidebarNavigate} setSidebarNavigate={setSidebarNavigate} />

            {sidebarNavigate ==='message' ? <WholeMsgContain/>:<Feed/>}
              

              <Suggestions />
            </div>
  )
}

export default Whole
