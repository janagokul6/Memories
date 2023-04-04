import mongoose from "mongoose";
import postMessage from "../models/postSchema.js"


export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postMessage.findById(id);
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT //to get the starting index of every page
        const total = await postMessage.countDocuments({});

        const posts = await postMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(404).json({ message: error })
    }
}
export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await postMessage.find({ $or: [ { title }, { tags: { $in: tags?.split(',') } } ]});
        res.json({ data: posts })
    } catch (error) {
        res.status(404).json({message: error.message })
    }

}


export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new postMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error, })
    }
}


export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id }
    await postMessage.findByIdAndUpdate(id, updatedPost, { new: true })
    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("no post with this id")

    await postMessage.findByIdAndRemove({ _id: id })
    res.json({ message: "post deleted sucessfully" })
}

export const likePost = async (req, res) => {

    const { id } = req.params;
    if (!req.userId) return res.json({ message: 'Unauthencated' })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)
    const post = await postMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId))
    if (index === -1) {
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await postMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const post = await postMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await postMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost);
}