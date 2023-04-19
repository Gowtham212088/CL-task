const users =  require('../router/userRegistration');

module.exports = function(app){
    app.use('/user',users)
}