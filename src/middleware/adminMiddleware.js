const { builtinModules } = require("module");
const library = require("../helper");
const adminSchema = require("../model/adminSchema");

// ! AUTHORISATION MIDDLEWARE FOR ADMIN OPERATIONS

module.exports = {
  authAdminMiddleware: async (req, res, next) => {
    const authorisation = req.header("CL-X-TOKEN");
    if (!authorisation) {
      res.status(404).send("Un Authenticate");
    } else {
      const verifyToken = await library.tokenVerifier(authorisation);
      const verifyUser = await adminSchema.findOne({
        designation: verifyToken.payload.designation,
      });
      console.log();
      if (verifyToken.payload.designation !== "Admin") {
        res.send({
          message: "Un Authenticate",
          status: false,
        });
      } else {
        console.log(`${verifyToken.payload.Account_Id} AUTHORISED AS A ADMIN`)
        next();
      }
    }
  },
};
