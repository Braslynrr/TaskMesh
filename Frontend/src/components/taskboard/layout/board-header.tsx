export function BoardHeader({ title }: { title: string }) {
  return (
    <header className="border-b px-4 py-2">
      {title}
    </header>
  )
}
