const router = require("express").Router();
const user = require("../controller/controller");
const Auth = require("../middleware/adminMiddleware");
/**
 * @api {POST} /user/createAdmin
 * @desc  API For Create Admin .
 * @access public
 * **/
router.post("/createAdmin", user.createAdmin);
/**
 * @api {POST} /user/adminLogin
 * @desc  API For Login as a User.
 * @access public
 * **/
router.post("/adminLogin", user.adminLogin);
/**
 * @api {DELETE} /user/deleteUser
 * @desc  API For Deleting Single User (ADMIN AUTH, NOTE : User cannot DELETE his own account by this.)
 * @access public
 * **/
router.delete("/deleteUser", Auth.authAdminMiddleware, user.deleteUserById);
/**
 * @api {GET} /user/getAllUsers
 * @desc  API For Getting All User Details(Only If Admin Auth Token Exists )
 * @access public
 * **/
router.get("/getAllUsers", Auth.authAdminMiddleware, user.getAllUser);
/**
 * @api {POST} /user/getAllDestinations (User can add destination if Auth token Exists)
 * @desc  Getting all destinations
 * @access public
 * **/
router.get("/getAllDestinations",Auth.authAdminMiddleware,user.getAllDestinations)


module.exports = router;
