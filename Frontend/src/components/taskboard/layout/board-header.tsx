import { UserLoggedIn } from "@/components/user/user.login"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { AddMemberSection } from "../addMemberSection"

export function BoardHeader({
  title,
  taskboard,
}: {
  title: string
  taskboard?: TaskboardResponse
}) {
  console.log(taskboard)

  return (
    <header className={taskboard? "grid grid-cols-3 border-b px-4 py-2":"grid grid-cols-2 border-b px-4 py-2"}>
      <span>{title} {taskboard?.name}</span>

      {taskboard && (
        <AddMemberSection
          taskboardId={taskboard._id}
          members={taskboard.members}
        />
      )}

      <UserLoggedIn />
    </header>
  )
}
