"use client"

import { CreateList } from "@/components/list/createList"
import { List } from "@/components/list/list"
import { getList, moveList } from "@/modules/taskboard/taskboard.api"
import { ListResponse } from "@/modules/taskboard/taskboard.types"
import { use, useEffect, useState } from "react"
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"


export default function TaskboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const {id} = use(params)

  const [lists, setLists] = useState<ListResponse[]>([])

  useEffect(() => {
    async function loadList() {
      try {
        const data = await getList(id)
        setLists(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadList()
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
      console.log(res)
    } 
    catch(e)
    {
      setLists((lists) => arrayMove(lists, newIndex, oldIndex))
    }

  
  }


  return (
    <div className="flex-1 flex gap-1 overflow-x-auto">


    <DndContext
     collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>

        <SortableContext
          items={lists.map(l => l._id)}
          strategy={horizontalListSortingStrategy}>
          
         {lists.map((list) => (
            <List key={list._id} list={list} />
        ))}
      
      </SortableContext>

    </DndContext>

      <CreateList key="createlist" onCreate={ (list) => setLists([...lists, list]) } taskboardId={id} ></CreateList>

    </div>
  )
}
