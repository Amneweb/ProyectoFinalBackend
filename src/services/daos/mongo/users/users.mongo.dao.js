import userModel from "./users.model.js";

class UserDAO {
  #model;
  constructor() {
    this.#model = userModel;
  }
  findAll = async () => {
    return await this.#model.find();
  };
  deleteOne = async (id) => {
    return await this.#model.deleteOne({ _id: id });
  };
  create = async ({
    userEmail,
    userPassword,
    userAge,
    userName,
    userLastName,
    userRole,
  }) => {
    return await this.#model.create({
      userEmail,
      userPassword,
      userAge,
      userName,
      userLastName,
      userRole,
    });
  };
  findOne = async (email) => {
    return await this.#model.findOne({ userEmail: email });
  };
  update = async (email) => {
    return await this.#model.updateOne(
      { userEmail: email },
      { $set: { userCartID: [] } }
    );
  };
}
export default UserDAO;
