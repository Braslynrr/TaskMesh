"use client"

import { CreateList } from "@/components/list/createList"
import { List } from "@/components/list/list"
import { use, useEffect, useState } from "react"
import { rectIntersection, DndContext, DragEndEvent, DragStartEvent, DragOverlay, DragCancelEvent } from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import { listResponse } from "@/modules/list/list.types"
import { TaskboardSnapshotResponse } from "@/modules/taskboard/taskboard.types"
import { moveList } from "@/modules/list/list.api"
import { UserResponse } from "@/modules/auth/auth.types"
import { getTaskboardSnapshot } from "@/modules/taskboard/taskboard.api"
import { extractApiErrorMessage } from "@/lib/api-error"
import { cardResponse } from "@/modules/card/card.types"
import { moveCard } from "@/modules/card/card.api"
import { GhostCard } from "@/components/card/ghost.card"
import { useBoardSocket } from "@/socket-lib/useBoardSocket"
import { SpinnerCircular } from "spinners-react"
import { ActivityHighlight } from "@/components/highLight/highlightWrapper"
import { Message } from "@/components/message/message"

export default function TaskboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [error, setError] = useState("")
  const { id } = use(params)
  const [lists, setLists] = useState<listResponse[]>([])
  const [cards, setCards] = useState<cardResponse[]>([])
  const [taskboard, setTaskboard] = useState<TaskboardSnapshotResponse>()
  const [user, setUser] = useState<UserResponse>()
  const [activeCard, setActiveCard] = useState<cardResponse | null>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    async function loadListAndUser() {
      try {
        const task = await getTaskboardSnapshot(id)
        setLists(task.lists)
        setCards(task.cards)
        setTaskboard(task)

        const user = localStorage.getItem("user")
        if (user) setUser(JSON.parse(user))

        setLoading(false)

      } catch (err) {
        setError(extractApiErrorMessage(err))
      }
    }

    loadListAndUser()
  }, [id])

  useBoardSocket({
    taskboardId: id,
    moveCards: arrayMove,
    setLists,
    setCards,
  })

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
    if (!over || !active || active.id === over.id) {
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

        setLists((prev) => arrayMove(prev, oldIndex, newIndex))


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
          setLists((prev) => arrayMove(prev, newIndex, oldIndex))
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


  if (loading)
    return (
      <div className="flex items-center justify-center gap-2 py-6">
        <p>Loading taskboard...</p>
        <SpinnerCircular size={25} />
      </div>
    )

  return (
    <div className="flex flex-col text-black h-full">
      {error && <Message type="error" message={error} onClose={() => setError("")} />}
      <div className="flex gap-1 overflow-x-auto h-full items-start">

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
              <ActivityHighlight key={`h-${list._id}`} id={list._id}>
                <List key={list._id} list={list} list_cards={cards.filter(card => card.listId === list._id)} taskBoardOwner={taskboard.owner} user={user}
                  onDelete={(list) => setLists((prev) => prev.filter(l => l._id !== list._id))} isDragging={activeCard !== null} setCards={setCards} />

              </ActivityHighlight>
            ))}

          </SortableContext>

        </DndContext>

        {!creating ?
          <div
            onClick={() => setCreating(true)}
            className="flex items-center justify-center w-12 h-12 ml-20 mt-32 rounded-full border border-slate-300 text-slate-500 hover:text-slate-100 cursor-pointer justify-self-center"
          >
            +
          </div>
          :
          <CreateList key="createlist" onCreate={(list) => setLists([...lists, list])} taskboardId={id} onCancel={() => setCreating(false)} ></CreateList>

        }

      </div>
    </div>

  )
}
