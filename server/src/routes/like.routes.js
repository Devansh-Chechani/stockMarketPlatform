import { Router } from 'express';
import {
    togglePostLike,
    getLikedPosts
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postId").post(togglePostLike);
router.route("/posts").get(getLikedPosts);

export default router