import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
  {
    stockSymbol: {
      type: String, 
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    tags: {
      type: [String], // Array of optional tags
      default: []
    },

    views: {
      type: Number,
      default: 0
    },

    isPublished: {
      type: Boolean,
      default: true
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the post
        
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Add pagination functionality
postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model("Post", postSchema);
