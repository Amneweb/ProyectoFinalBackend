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
  update = async (user, filter, value) => {
    console.log("Update user with filter and value:");
    console.log(filter);
    console.log(value);
    console.log(user);
    const hayUsuario = await userModel.findOne({ userEmail: user.email });

    hayUsuario[filter] = value;

    await hayUsuario.save().then((result) => {
      const modificado = userModel.findOne({ userEmail: user.email });
      console.log(
        "modificado al final de update en users service ",
        modificado
      );
      return modificado;
    });

    /*if (result.modifiedCount > 0) {
      const modificado = await userModel.findOne({ _id: user });
      return { modificado };
    } else {
      return result;
    }*/
  };
}
