
export type TaskboardResponse = {
    _id:string
    name:string
    ownerId: string
    members: string[]
}

export type createTaskboardRequest = {
    name:string
}


export type CreateTaskboardProps = {
  onCreated: (taskboard: TaskboardResponse) => void
}


export type deleteTaskboardRequest = {
    _id: string
}

export type DeleteResponse = {
    deletedCount: number

}

export type TaskboardProps = {
  tb: TaskboardResponse
  onDelete: (taskboard: TaskboardResponse) => void
}

export type CreateListProps = {
  taskboardId: string
  onCreate: (list:ListResponse) => void
}


export type ListResponse = {
    _id:string
    title:string
    taskboardId:string  
    position:number
}


export type createListRequest = {
    title:string
    taskboardId:string  
}


export type listProps = {
    list: ListResponse
}