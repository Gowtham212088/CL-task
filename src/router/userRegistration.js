const router = require('express').Router();
const user = require('../controller/controller');
router.post('/createUser',user.createUser)
router.post('/loginUser',user.loginUser)

module.exports = router;