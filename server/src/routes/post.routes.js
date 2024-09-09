import { Router } from "express";
import { 
    publishAPost,
    getPostById,
    deletePost,
    getAllPosts
} from "../controllers/post.controller.js";

import {
    togglePostLike,
    getLikedPosts
} from "../controllers/like.controller.js"

import {
    addComment,
    deleteComment,
    getPostComments,
} from "../controllers/comment.controller.js"

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
 router.use(verifyJWT);

 router.route("/publish").post(publishAPost);
 router.route("/").get(getAllPosts);
 router.route("/:postId").get(getPostById)
router.route("/:postId").delete(deletePost) 

//comment
router.route("/:postId").get(getPostComments)

router.route("/:postId/comments").post(addComment);
router.route("/:postId/comments/:commentId").delete(deleteComment)

// like
router.route("/:postId/like").post(togglePostLike);
router.route("/posts").get(getLikedPosts);


export default router