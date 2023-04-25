const library = require("../helper");
const userSchema = require("../model/userRegistrationModel");

module.exports = {
  verifyUserAuth: async (req, res, next) => {
    const authorisation = req.header("CL-X-TOKEN");
    if (!authorisation) {
      res.status(404).send("Un Authenticate");
    } else {
      const verifyToken = await library.tokenVerifier(authorisation);
      // const verifyUser = await userSchema.findOne({
      //   designation: verifyToken.payload.designation,
      // });
      // console.log(verifyToken);
      if (verifyToken.payload.designation !== "User") {
        res.send({
          message: "Un Authenticate",
          status: false,
        });
      } else {
        console.log(`${verifyToken.payload.Account_Id} AUTHORISED AS A USER`)
        next();
      }
    }
  },
};
