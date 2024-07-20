import githubservice from "../services/github.service.js";

const githubController = async (req, res) => {
  const userEmail = req.user.userEmail;

  try {
    const access_token = await githubservice(userEmail);

    res
      .cookie("token_login", access_token, {
        maxAge: 600000,
        httpOnly: true,
        signed: true,
      })
      .redirect("/users/currentUser");
  } catch (error) {
    return res.send(`Error de autenticación con github ${error.message}`);
  }
};
export default githubController;
