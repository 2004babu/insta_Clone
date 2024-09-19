import {createSlice} from '@reduxjs/toolkit'

const authSlice =createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:{},
        posts:[]
    }
    ,
    reducers:{
        setUser(state,action){
            return{
                ...state,
                user:action.payload
            }
        },
        setUsers(state,action){
            return{
                ...state,
                users:action.payload
            }
        }
    }
})


export const {setUser,setUsers} =authSlice.actions

export default authSlice.reducer;
