import { createSlice } from "@reduxjs/toolkit";

const MessageSlice=createSlice({
    name:"message",
    initialState:{
        singleUserMsg:{}
        ,AllMessages:[]
    }
    ,reducers:{
        setSingleUserMsg(state,action){
            return{
                ...state,
                singleUserMsg:action.payload

            }
        },
        setAllMessages(state,action){
            return{
                ...state,
                AllMessages:action.payload

            }
        },
    }
})

const {actions,reducer}=MessageSlice;

export const {setAllMessages,setSingleUserMsg}=actions
export default reducer;