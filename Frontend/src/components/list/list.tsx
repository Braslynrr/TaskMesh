import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useEffect, useState } from "react";
import { CreateCardForm } from "../card/createCard";
import { Card } from "../card/card";
import { listProps } from "@/modules/list/list.types";
import { cardResponse } from "@/modules/card/card.types";
import { getCards } from "@/modules/card/card.api";


export function List({list}:listProps){
  const [isCreating, setIsCreating] = useState(false)
  const [cards, setCards] = useState<cardResponse[]>([])


  useEffect(() => {
    async function loadCards(){
      
      try{
        const requestedCards = await getCards({_id: list._id})
        setCards(requestedCards)
      }catch(e){

      }
    }

    loadCards()
  },[])


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


    return (
    <div className="flex flex-col bg-gray-100 rounded-md p-3 gap-2 text-black min-w-56 max-w-80 w-56 flex-1 overflow-y-auto" ref={setNodeRef}   style={style} {...attributes}>
        <div
          {...listeners}
          className="font-semibold cursor-grab select-none p-3 text-center">
          <span>{list.title}</span>
          <hr/>
        </div>

      
      {cards.map( card => <Card key={card._id} card={card} ></Card> )}

      {isCreating ? (
        <CreateCardForm
          listId={list._id}
          onCreate={ (card:cardResponse) => setCards([...cards, card]) }
          onCancel={ () => setIsCreating(false) }
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