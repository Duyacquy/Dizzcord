const User = require('../models/User')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class LoginController {

    // [GET] /login 
    show(req, res) {
        res.render('login', { layout: false });  
    }

}
module.exports = new LoginController;