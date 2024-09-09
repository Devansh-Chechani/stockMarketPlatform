import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getPostComments,
} from "../controllers/comment.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postId").get(getPostComments)
router.route("/:postId").post(addComment);
router.route("/:commentId").delete(deleteComment)

export default router