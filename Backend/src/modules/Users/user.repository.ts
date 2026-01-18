import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true })

export const UserModel = mongoose.model("User", UserSchema)

// Acceso a datos (repositorio)
export const userRepository = {
  findByUsername(username: string) {
    return UserModel.findOne({ username })
  },

  create(data: { username: string; password: string }) {
    return UserModel.create(data)
  },

  resetPassword(data: { username: string; password: string })
  {
    let user = UserModel.findOneAndUpdate(
      { username: data.username },
      { $set: { password: data.password } }
    )

    return user
  }
}
