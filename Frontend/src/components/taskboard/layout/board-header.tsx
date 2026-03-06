import { UserLoggedIn } from "@/components/user/user.login"
import { ManageMembersSection } from "../manageMembersSection"
import Link from "next/link"

export function BoardHeader({
  title,
  taskboardId,
}: {
  title: string
  taskboardId: string
}) {


  return (
    <header className={taskboardId ? "grid grid-cols-3 border-b px-4 py-2" : "grid grid-cols-2 border-b px-4 py-2"}>
      <div>
        <Link href="/taskboard" className="font-medium underline">
          {title}
        </Link>
        <span> 📑{taskboardId}</span>
      </div>


      {taskboardId && (
        <ManageMembersSection
          taskboardId={taskboardId}
        />
      )}

      <UserLoggedIn />
    </header>
  )
}
