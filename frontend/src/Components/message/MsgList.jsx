import React from 'react'
import { useSelector } from 'react-redux'

const MsgList = ({item}) => {

const {user={}}=useSelector(state=>state.auth)

  const isMe=item?.senderId===user?._id
  // console.log(isMe);
  
  return (
    <div className={ `text-white w-full mt-1   px-5 flex justify${!isMe ? '-start ': '-end'}`}>
    <p className='bg-blue-600 w-fit p-2 rounded'>{item?.msg}</p>  
    </div>
  )
}

export default MsgList
