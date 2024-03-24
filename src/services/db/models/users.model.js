import mongoose from "mongoose";
const USERS_COLLECTION = "users";
const userSchema = new mongoose.Schema({
  userName: String,
  userLastName: String,
  userEmail: {
    type: String,
    unique: true,
  },
  userAge: Number,
  userPassword: String, //Se deja plano por el momento.
});
const userModel = mongoose.model(USERS_COLLECTION, userSchema);
export default userModel;
