import userModel from "./users.model.js";

export default class UserService {
  constructor() {
    console.log("Calling users model using a service.");
  }
  getAll = async () => {
    let users = await userModel.find();
    console.log("en get all de usuarios ", users);
    return users.map((user) => user.toObject());
  };
  save = async (user) => {
    let result = await userModel.create(user);
    return result;
  };
  findByUsername = async (username) => {
    const result = await userModel.findOne({ userEmail: username });
    return result;
  };
  update = async (filter, value) => {
    console.log("Update user with filter and value:");
    console.log(filter);
    console.log(value);
    let result = await userModel.updateOne(filter, value);
    return result;
  };
}
