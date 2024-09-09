import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Like} from "../models/like.model.js"
import {Post} from "../models/post.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getPostComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {postId} = req.params
    const {page = 1, limit = 10} = req.query

   const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullName: 1,
                    avatar: 1
                },
                isLiked: 1
            }
        }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    );


    res.status(200).json(
        new ApiResponse(201,comments,"Comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {postId} = req.params
    const {content} = req.body

    if(!isValidObjectId(postId)){
        throw new ApiError(401,"Invalid postId")
    }

    if(!content){
        throw new ApiError(401,"Comment can't be empty")
    }

    const comment = await Comment.create({
       content,
       post:postId,
       owner:req.user._id
    })

    if(!comment){
           throw new ApiError(401,"Comment not created!")
    }

    return res.status(200).json(
        new ApiResponse(201,comment,"Comment created")
    )
})


const deleteComment = asyncHandler(async (req, res) => {
    
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Invalid postId")
    }

     const comment = await Comment.findById(commentId);

    if (!comment) {
       throw new ApiError(404,"Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized request, users can delete comments made by them only");
    }
   
    await Like.deleteMany({ comment: commentId });
    await Comment.findByIdAndDelete(commentId);
    


    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
})

export {
    getPostComments, 
    addComment, 
     deleteComment
    }
