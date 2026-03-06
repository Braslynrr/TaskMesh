import { BoardHeader } from "@/components/taskboard/layout/board-header"
import { BoardLayout } from "@/components/taskboard/layout/board-layout"
import { BoardListCanvas } from "@/components/taskboard/layout/board-list-canvas"
import { use } from "react"

export default function TaskBoardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {

  const param = use(params)

  return (
    <BoardLayout>
      <BoardHeader title="Taskmesh" taskboardId={param.id} />
      <BoardListCanvas>
        {children}
      </BoardListCanvas>
    </BoardLayout>
  )
}
