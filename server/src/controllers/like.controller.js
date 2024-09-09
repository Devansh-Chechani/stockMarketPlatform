import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Post} from "../models/post.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;


  if(!isValidObjectId(postId)){
     throw new ApiError(401,"Invalid videoId")
  }

  const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    await Like.findOneAndDelete({ post: postId, dislikedBy: req.user._id });

  const existingLike = await Like.findOne({ post: postId ,likedBy:req.user?._id});
  //console.log(existingLike)
  

if (existingLike) {
       await Like.findByIdAndDelete(existingLike?._id);
        return res.status(200).json(new ApiResponse(200, {isLiked:false}, "toggle the post like "));
    }
 else {
        const newLike = await Like.create({
            post: postId, 
            likedBy: req.user._id
        });
    return res.status(201).json(new ApiResponse(201, newLike, "Liked the video"));
}

})


// // Dislike or Remove Dislike on a Post
// const togglePostDislike = asyncHandler(async (req, res) => {
//     const { postId } = req.params;
//     const userId = req.user._id;

 
//     const post = await Post.findById(postId);
//     if (!post) {
//         throw new ApiError(404, "Post not found");
//     }

   
//     await Like.findOneAndDelete({ post: postId, likedBy: userId });

   
//     const existingDislike = await Like.findOne({ post: postId, dislikedBy: userId });
    
//     if (existingDislike) {
       
//         await Like.findOneAndDelete({ post: postId, dislikedBy: userId });
//         return res.status(200).json(
//             new ApiResponse(200, {}, "Post undisliked successfully")
//         );
//     }

   
//     await Like.create({ post: postId, dislikedBy: userId });

//     return res.status(200).json(
//         new ApiResponse(200, {}, "Post disliked successfully")
//     );
// });



const getLikedPosts = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
  const likedPostsAggegate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
       
        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                        },
                    },
                    {
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                    },
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedPostsAggegate,
                "liked posts fetched successfully"
            )
        );
})

export {
    togglePostLike,
    //togglePostDislike,
    getLikedPosts
}