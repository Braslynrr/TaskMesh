"use client"

import { cardProps } from "@/modules/card/card.types";
import { useState } from "react";
import { CardView } from "./card.view";
import { EditCard } from "./update.card";


export function Card({ card, user, taskBoardOwner, taskboardMembers, onAssign, onDelete, onUpdate }: cardProps) {
    const [isEditing, setIsEditing] = useState(false)

    const isTaskboardOwner = user._id === taskBoardOwner._id
    const isCardOwner = card.createdBy._id === user._id

    const canModify =
        isTaskboardOwner ||
        isCardOwner
        ||
        card.assignedTo.some(m => m._id === user._id)


    return !isEditing? 
        <CardView card={card} user={user} taskBoardOwner={taskBoardOwner} taskboardMembers={taskboardMembers} onAssign={onAssign} onDelete={onDelete} canModify={canModify} isTaskboardOwner={isTaskboardOwner}  setEditCard={ ()=> setIsEditing(true) }/>
        :
        <EditCard card={card} cancel={()=> setIsEditing(false)} onUpdate={onUpdate}/>
        

}