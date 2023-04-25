const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  createPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
  tokenGenerator: async (payload) => {
    const token = jsonwebtoken.sign({ payload }, process.env.privateKey, {
      expiresIn: "9hours",
    });
    return token;
  },
  tokenVerifier: async (token) => {
    const verifyToken = await jsonwebtoken.verify(
      token,
      process.env.privateKey
    );
    return verifyToken;
  },
};
