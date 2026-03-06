import { createTaskboardWithMembers } from "../factories/taskboard.factory"
import { createAuthUser, createUser } from "../factories/user.factory"
import { User } from "src/modules/Users/user.types"
import request from "supertest"
import app from "../../app"


describe("DELETE /api/taskboard/:id/member/:user", () => {

  let _token: string
  let _taskBoardId: string
  let userList: User[]

  beforeEach(async () => {
    const users = await Promise.all(
      Array.from({ length: 4 }, (_, i) =>
        createUser(`${i}`)))

    const { token, taskboard } = await createTaskboardWithMembers(users.map(user => user._id))
    _token = token
    _taskBoardId = taskboard._id
    userList = users
  })

  it("fails if user is not the owner", async () => {

    const { token } = await createAuthUser("random user")

    const res = await request(app)
      .delete(`/api/taskboard/${_taskBoardId}/member/${userList[0]._id}`)
      .set("Cookie", `auth_token=${token}`)

    expect(res.status).toBe(403)
    expect(res.body.issues[0].message).toBe("only owner can perform this action")

  })


  it("should remove a member from a taskboard", async () => {

    const userId = userList[0]._id

    const res = await request(app)
      .delete(`/api/taskboard/${_taskBoardId}/member/${userId}`)
      .set("Cookie", `auth_token=${_token}`)

    expect(res.status).toBe(200)
    expect(userList.filter(u => u._id != userId)).toMatchObject(res.body.members)
  })

})