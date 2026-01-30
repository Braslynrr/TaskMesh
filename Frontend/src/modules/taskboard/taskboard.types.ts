
export type TaskboardResponse = {
    _id:string
    name:string
    owner: UserResponse
    members: UserResponse[]
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

export type MongoIdRequest = deleteTaskboardRequest

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

export type moveListRequest = {
    _id:string
    taskboardId:string
    position:number  
}

export type listProps = {
    list: ListResponse
}

export type cardRequest = {
    title: string,
    description: string,
    listId: String
}


export type cardResponse = {
    _id: string,
    title: string,
    description: string,
    listId: String,
    createdBy: string,
    assignedTo: string[],
    createdAt: Date,
    updatedAt: Date,

}


export type createCardProps = {
    onCancel: () => void, 
    onCreate: (card:cardResponse) => void,
    listId: string
}

export type cardProps = {
    card: cardResponse
}


export type UserResponse = {
    _id:string
    username:string
    role:string
}

export type AddMemeberToTaskboardRequest = {
    _id:string
    members:string[]
}