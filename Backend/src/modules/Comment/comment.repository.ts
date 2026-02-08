import mongoose from "mongoose";
import { CommentDoc } from "./comment.types";

const commentSchema = new mongoose.Schema<CommentDoc>(
  {
    text: { type: String, required: true },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const commentModel = mongoose.model("Comment", commentSchema)

export const commentRepository = {

  createComment(data: { cardId: string, authorId: string, text: string }) {
    return commentModel.create(data)
  },

  getCommentsByCardId(cardId: string) {
    return commentModel.find({ cardId })
  },

  updateComment(data: { _id: string, text: string }) {
    return commentModel.findByIdAndUpdate({ _id: data._id }, { $set: { text: data.text } }, { new: true })
  },

  deleteComment(_id: string) {
    return commentModel.deleteOne({ _id })
  },

  getCommentById(_id: string) {
    return commentModel.findById({ _id })
  }
}
