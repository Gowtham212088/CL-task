const router = require("express").Router();
const user = require("../controller/controller");
router.post("/createUser", user.createUser);
router.post("/loginUser", user.loginUser);
router.get("/getAllUsers", user.getAllUser);
router.delete("/deleteUser", user.deleteUserById);
router.put("/editOwnData", user.editOwnData);

module.exports = router;
