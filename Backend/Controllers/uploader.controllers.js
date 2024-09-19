import sharp from "sharp";
import CatchAsyncError from "../MiddleWare/CatchAsyncError.cjs";
import { PostModel } from "../models/Post.model.js";
import path from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import tmp from "tmp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

export const postUploader = CatchAsyncError(async (req, res) => {
  console.log(req?.file, "req?.file");

  const { captions, content } = req.body;
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(300)
        .json({success:false, message: "your Not Authendicated User .." });
    }
    if (!req.file) {
      return res.status(300).json({success:false, message: "file not received .." });
    }

    console.log(req.file.buffer);

    const outputFilePath = path.join(
      __dirname,
      `../uploads/${req.file.fieldname}/${req.file.originalname}`
    );

    await sharp(req.file.buffer)
      .resize(800, 800, { fit: sharp.fit.inside, withoutEnlargement: true })
      .jpeg({ quality: 100 })
      .toFile(outputFilePath);

    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.fieldname
    }/${req.file.originalname}`;

    console.log(imageURL);

    ///cloudinary functions Add for store Photos And Videos

    const post = await PostModel.create({
      OwnerId: req.user?._id,
      images: imageURL,
      captions,
      content,
    });

    if (!post) {
      return res.status(500).json({success:false, message: "error In create post  .." });
    }

    res.status(200).json({ success: true, message: "Got It ", imageURL, post });
  } catch (error) {
    console.log(error);
  }
});

export const reelsUploader = CatchAsyncError(async (req, res, next) => {
  console.log(req?.file, "req?.file");

  const { captions, content } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success:false, message: "You are not authenticated." });
    }
    if (!req.file) {
      return res.status(400).json({ success:false, message: "File not received." });
    }

    const safeFilename = req.file.originalname.replace(/[^\w.-]/gi, ""); // Removing spaces as well
    // Create a temporary file with a safe file name
    const tempFilePath = tmp.tmpNameSync({
      postfix: path.extname(safeFilename),
    });

    console.log(tempFilePath);
    
    // Write the buffer to the temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Define the output directory and file path

    const outputDir = path.join(__dirname, "../uploads", "reels");
    const outputFilePath = path.join(outputDir, safeFilename);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(outputFilePath);

    // Second pass
    ffmpeg(tempFilePath)
      .outputOptions([
        "-crf 23",
        "-c:v libx264",
        "-b:v 1000k",
        "-preset slow",
        "-c:a aac",
        "-b:a 192k",
      ])
      .audioFilters("aformat=sample_rates=44100")
      .on("end",async () => {
        console.log("Processing finished successfully");

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

       

        const BASE_URL = `${req.protocol}://${req.get(
          "host"
        )}/uploads/reels/${safeFilename}`;
        console.log(BASE_URL);

        const post =await PostModel.create({images:BASE_URL,content,OwnerId:req.user._id,captions});

        console.log(post);
        if (!post) {
          
          res.status(500).json({ success:false,message:"Reels uploading re-upload please!"});
        }

        res.status(200).json({ success:true,reelsURL: BASE_URL ,post});
      })
      .on("error", (err) => {
        console.error("Error processing video: ", err.message);
        res.status(500).json({ success:false,message: "Error processing video." });

        // Clean up the temporary file in case of error
        fs.unlinkSync(tempFilePath);
      })
      .save(outputFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "An unexpected error occurred." });
  }
});
