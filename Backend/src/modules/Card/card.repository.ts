import mongoose, { Types } from "mongoose";
import { CardDoc } from "./card.types";

const Cardschema = new mongoose.Schema<CardDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

export const cardModel = mongoose.model("Card", Cardschema)


export const cardRepository = {

    getCardByID(_id:string){
        return cardModel.findById({ _id })
    },
    getCardsByListId(listId:string){
        return cardModel.find({ listId })
    },

    createCard(data:{ title:string, description:string, listId:string, createdBy:string}){
        return cardModel.create(data)
    },

    delete(_id:string){
        return cardModel.deleteOne({ _id })
    },

    assingUsersToCard(data: {_id:string, assignedTo:string[]}){
        return cardModel.findByIdAndUpdate(
            {_id: data._id},
            {   
                 $set: { assignedTo: data.assignedTo.map(id => new Types.ObjectId(id)) }
            },
            {new:true})
    },

    updateCard(data:{_id:string, title:string, description:string}){
        return cardModel.findByIdAndUpdate(
            {_id: data._id},
            {   
                 $set: { title: data.title, description: data.description },
            },
            {new:true})
    },

    moveFromList(data: {_id: string, listId: string}){
         return cardModel.findByIdAndUpdate(
            {_id: data._id},
            {   
                 $set: { listId:data.listId },
            },
            {new:true}
          )
    }

}