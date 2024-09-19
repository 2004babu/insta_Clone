import CatchAsyncError from "../MiddleWare/CatchAsyncError.cjs";
import { PostModel } from "../models/Post.model.js";

export const getPosts = CatchAsyncError(async (req, res) => {
    const posts = await PostModel.find({}).sort({ createdAt: -1 }).limit(10).populate('OwnerId User');


    if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found.' });
    }

    // console.log(posts);
    

    res.status(200).json({ posts });
});
