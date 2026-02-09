import mongoose, { Types } from "mongoose"
import { TaskboardDoc } from "./taskboard.types"
import { ListModel, ListRepository } from "../List/list.repository"
import { cardModel } from "../Card/card.repository"
import { commentModel } from "../Comment/comment.repository"

const TaskboardSchema = new mongoose.Schema<TaskboardDoc>({
  name: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true })

TaskboardSchema.pre("deleteOne", { document: true }, async function () {  
  const taskboard = this

  const lists = await ListModel.find({ taskboardId: taskboard._id }).select("_id")
  const listIds = lists.map(l => l._id)

  const cards = await cardModel.find({ listId: { $in: listIds } }).select("_id")
  const cardIds = cards.map(c => c._id)

  await commentModel.deleteMany({ cardId: { $in: cardIds } })
  await cardModel.deleteMany({ listId: { $in: listIds } })
  await ListModel.deleteMany({ taskboardId: taskboard._id })

})

export const taskboardModel = mongoose.model("Taskboard", TaskboardSchema)

export const taskboardRepository = {

  findbyId(_id: string) {
    return taskboardModel.findOne({ _id })
  },

  findByName(name: string) {
    return taskboardModel.findOne({ name })
  },

  create(data: { name: string; ownerId: string }) {
    const taskboard = {
      ownerId: new Types.ObjectId(data.ownerId),
      name: data.name
    }
    return taskboardModel.create(taskboard)
  },

  addMembers(data: { _id: string; members: string[] }) {
    const taskboard = taskboardModel.findOneAndUpdate(
      { _id: data._id },
      {
        $addToSet:
        {
          members:
          {
            $each: data.members.map(id => new Types.ObjectId(id))
          }
        }
      },
      { new: true }
    )

    return taskboard
  },

  async delete(data: { _id: string; ownerId: string }) {
    const taskboard = await taskboardModel.findOne({
      _id: new Types.ObjectId(data._id),
      ownerId: new Types.ObjectId(data.ownerId),
    })

    if (!taskboard) return null

    return taskboard.deleteOne()
  },

  getTaskboards(id: string) {
    return taskboardModel.find({
      $or: [
        { ownerId: id },
        { members: id }]
    })
  }

}
