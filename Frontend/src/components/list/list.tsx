import { listProps } from "@/modules/taskboard/taskboard.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"


export function List({list}:listProps){

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
    <div className="flex flex-col bg-white rounded-lg p-3 shadow text-black min-w-56 max-w-80 w-56" ref={setNodeRef}   style={style} {...attributes} {...listeners}>
        <span className="text-center">{list.title}</span>
        <hr/>
    </div>)
}