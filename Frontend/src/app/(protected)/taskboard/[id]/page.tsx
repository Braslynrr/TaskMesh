"use client"

import { CreateList } from "@/components/list/createList"
import { List } from "@/components/list/list"
import { use, useEffect, useState } from "react"
import { rectIntersection, DndContext, DragEndEvent, DragStartEvent, DragOverlay, DragCancelEvent } from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import { ListResponse } from "@/modules/list/list.types"
import { TaskboardSnapshotResponse } from "@/modules/taskboard/taskboard.types"
import { moveList } from "@/modules/list/list.api"
import { UserResponse } from "@/modules/auth/auth.types"
import { getTaskboardSnapshot } from "@/modules/taskboard/taskboard.api"
import { extractApiErrorMessage } from "@/lib/api-error"
import { cardResponse } from "@/modules/card/card.types"
import { moveCard } from "@/modules/card/card.api"
import { GhostCard } from "@/components/card/ghost.card"

export default function TaskboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [error, setError] = useState("")
  const { id } = use(params)
  const [lists, setLists] = useState<ListResponse[]>([])
  const [cards, setCards] = useState<cardResponse[]>([])
  const [taskboard, setTaskboard] = useState<TaskboardSnapshotResponse>()
  const [user, setUser] = useState<UserResponse>()
  const [activeCard, setActiveCard] = useState<cardResponse | null>(null)

  useEffect(() => {
    async function loadListAndUser() {
      try {
        const task = await getTaskboardSnapshot(id)
        setLists(task.lists)
        setCards(task.cards)
        setTaskboard(task)

        const user = localStorage.getItem("user")
        if (user) setUser(JSON.parse(user))

      } catch (err) {
        setError(extractApiErrorMessage(err))
      }
    }

    loadListAndUser()
  }, [])

  function handleDragCancel(event: DragCancelEvent) {
    setActiveCard(null)
  }

  function handleDragStart(event: DragStartEvent) {

    setActiveCard(null)

    const { active } = event
    if (active.data.current?.type === "card") {

      const card = cards.find(c => c._id === active.id)
      setActiveCard(card!)
    }
  }


  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) {
      setActiveCard(null)
      return
    }

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    const type = `${activeType} to ${overType}`

    let listiId = over.id.toString()
    let originalList = ""

    switch (type) {
      case "list to list":

        const oldIndex = lists.findIndex(l => l._id === active.id)
        const newIndex = lists.findIndex(l => l._id === over.id)

        setLists((lists) => arrayMove(lists, oldIndex, newIndex))

        try {
          const data = {
            _id: active.id.toString(),
            taskboardId: id,
            position: newIndex + 1
          }

          await moveList(data)
        }
        catch (err) {
          setError(extractApiErrorMessage(err))
          setLists((lists) => arrayMove(lists, newIndex, oldIndex))
        }
        break;
      case "card to card":
        listiId = cards.filter(card => card._id == over.id)[0].listId.toString()
        originalList = cards.filter(card => card._id == active.id)[0].listId.toString()
        if (listiId === originalList) return
      case "card to list":

        const prevCards = cards
        try {


          const data = {
            _id: active.id.toString(),
            listId: listiId
          }

          setCards(prev =>
            prev.map(card =>
              card._id === data._id
                ? { ...card, listId: data.listId }
                : card
            )
          )

          await moveCard(data)

        } catch (err) {

          setCards(prevCards)

          setError(extractApiErrorMessage(err))
        }

        break;
      default:
    }

    setActiveCard(null)
  }


  return (
    <div className="flex flex-col">
      <span className=" text-red-700 items-center text-center text-3xl">{error}</span>
      <div className="flex-1 flex gap-1 items-start">

        <DndContext
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}>

          <DragOverlay>
            {activeCard ? <GhostCard card={activeCard} /> : null}
          </DragOverlay>


          <SortableContext
            items={lists.map(l => l._id)}
            strategy={horizontalListSortingStrategy}>

            {taskboard && cards && user && lists.map((list) => (
              <List key={list._id} list={list} list_cards={cards.filter(card => card.listId === list._id)} taskBoardOwner={taskboard.owner} user={user} taskboardMembers={[taskboard.owner, ...taskboard.members]}
                onDelete={(list) => setLists((prev) => prev.filter(l => l._id !== list._id))} isDragging={activeCard !== null} setCards={setCards} />
            ))}

          </SortableContext>

        </DndContext>

        <CreateList key="createlist" onCreate={(list) => setLists([...lists, list])} taskboardId={id} ></CreateList>

      </div>
    </div>

  )
}
