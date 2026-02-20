import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react";
import { CreateCardForm } from "../card/createCard";
import { Card } from "../card/card";
import { listProps } from "@/modules/list/list.types";
import { cardResponse } from "@/modules/card/card.types";
import { deleteList } from "@/modules/list/list.api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { SortableContext } from "@dnd-kit/sortable"


export function List({ list, taskBoardOwner, user, taskboardMembers, list_cards, onDelete, setCards, isDragging }: listProps) {
  const originalTitle = list.title
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [error, setError] = useState("")

  function newAssignation(card: cardResponse) {
    const oldCard = list_cards.find(c => c._id === card._id)

    if (oldCard)
      setCards(prev => prev.map(c => c._id === card._id ? card : c))

  }

  async function newTitle() {
    try {
      // todo
    } catch (err) {
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
    <div className={`flex flex-col bg-gray-100 rounded-md p-3 gap-2 text-black min-w-56 max-w-80 w-56 flex-1 overflow-y-auto ${isDragging ? "border-2 border-blue-800 hover:border-blue-500 transition" : ""}`} ref={setRefs} style={style} {...attributes} >
      <span className="text-red-700">{error}</span>
      <div
        className="relative font-semibold cursor-grab select-none">
        {!isEditing ?
          <h3 {...listeners} className="text-center">{title}</h3>
          :
          <div className="flex gap-1">
            <input className="border border-gray-400 rounded-2xl text-center" value={title} onChange={(e) => setTitle(e.target.value)}></input>
            <button onClick={() => setIsEditing(false)} className="text-red-800 text-2xl hover:text-red-500">X</button>
            <button onClick={newTitle} className="text-green-800 text-2xl hover:text-green-500">✔</button>
          </div>
        }

        {!isEditing && <button onClick={() => setIsEditing(true)} className="absolute right-4 top-0 border-gray-100 text-blue-800 hover:text-blue-500">✎</button>}
        {canDeleteLists && <button onClick={deleteOne} className="absolute -right-2 top-0 hover:opacity-85">🗑️</button>}

        <hr />
      </div>

      <SortableContext items={list_cards.filter(card => card.listId === list._id).map(card => card._id)} >
        {list_cards.map(card => <Card key={card._id} card={card} taskBoardOwner={taskBoardOwner} user={user} taskboardMembers={taskboardMembers} onAssign={(card) => newAssignation(card)} onDelete={(card) => setCards((prev) => prev.filter(c => c._id !== card._id))}></Card>)}
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