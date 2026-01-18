export type User = {
  id: string
  Username: string
  role: "user" | "admin"
}

export type CreateUserInput = {
  Username: string
  password: string
}
