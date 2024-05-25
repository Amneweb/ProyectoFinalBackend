import userModel from "./users.model.js";

class UserDAO {
  #model;
  constructor() {
    this.#model = userModel;
  }
  findAll = async () => {
    return await this.#model.find();
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
    return await this.#model.findOne({ email });
  };

  update = async (user, nuevo) => {
    return await this.#model.updateOne(
      { _id: user },
      { $set: { usuario: nuevo } }
    );
  };
}
export default UserDAO;
