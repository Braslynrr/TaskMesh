import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useEffect, useState } from "react";
import { CreateCardForm } from "../card/createCard";
import { Card } from "../card/card";
import { listProps } from "@/modules/list/list.types";
import { cardResponse } from "@/modules/card/card.types";
import { deleteList, updateList } from "@/modules/list/list.api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { SortableContext } from "@dnd-kit/sortable"
import { ActivityHighlight } from "../highLight/highlightWrapper";
import { Message } from "../message/message";
import { useTaskboardStore } from "@/stores/taskboardStore";


export function List({ list, taskBoardOwner, user, list_cards, onDelete, setCards, isDragging }: listProps) {
  const originalTitle = list.title
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [error, setError] = useState("")
  const taskboardMembers = useTaskboardStore(s=>s.taskboard?.members) ?? []

  useEffect(() => {
    setTitle(list.title)
  }, [list.title])

  function newAssignation(card: cardResponse) {
    const oldCard = list_cards.find(c => c._id === card._id)

    if (oldCard)
      setCards(prev => prev.map(c => c._id === card._id ? card : c))

  }

  async function newListTitle(e: React.FormEvent) {
    e.preventDefault()

    try {
      const data = {
        _id: list._id,
        title: title
      }
      const res = await updateList(data)
      setIsEditing(false)
      setError("")

    } catch (err) {

      setTitle(originalTitle)
      setError(extractApiErrorMessage(err))
    }
  }

  async function deleteOne() {
    try {
      const res = await deleteList(list._id)
      onDelete(list)
    } catch (err) {
      setError(extractApiErrorMessage(err))
    }
  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: list._id, data: { type: "list" } })


  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list._id,
    data: { type: "list" },
  })


  function setRefs(node: HTMLElement | null) {
    setNodeRef(node)
    setDroppableRef(node)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const canDeleteLists = taskBoardOwner._id === user._id

  return (
    <div className={`group/list flex flex-col bg-gray-100 rounded-md p-3 gap-2 w-96 shrink-0 overflow-y-auto ${isDragging ? "border-2 border-blue-800 hover:border-blue-500 transition" : ""}`} ref={setRefs} style={style} {...attributes} >
      {error && <Message type="error" message={error} onClose={() => setError("")} />}
      <div
        className="relative font-semibold cursor-grab select-none">
        {!isEditing ?
          <h3 {...listeners} className="text-center wrap-break-word">{title}</h3>
          :
          <form onSubmit={newListTitle} className="flex gap-1">
            <input className="border border-gray-400 rounded-2xl text-center" value={title} onChange={(e) => setTitle(e.target.value)} required></input>
            <button type="button" onClick={() => { setError(""); setIsEditing(false) }} className="text-red-800 text-2xl hover:text-red-500">X</button>
            <button type="submit" className="text-green-800 text-2xl hover:text-green-500">✔</button>
          </form>
        }

        {!isEditing && <button onClick={() => setIsEditing(true)} className="absolute right-4 top-0 border-gray-100 text-transparent group-hover/list:text-blue-800 hover:text-blue-500">✎</button>}
        {canDeleteLists && <button onClick={deleteOne} className="absolute -right-2 top-0 opacity-0 group-hover/list:opacity-100 hover:opacity-85">🗑️</button>}

        <hr />
      </div>

      <SortableContext items={list_cards.filter(card => card.listId === list._id).map(card => card._id)} >

        {list_cards.map(card =>
          <ActivityHighlight key={`h-${card._id}`} id={card._id}>
            <Card
              key={card._id}
              card={card}
              taskBoardOwner={taskBoardOwner}
              user={user}
              taskboardMembers={taskboardMembers}
              onAssign={(card) => newAssignation(card)}
              onDelete={(card) => setCards((prev) => prev.filter(c => c._id !== card._id))}
              onUpdate={(card) => setCards(prev => prev.map(c => c._id === card._id ? card : c))}
              setCards={setCards}
            ></Card>
          </ActivityHighlight>
        )}
      </SortableContext>

      {isCreating ? (
        <CreateCardForm
          listId={list._id}
          onCreate={(card: cardResponse) => setCards((prev) => [...prev, card])}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="text-sm text-gray-500 hover:text-black">
          + Add card
        </button>)
      }

    </div>
  )
}