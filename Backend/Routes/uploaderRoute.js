import express from 'express'
import multer from 'multer'

import path from 'path'

import { isAuthendicated } from '../MiddleWare/isAuthendicated.js'
import { postUploader, reelsUploader } from '../Controllers/uploader.controllers.js'
import { fileURLToPath } from 'url'

//mutler

const __filename =fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);

const storage =multer.memoryStorage();
const filer =multer({storage:storage})


const router =express.Router()

router.post('/post',isAuthendicated,filer.single('post'),postUploader)
router.post('/reels',isAuthendicated,filer.single('reels'),reelsUploader)


export default router