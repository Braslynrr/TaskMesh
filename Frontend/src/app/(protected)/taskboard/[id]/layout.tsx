import { BoardHeader } from "@/components/taskboard/layout/board-header"
import { BoardLayout } from "@/components/taskboard/layout/board-layout"
import { BoardListCanvas } from "@/components/taskboard/layout/board-list-canvas"
import { getTaskboard } from "@/modules/taskboard/layout.taskboard.api"
import { use } from "react"

export default function TaskBoardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {

  const param = use(params)

  const taskboard = param ? use(getTaskboard(param.id)) : undefined

  return (
    <BoardLayout>
      <BoardHeader title="Taskmesh" taskboard={taskboard} />
      <BoardListCanvas>
        {children}
      </BoardListCanvas>
    </BoardLayout>
  )
}
