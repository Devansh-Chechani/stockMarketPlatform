import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
   
    getUserProfile, 
    updateUserProfile
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/auth/register").post(
    upload.single("avatar"),
     registerUser
)

router.route("/auth/login").post(loginUser)

//secured routes
router.route("/profile/:userId").get(verifyJWT , getUserProfile)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/profile").put(upload.single("avatar"),verifyJWT, updateUserProfile)
//router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)


export default router