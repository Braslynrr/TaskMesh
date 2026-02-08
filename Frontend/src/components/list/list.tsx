import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useEffect, useState } from "react";
import { CreateCardForm } from "../card/createCard";
import { Card } from "../card/card";
import { listProps } from "@/modules/list/list.types";
import { cardResponse } from "@/modules/card/card.types";
import { getCards } from "@/modules/card/card.api";


export function List({ list, taskBoardOwner, user, taskboardMembers, list_cards}: listProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [cards, setCards] = useState<cardResponse[]>(list_cards)

  function newAssignation(card: cardResponse) {
    const oldCard = cards.find(c => c._id === card._id)

    if (oldCard)
      setCards(prev => prev.map(c => c._id === card._id ? card : c))

  }

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: list._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const canDeleteLists = taskBoardOwner._id === user._id

  return (
    <div className="flex flex-col bg-gray-100 rounded-md p-3 gap-2 text-black min-w-56 max-w-80 w-56 flex-1 overflow-y-auto" ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        className="font-semibold cursor-grab select-none p-3 text-center">
        <span>{list.title}</span>
        <hr />
      </div>


      {cards.map(card => <Card key={card._id} card={card} taskBoardOwner={taskBoardOwner} user={user} taskboardMembers={taskboardMembers} onAssign={(card) => newAssignation(card)} ></Card>)}

      {isCreating ? (
        <CreateCardForm
          listId={list._id}
          onCreate={(card: cardResponse) => setCards([...cards, card])}
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