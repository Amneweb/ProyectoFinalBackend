export default class UsersDTO {
  getUserInputFrom = (user) => {
    console.log("en dto");
    console.log(user.userDocs);
    return {
      name: user.userName,
      lastName: user.userLastName,
      age: user.userAge,
      email: user.userEmail,
      fullName: `${user.userName} ${user.userLastName}`,
      role: user.userRole,
      lastConnection: user.userConnection?.toLocaleString("es-AR", {
        hourCycle: "h24",
      }),
      uploadedDocuments: user.userDocs.map((doc) => doc.docCode),
      cartID: user.userCartID,
    };
  };
}
