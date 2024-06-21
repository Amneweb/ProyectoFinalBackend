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
  updateByFilter = async (email, filters) => {
    console.log("en update by filter", email);
    console.log("idem filters");
    console.log(filters);
    console.log("despues de filters");

    return await this.#model.findOneAndUpdate(
      { userEmail: email },
      { $set: { ...filters } },
      { new: true }
    );
  };
}
export default UserDAO;
