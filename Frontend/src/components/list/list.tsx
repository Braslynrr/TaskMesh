import { listProps } from "@/modules/taskboard/taskboard.types";


export function List({list}:listProps){

    return <div className="flex flex-col bg-white rounded-lg p-3 shadow text-black min-w-56 max-w-80 w-56">
        <span className="text-center">{list.title}</span>
        <hr/>
    </div>
}