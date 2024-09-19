import express from 'express'
import { EditProfile, followUnFollow, login, logout, sighUp, loaduser, getAllUsers } from '../Controllers/user.controllers.js'
import {isAuthendicated} from '../MiddleWare/isAuthendicated.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath} from 'url'

const filename=fileURLToPath(import.meta.url)

const __dirname =path.dirname(filename)



const router = express.Router();


const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, path.join(__dirname, '.././uploads/images'));
        } else if (file.mimetype.startsWith('video')) {
            cb(null, path.join(__dirname, './uploads/videos'));
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploads = multer({ storage: Storage });



router.post('/login', login);
router.get('/loaduser', loaduser);
router.post('/register', uploads.single('image'), sighUp);
router.get('/logout', isAuthendicated, logout);
router.post('/editprofile', isAuthendicated, uploads.single('image'), EditProfile);
router.post('/follow/:id', isAuthendicated, followUnFollow);

router.get('/getallusers',isAuthendicated,getAllUsers)


export default router;
