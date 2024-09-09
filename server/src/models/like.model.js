import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post being liked
      
    },

    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
    },

    dislikedBy: {
        type: Schema.Types.ObjectId,
        ref: "User", 
       
    }

  },

  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Like = mongoose.model("Like", likeSchema);
