import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import authRouter from "./routes/auth.routes.js"
import userRouter from './routes/user.routes.js'
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"


//routes declaration
app.use("/api/auth", authRouter)
app.use("/api/user/profile", userRouter)
app.use("/api/posts", postRouter)
//app.use("/api/comments", commentRouter)
//app.use("/api/likes", likeRouter)


// http://localhost:8000/api/v1/users/register

export { app }