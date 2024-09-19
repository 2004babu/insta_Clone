import {combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import postSlice from './Slices/postSlice'
import messageSlice from './Slices/messageSlice'
import { thunk } from 'redux-thunk'


const reducres =combineReducers({
    auth :authSlice,
    post:postSlice,
    message:messageSlice,
})

export const  store =configureStore({
    reducer:reducres,
    middleware:(middleware)=>middleware(thunk)
})

