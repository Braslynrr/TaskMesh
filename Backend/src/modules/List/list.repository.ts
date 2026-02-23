import mongoose, { Types } from "mongoose";
import { cardModel } from "../Card/card.repository";
import { commentModel } from "../Comment/comment.repository";

const ListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    taskboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Taskboard",
      required: true,
    },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

ListSchema.pre("deleteOne", { document: true }, async function () {
  const list = this

  const cards = await cardModel.find({ listId: list._id }).select("_id")

  const cardIds = cards.map(c => c._id)

  await commentModel.deleteMany({ cardId: { $in: cardIds } })
  await cardModel.deleteMany({ listId: list._id })
})

export const ListModel = mongoose.model("List", ListSchema);


export const ListRepository = {
  getListByIds(data: { _id: string; taskboardId: string }) {

    if (!data._id || !data.taskboardId) {
      return null;
    }

    return ListModel.findOne({
      _id: data._id,
      taskboardId: data.taskboardId,
    })
  },

  create(data: { title: string; taskboardId: string; position: number }) {
    return ListModel.create({
      title: data.title,
      position: data.position,
      taskboardId: data.taskboardId,
    });
  },

  getLists(taskboardId: string) {
    return ListModel
      .find({ taskboardId })
      .sort({ position: 1 })
      .lean();
  },

  countList(taskboardId: string) {
    return ListModel
      .find({ taskboardId }).countDocuments()
  },

  async delete(_id: string) {
    const list = await ListModel.findById({ _id })

    if (!list) return null

    return list.deleteOne()
  },

  bulkUpdatePositions(updates: { _id: string; position: number }[]) {
    return ListModel.bulkWrite(
      updates.map(u => ({
        updateOne: {
          filter: { _id: u._id },
          update: { $set: { position: u.position } },
        },
      }))
    );
  },

  getListById(_id: string) {
    return ListModel.findById(_id)
  },

  updateList(data: { _id: string, title: string }) {
    return ListModel.findByIdAndUpdate({ _id: data._id }, { $set: { title: data.title } }, { new: true })
  }

};