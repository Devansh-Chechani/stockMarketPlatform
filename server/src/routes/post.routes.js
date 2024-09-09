import { Router } from "express";
import { 
    publishAPost,
    getPostById,
    deletePost,
    getAllPosts
} from "../controllers/post.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
 router.use(verifyJWT);

 router.route("/publish").post(publishAPost);
 router.route("/").get(getAllPosts);
 router.route("/:postId").get(getPostById)
router.route("/:postId").delete(deletePost) 


export default router