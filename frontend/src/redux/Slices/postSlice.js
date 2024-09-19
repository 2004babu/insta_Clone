import {createSlice} from '@reduxjs/toolkit'


const postSlice =createSlice({
    name:'post',
    initialState:{
        posts:[],
        post:{},
        Error:null,
        success:null,

    }
    ,reducers:{
        setPosts(state,action){
                return {
                    ...state,
                    posts:action.payload
                }
        },
        
    }
})


export const {setPosts}= postSlice.actions;
export default postSlice.reducer;


