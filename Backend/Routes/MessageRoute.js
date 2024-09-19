import express from "express";
import { sendMessage, getAllMessages, getSingleMassage } from "../Controllers/MessageController.js";
import {isAuthendicated} from "../MiddleWare/isAuthendicated.js";

const router = express.Router();

router.post("/send/:id", isAuthendicated, sendMessage);

router.get("/getallmsg/:id", isAuthendicated, getAllMessages);
router.get("/get/:id", isAuthendicated, getSingleMassage);

export default router;
