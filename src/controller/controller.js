const userSchema = require("../model/userRegistrationModel");
const destinationSchema = require("../model/destinationSchema");
const adminSchema = require("../model/adminSchema");
const bcrypt = require("bcrypt");
const library = require("../helper");
const { request } = require("http");
const { response } = require("..");

module.exports = {
  // ! CREATING ADMIN ACCOUNT

  createAdmin: async (request, response) => {
    try {
      const hashPassword = await library.createPassword(request.body.password);
      const collectionCount = await adminSchema.count();

      const adminData = {
        Account_Id: `Admin_Cust_Labs_${collectionCount + 1}`,
        username: request.body.username,
        email: request.body.email,
        contact: request.body.contact,
        designation: request.body.designation,
        password: hashPassword,
      };

      const checkUserExists = await adminSchema.findOne({
        email: adminData.email,
      });
      if (!checkUserExists) {
        const adminDetails = await adminSchema.create(adminData);
        console.log(
          `ADMIN ACCOUNT CREATED SUCESSFULLY IN ID OF ${destination.Account_Id}`
        );
        console.log(Date());
        response.status(200).send({
          message: "Admin Created Successfully",
          status: true,
        });
      } else {
        response.send({
          message: "E-Mail Already Exists",
          status: false,
        });
      }
    } catch (error) {
      console.log(error);
      response.status(401).response({
        message: "kindly Enter All Details",
        status: false,
      });
    }
  },

  // ! ADMIN LOGIN

  adminLogin: async (request, response) => {
    try {
      const { email, password } = request.body;
      const isMailVerified = await adminSchema.findOne({ email: email });
      console.log(isMailVerified);
      const isPasswordMatching = await bcrypt.compare(
        password,
        isMailVerified.password
      );

      if (!isMailVerified) {
        console.log("mail no match");
        response.status(404).send({
          message: "E-Mail id doesn't match",
          status: false,
        });
      } else {
        if (isPasswordMatching) {
          const token = await library.tokenGenerator({
            APP_id: isMailVerified.Account_Id,
            username: isMailVerified.username,
            email: isMailVerified.email,
            designation: isMailVerified.designation,
          });
          const datas = {
            APP_id: isMailVerified.Account_Id,
            username: isMailVerified.username,
            email: isMailVerified.email,
            designation: isMailVerified.designation,
          };
          console.log(
            `ADMIN ACCOUNT ${isMailVerified.Account_Id} LOGGED IN SUCCESSFULLY `
          );
          console.log(Date());
          response.status(200).send({
            message: "Login Successful",
            status: true,
            token: token,
            data: datas,
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

  // ! USER CREATION

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
      designation: request.body.designation,
      password: conformedPassword,
    };

    const destination = {
      Account_Id: `1234Cust_Labs_${collectionCount + 1}`,
      destination: [request.body.destination],
    };
    const existingMailId = await userSchema.findOne({
      email: userData.email,
    });
    if (existingMailId) {
      response.status(401).send({ error: "Email address is already in use" });
    } else {
      if (password === conformPassword) {
        try {
          const createData = await userSchema.create(userData);
          // const userAddresses = await destinationSchema.create(destination);
          const getData = await destinationSchema.find();
          console.log(
            `USER ACCOUNT CREATED SUCESSFULLY IN ID OF ${destination.Account_Id}`
          );
          console.log(Date());
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

  // ! USER CREATE DESTINATIONS.

  userCreateDestinations: async (request, response) => {
    const token = request.header("CL-X-TOKEN");
    const verifyToken = await library.tokenVerifier(token);
    const userId = verifyToken.payload.Account_Id;
    const user = await destinationSchema.findOne({ Account_Id: userId });
    console.log(userId);
    const { house, door, street } = request.body;
    if (user) {
      const updateDestiny = await destinationSchema.updateOne(
        { Account_Id: userId },
        {
          $push: {
            destination: {
              house: house,
              door: door,
              street: street,
            },
          },
        }
      );
      const getData = await destinationSchema.find();
      console.log(getData[0]);
      response.send(updateDestiny);
    } else {
      console.log("No user");
      const createDestination = await destinationSchema.create({
        Account_Id: userId,
        destination: [
          {
            house: house,
            door: door,
            street: street,
          },
        ],
      });

      response.status(200).send({
        message: "Destination created sucessfully",
        data: createDestination,
        status: true,
      });
    }
  },

  // ! USER LOGIN
  //! HERE USER CAN GET SOME OF THEIR OWN DATA FOR PROFILE DISPLAY (LOGIN DATA).

  loginUser: async (request, response) => {
    try {
      const { email, password } = request.body;
      const isMailVerified = await userSchema.findOne({ email: email });
      const isPasswordMatching = await bcrypt.compare(
        password,
        isMailVerified.password
      );
      if (!isMailVerified) {
        response.status(404).send({
          message: "E-Mail id doesn't match",
          status: false,
        });
      } else {
        if (isPasswordMatching) {
          const token = await library.tokenGenerator({
            Account_Id: isMailVerified.Account_Id,
            email: isMailVerified.email,
            designation: isMailVerified.designation,
          });
          const datas = {
            APP_id: isMailVerified.Account_Id,
            name: isMailVerified.username,
            email: isMailVerified.email,
            destination: isMailVerified.destination,
          };
          console.log(
            `USER ACCOUNT ${isMailVerified.Account_Id} LOGGED IN SUCCESSFULLY `
          );
          console.log(Date());
          response.status(200).send({
            message: "Login Successful",
            status: true,
            token: token,
            data: datas,
          });
        } else {
          response.status(401).send({
            message: "Unauthorized",
            status: false,
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
  //! ADMIN USED TO VIEW ALL USERDETAILS FOR REFERANCES.
  getAllUser: async (request, response) => {
    try {
      const getAllUsers = await userSchema.find();
      console.log(`USER ACCOUNT DETAILS CHECKED BY ADMIN`);
      console.log(Date());
      response.status(200).send({
        message: "Successful",
        status: true,
        data: getAllUsers,
      });
    } catch (error) {
      console.log(error);
      response.status(401).send({
        message: "Un Authorized",
        status: false,
      });
    }
  },

  // ! ADMIN USED TO DELETE THE SPECIFIC USER DATA USING USER ID.

  deleteUserById: async (request, response) => {
    try {
      const deleteUser = request.body.Account_Id;
      const deleteId = await userSchema.deleteOne({ Account_Id: deleteUser });
      const deleteDestination = await destinationSchema.deleteOne({
        Account_Id: deleteUser,
      });

      console.log(`USER ACCOUNT ${deleteUser} DELETED BY ADMIN`);
      console.log(Date());

      response.status(200).send({
        message: "User Deleted Successfully",
        status: true,
      });
      // }
    } catch (error) {
      console.log(error);
      response.status(401).send({
        message: "Problem on deleting data",
      });
    }
  },

  // ! INDIVIDUAL USER CAN EDIT HIS OWN USER DETAILS.

  editOwnData: async (request, response) => {
    const password = request.body.password;
    const conformPassword = request.body.conformPassword;
    const token = request.header("CL-X-TOKEN");
    const verifyToken = await library.tokenVerifier(token);
    const verifyUser = await userSchema.findOne(verifyToken.payload);
    console.log(verifyToken.payload.email);
    if (verifyUser) {
      let conformedPassword;
      if (password === conformPassword) {
        conformedPassword = await library.createPassword(password);
        const editedData = {
          Account_Id: verifyToken.payload.Account_Id,
          username: request.body.username,
          email: request.body.email,
          contact: request.body.contact,
          password: conformedPassword,
        };

        const editUserData = await userSchema.updateOne(
          { email: verifyToken.payload.email },
          { $set: editedData }
        );
        console.log(
          `USER ACCOUNT DETAILS OF ${editedData.Account_Id} EDITED BY USER`
        );
        console.log(Date());
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
  },

  // ! GET ALL USER DESTINATIONS

  getAllDestinations: async (request, response) => {
    try {
      const getDestinations = await destinationSchema.find();
      console.log(getDestinations.map((e) => console.log(e.address)));
      console.log(`ADMIN ${verifyUser.Account_Id} HAS NOTED ALL DESTINATION`);
      console.log(Date());
      response.status(200).send({
        message: "Successful",
        data: getDestinations,
        status: true,
      });
    } catch (error) {
      console.log(error);
      response.status(404).status({
        message: "not found",
        status: false,
      });
    }
  },
  editOwnDestinations: async (request, response) => {
    const { id } = request.params;
    const { house, door, street } = request.body;
    const token = request.header("CL-X-TOKEN");
    const tokendata = await library.tokenVerifier(token);
    const userId = tokendata.payload.Account_Id;
    console.log(userId);
    const getUserData = await destinationSchema.findOne({ Account_Id: userId });
    const filterData = getUserData.destination;
    const replaceData = filterData.splice(id, 1, {
      house: house,
      door: door,
      street: street,
    });
    const updateDestiny = await destinationSchema.updateOne(
      { Account_Id: userId },
      {
        $set: {
          destination: filterData,
        },
      }
    );
    response.send({
      message: "Destination data updated successfully",
      status: true,
      data: updateDestiny,
    });
  },
};

// updateOne(
//   { account_Id: 2, "destination.1": { $exists: true } },
//   { $set: { "destination.1.house": "new value", "destination.1.street": "new value" } }
// );
