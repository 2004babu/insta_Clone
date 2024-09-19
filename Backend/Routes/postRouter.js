import express from 'express'
import {isAuthendicated} from '../MiddleWare/isAuthendicated.js'
import { getPosts } from '../Controllers/post.controller.js'


const router =express.Router()

router.get('/getallpost',isAuthendicated,getPosts)

export default router;
