"use client"

import { CreateList } from "@/components/list/createList"
import { List } from "@/components/list/list"
import { use, useEffect, useState } from "react"
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import { ListResponse } from "@/modules/list/list.types"
import { TaskboardSnapshotResponse } from "@/modules/taskboard/taskboard.types"
import { moveList } from "@/modules/list/list.api"
import { UserResponse } from "@/modules/auth/auth.types"
import { getTaskboardSnapshot } from "@/modules/taskboard/taskboard.api"

export default function TaskboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const {id} = use(params)

  const [lists, setLists] = useState<ListResponse[]>([])
  const [taskboard, setTaskboard] = useState<TaskboardSnapshotResponse>()
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    async function loadListAndUser() {
      try {
        const task = await getTaskboardSnapshot(id)
        setLists(task.lists)
        setTaskboard(task)

        const user = localStorage.getItem("user")
        if(user) setUser(JSON.parse(user))

      } catch (err) {
        console.error(err)
      }
    }

    loadListAndUser()
  }, [])


  async function handleDragEnd(event:DragEndEvent){
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = lists.findIndex(l => l._id === active.id)
    const newIndex = lists.findIndex(l => l._id === over.id)

    setLists((lists) => arrayMove(lists, oldIndex, newIndex))

    try{
      const data = {
        _id:active.id.toString(),
        taskboardId: id,
        position: newIndex + 1
      }

      const res = await moveList(data)
    } 
    catch(e)
    {
      setLists((lists) => arrayMove(lists, newIndex, oldIndex))
    }

  
  }


  return (
    <div className="flex-1 flex gap-1 overflow-x-auto items-start">

    <DndContext
     collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>

        <SortableContext
          items={lists.map(l => l._id)}
          strategy={horizontalListSortingStrategy}>
          
         {taskboard && user &&  lists.map((list) => (
            <List key={list._id} list={list} list_cards={taskboard.cards.filter(card=> card.listId === list._id)} taskBoardOwner={taskboard.owner} user={user} taskboardMembers={[taskboard.owner,...taskboard.members]} 
            onDelete={ (list) => setLists( (prev) => prev.filter(l => l._id!==list._id ))}/>
        ))}
      
      </SortableContext>

    </DndContext>

      <CreateList key="createlist" onCreate={ (list) => setLists([...lists, list]) } taskboardId={id} ></CreateList>

    </div>
  )
}
