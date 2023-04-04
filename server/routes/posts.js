import express from "express";
import { getPost, getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost,commentPost } from "../Controllers/post.js";
import auth from "../middleware/auth.js"
const router = express.Router()


router.get("/search",getPostsBySearch);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.patch("/:id/likePost", auth, likePost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/commentPost", commentPost);



export default router