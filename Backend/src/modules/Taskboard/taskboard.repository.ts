import mongoose, { Types } from "mongoose"
import { TaskboardDoc } from "./taskboard.types"

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

  delete(data: { _id: string; ownerId: string }) {
    return taskboardModel.deleteOne({
      _id: new Types.ObjectId(data._id),
      ownerId: new Types.ObjectId(data.ownerId),
    })
  },

  getTaskboards(id: string) {
    return taskboardModel.find({
      $or: [
        { ownerId: id },
        { members: id }]
    })
  }

}
