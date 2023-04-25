const router = require("express").Router();
const user = require("../controller/controller");
const userAuth = require("../middleware/userMiddleware");
/**
 * @api {POST} /user/createUser
 * @desc  User Registration API
 * @access public
 * **/
router.post("/createUser", user.createUser);
/**
 * @api {POST} /user/loginUser
 * @desc  User Login API
 * @access public
 * **/
router.post("/loginUser", user.loginUser);
/**
 * @api {PUT} /user/editOwnData (User can edit his own data if Auth token Exists)
 * @desc  User Login API
 * @access public
 * **/
router.put("/editOwnData", userAuth.verifyUserAuth, user.editOwnData);

/**
 * @api {POST} /user/editOwnDestini/:id (User can add destination if Auth token Exists)
 * ? DESC : HERE EVERY ACCOUNT HAS A MULTIPLE DESTINATIONS USING THIS API
 * ? WE CAN EDIT THE SPECIFIC DESTINATIONS AMOUNG THEM.
 * @access public
 * **/
router.put('/editOwnDestini/:id',userAuth.verifyUserAuth,user.editOwnDestinations)


/**
 * @api {POST} /user/createDestinations (User can add destination if Auth token Exists)
 * ? DESC :  HERE WE CAN ADD A NEW DESTINATIONS AND ALSO A ADDITIONAL ONE TOO.
 * @access public
 * **/
router.post(
  "/createDestinations",
  userAuth.verifyUserAuth,
  user.userCreateDestinations
);

module.exports = router;
