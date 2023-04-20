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
      destination: { address: "www.destini.in" },
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
  //* HERE THE USER CAN ABLE TO GET SOME OF THEIR OWN DATA FOR PROFILE DISPLAY
  loginUser: async (request, response) => {
    try {
      const { email, password } = request.body;
      console.log(password)
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
          const token = await library.tokenGenerator({
            Account_Id: isMailVerified.Account_Id,
          });
          const datas = {
            name: isMailVerified.username,
            email: isMailVerified.email,
            destination: isMailVerified.destination,
          };
          console.log(token);
          response.status(200).send({
            message: "Login Successful",
            status: true,
            token: token,
            data: datas,
          });
        }else{
          response.status(401).send({
            message:'Unauthorized',
            status:false
          })
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
  getAllUser: async (request, response) => {
    try {
      const getHeadersData = request.header("CL-X-TOKEN");
      const verifyToken = await library.tokenVerifier(getHeadersData);
      const verifyUser = await userSchema.findOne(verifyToken.payload);
      if (verifyUser) {
        const getAllUsers = await userSchema.find();
        response.status(200).send({
          message: "Successful",
          status: true,
          data: getAllUsers,
        });
      }
    } catch (error) {
      console.log(error);
      response.status(401).send({
        message: "Un Authorized",
        status: false,
      });
    }
  },
  deleteUserById: async (request, response) => {
    try {
      const token = request.header("CL-X-TOKEN");
      const deleteUser = request.body;
      const verifyToken = await library.tokenVerifier(token);
      const userExists = await userSchema.findOne(verifyToken.payload);
      console.log(deleteUser);
      console.log(userExists.Account_Id);
      if (userExists.Account_Id !== deleteUser.Account_Id) {
        const deleteuserData = await userSchema.deleteOne(deleteUser);
        response.status(200).send({
          message: `${deleteUser.Account_Id} Deleted Successfully`,
          status: true,
        });
      }
    } catch (error) {
      console.log(error);
      response.status(403).send({
        message: "User cannot delete by himself",
        status: false,
      });
    }
  },
  editOwnData: async (request, response) => {
    const password = request.body.password;
    const conformPassword = request.body.conformPassword;
    const token = request.header("CL-X-TOKEN");
    const verifyToken = await library.tokenVerifier(token);
    const verifyUser = await userSchema.findOne(verifyToken.payload);
    console.log(verifyUser);
    if (verifyUser) {
      let conformedPassword;
      if (password === conformPassword) {
        conformedPassword = await library.createPassword(password);
        const editedData = {
          Account_Id: verifyToken.payload.Account_Id,
          username: request.body.username,
          email: request.body.email,
          contact: request.body.contact,
          destination: { address: "www.destini.in" },
          password: conformedPassword,
        };
        const editUserData = await userSchema.findOneAndReplace(
          verifyToken.payload, // search criteria
          editedData, // replacement document
          { new: true } // return updated document
        );

        response.status(200).send({
          message: "User details updated successfully",
          data: editUserData,
          status: true,
        });
      } else {
        response.status(403).status({
          message: "Password dosen't match",
          status: false,
        });
      }
    }

    // console.log(conformedPassword);
  },
};
