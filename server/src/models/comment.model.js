import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
     content: {
      type: String,
      required: true
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Reference to the stock post being commented on
     
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // User who made the comment
     
    }
  },
  {
    timestamps: true 
  }
);

// Add pagination functionality
commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
