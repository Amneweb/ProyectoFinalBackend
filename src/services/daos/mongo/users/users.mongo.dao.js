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
  }) => {
    return await this.#model.create({
      userEmail,
      userPassword,
      userAge,
      userName,
      userLastName,
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
  findByID = async (uid) => {
    return await this.#model.findOne({ _id: uid });
  };
  findByFilter = async (filters) => {
    return await this.#model.find(filters);
  };
  updateByFilter = async (email, filters) => {
    return await this.#model.findOneAndUpdate(
      { userEmail: email },
      { $set: { ...filters } },
      { new: true }
    );
  };
}
export default UserDAO;
