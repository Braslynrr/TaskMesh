import { BoardHeader } from "@/components/taskboard/layout/board-header"
import { BoardLayout } from "@/components/taskboard/layout/board-layout"
import { BoardListCanvas } from "@/components/taskboard/layout/board-list-canvas"

export default function TaskBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <BoardLayout>
              <BoardHeader title="Taskboard" />
              <BoardListCanvas>
                 {children}
              </BoardListCanvas>
        </BoardLayout>
  )
}
