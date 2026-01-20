import mongoose, { Types } from "mongoose";

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

  delete(data: { _id: string; taskboardId: string }) {
    return ListModel.deleteOne({
      _id: data._id,
      taskboardId: data.taskboardId,
    });
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
  
  getListById(_id:string){
    return ListModel.findById(_id)
  }

};