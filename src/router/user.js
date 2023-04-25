const users =  require('../router/userRegistration');
const admin = require('../router/adminRouter')
module.exports = function(app){
    app.use('/user',users)
    app.use('/admin',admin)
}