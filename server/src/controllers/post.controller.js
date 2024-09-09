import mongoose, {isValidObjectId} from "mongoose"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const publishAPost = asyncHandler(async (req, res) => {
    const { stockSymbol, title, description, tags } = req.body;

    
    if (!stockSymbol || !title || !description) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Create the post
    const createdPost = await Post.create({
        stockSymbol,
        title,
        description,
        tags: tags || [], 
        isPublished: true, 
        owner: req.user._id 
    });


 return res.status(201).json(
        new ApiResponse(200, createdPost._id, "Post Created Successfully")
    )
})


const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    // let userId = req.body;
    
    // userId = new mongoose.Types.ObjectId(userId)
    if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "Invalid userId");
    }

    const post = await Post.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [           
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                           
                        }
                    }
                ]
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
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                comments: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1
            }
        }
    ]);

    if (!post) {
        throw new ApiError(500, "failed to fetch the post");
    }

    // increment views if video fetched successfully
    await Post.findByIdAndUpdate(postId, {
        $inc: {
            views: 1
        }
    });

    
    return res
        .status(200)
        .json(
            new ApiResponse(200, post[0], "Post details fetched successfully")
        );
});



const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
   

     if (!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid postId");
    }

     const post =  await Post.findById(postId)
     if(!post){
        throw new ApiError(404,"Post not found")
     }
  
    if(req.user._id.toString() !== post.owner.toString()){
        throw new ApiError(400,"Only the owner of thepostcan delete the post")
    }

      await Post.findByIdAndDelete(postId)
      await Like.deleteMany({ post: postId });

        return res.status(201).json(
            new ApiResponse(201,{},"Post deleted Successfully")    
        )
})

const getAllPosts = asyncHandler(async (req, res) => {
    const { stockSymbol, tags, sortBy, sortOrder = 'desc', page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    let matchConditions = {};
    let sortOptions = {};

   
    const validSortOrders = ['asc', 'desc'];
    const order = validSortOrders.includes(sortOrder) ? (sortOrder === 'asc' ? 1 : -1) : -1; // Default to descending

    // Filtering by stockSymbol
    if (stockSymbol) {
        matchConditions.stockSymbol = stockSymbol;
    }

    
    if (tags) {
        matchConditions.tags = { $in: tags.split(',') };
    }

   
    if (sortBy === 'date') {
        sortOptions = { createdAt: order };
    } else if (sortBy === 'likes') {
        sortOptions = { likesCount: order };
    }

    try {
       
        const pipeline = [
            {
                $match: matchConditions
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' }
                }
            },
            ...(Object.keys(sortOptions).length > 0 ? [{ $sort: sortOptions }] : []), // Conditionally include $sort
            {
                $project: {
                    _id: 1,
                    stockSymbol: 1,
                    title: 1,
                    description: 1,
                    likesCount: 1,
                    createdAt: 1
                }
            },
            {
                $skip: (pageNum - 1) * limitNum // Skip posts based on the current page and limit
            },
            {
                $limit: limitNum // Limit the number of posts per page
            }
        ];

       
        const posts = await Post.aggregate(pipeline);

       
        const totalPosts = await Post.countDocuments(matchConditions);

        const totalPages = Math.ceil(totalPosts / limitNum);

        // Create pagination metadata
        const pagination = {
            currentPage: pageNum,
            totalPages,
            limit: limitNum,
            totalPosts
        };

        return res.status(200).json(new ApiResponse(200, { posts, pagination }, 'Posts fetched successfully'));
    } catch (error) {
        console.error('Aggregation Error:', error);
        throw new ApiError(500, 'Failed to fetch posts');
    }
});

export {
    
    publishAPost,
    getPostById ,
    deletePost,
    getAllPosts
   
}

