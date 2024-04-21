const User = require('../models/User')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class LogoutController {

    // [GET] /logout
    async show(req, res) {
        if(req.isAuthenticated()) {
            await User.updateOne(
                { id: req.user.id },
                { $set: { status: "offline" }}
            )
            req.logout(async function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.clearCookie(); // Xóa tất cả các cookie
                res.redirect('/login'); // Chuyển hướng người dùng đến trang đăng nhập
            });
        } else {
            res.redirect('/login');
        } 
    }

}
module.exports = new LogoutController;