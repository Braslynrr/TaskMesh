"use client"

import { CreateList } from "@/components/list/createList"
import { List } from "@/components/list/list"
import { getList } from "@/modules/taskboard/taskboard.api"
import { ListResponse } from "@/modules/taskboard/taskboard.types"
import { use, useEffect, useState } from "react"

export default function TaskboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const {id} = use(params)

  const [lists, setLists] = useState<ListResponse[]>([])

  useEffect(() => {
    async function loadList() {
      try {
        const data = await getList(id)
        setLists(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadList()
  }, [])

  return (
    <div className="flex-1 flex gap-1 overflow-x-auto">

      {lists.map((list) => (
          <List key={list._id} list={list} />
      ))}

      <CreateList key="createlist" onCreate={ (list) => setLists([...lists, list]) } taskboardId={id} ></CreateList>

    </div>
  )
}
