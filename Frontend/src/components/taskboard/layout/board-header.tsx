import { UserLoggedIn } from "@/components/user/user.login"
import { TaskboardResponse } from "@/modules/taskboard/taskboard.types"
import { ManageMembersSection } from "../manageMembersSection"

export function BoardHeader({
  title,
  taskboard,
}: {
  title: string
  taskboard?: TaskboardResponse
}) {

  return (
    <header className={taskboard? "grid grid-cols-3 border-b px-4 py-2":"grid grid-cols-2 border-b px-4 py-2"}>
      <span>{title} {taskboard?.name}</span>

      {taskboard && (
        <ManageMembersSection
          taskboardId={taskboard._id}
          members={[taskboard.owner,...taskboard.members]}
        />
      )}

      <UserLoggedIn />
    </header>
  )
}
