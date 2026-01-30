import { BoardCanvas } from "@/components/taskboard/layout/board-canvas"
import { BoardHeader } from "@/components/taskboard/layout/board-header"
import { BoardLayout } from "@/components/taskboard/layout/board-layout"

export default function TaskBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
        <BoardLayout>
              <BoardHeader title="My Boards" taskboard={undefined}/>
              <BoardCanvas>
                 {children}
              </BoardCanvas>
        </BoardLayout>
  )
}
