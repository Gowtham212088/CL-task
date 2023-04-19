const userSchema = require("../model/userRegistrationModel");
const bcrypt = require("bcrypt");
const library = require("../helper");

module.exports = {
  createUser: async (request, response) => {
    const password = request.body.password;
    const conformPassword = request.body.conformPassword;
    const conformedPassword = await library.createPassword(password);
    const collectionCount = await userSchema.count();
    const userData = {
      Account_Id: `1234Cust_Labs_${collectionCount + 1}`,
      username: request.body.username,
      email: request.body.email,
      contact: request.body.contact,
      destination: [],
      password: conformedPassword,
    };

    const existingMailId = await userSchema.findOne({
      email: userData.email,
    });
    if (existingMailId) {
      response.status(409).send({ error: "Email address is already in use" });
    } else {
      if (password === conformPassword) {
        try {
          const createData = await userSchema.create(userData);
          response.status(200).send({
            message: "User created Successfully",
            data: createData,
            status: true,
          });
        } catch (error) {
          console.log(error);
          response.status(404).send({
            message: "Kindly enter all details",
            status: false,
          });
        }
      }
    }
  },
  loginUser: async (request, response) => {
    try {
      const { email, password } = request.body;
      const isMailVerified = await userSchema.findOne({ email: email });
      const isPasswordMatching = await bcrypt.compare(
        password,
        isMailVerified.password
      );
      console.log(isMailVerified);
      console.log(isPasswordMatching);
      if (!isMailVerified) {
        response.status(404).send({
          message: "E-Mail id doesn't match",
          status: false,
        });
      } else {
        if (isPasswordMatching) {
          const token = await library.tokenGenerator({ isMailVerified });

          console.log(token);
          response.status(200).send({
            message: "Login Successful",
            status: true,
            token: token,
          });
        }
      }
    } catch (error) {
      console.log(error);
      response.status(401).send({
        message: "User Unauthorized",
        status: false,
      });
    }
  },
};
