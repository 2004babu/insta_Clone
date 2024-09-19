import express, { json } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dbConnection from "./utils/db.js";
import path from "path";
import cors from "cors";
import http from 'http'

//router
import userRoute from "./Routes/authroute.js";
import uploaderRoute from "./Routes/uploaderRoute.js";
import postsRoute from "./Routes/postRouter.js";
import msgRoute from "./Routes/MessageRoute.js";

// 
const app =express()

dotenv.config({});
dbConnection();
const server =http.createServer(app)
setSocket(server)
import { fileURLToPath } from "url";
import {setSocket} from './utils/socket.js'
import compression from "compression";


app.use(express.json());
app.use(compression())
app.use(cookieParser({ extends: false }));
app.use(cors({ origin: true, credentials: true }));

// Get the __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
// app.use('/uploads/post', express.static(path.join(__dirname, 'uploads/post')));
// app.use('/uploads/reels', express.static(path.join(__dirname, 'uploads/reels')));
// app.use('/uploads/story', express.static(path.join(__dirname, 'uploads/story')));




app.use("/cdn/v2/auth", userRoute);
app.use("/cdn/v2/upload", uploaderRoute);
app.use("/cdn/v2/post", postsRoute);
app.use("/cdn/v2/msg",msgRoute);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`server Runnig in Port : ${PORT}`);
});


