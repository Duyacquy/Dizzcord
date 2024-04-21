const User = require('../models/User')
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SignupController {
    show(req, res) {
        res.render('signup', { layout: false });
    }

    async submit(req, res) {
        const { username , id , password , confirmPassword } = req.body; 

        if(username === '' || id === '' || password === '' || confirmPassword === '') {
            res.render('signup', { errorMessage: 'Vui lòng nhập đầy đủ thông tin.', layout: false });
            return;
        }

        for(var i = 0; i < id.length; i++) {
            if(id[i] === ' ') {
                var idError = 'ID không chứa dấu cách.';
                res.render('signup', { idError, layout: false}); 
                return;
            }
        }

        if(password.length < 8) {
            const passwordError = 'Mật khẩu phải chứa ít nhất 8 kí tự.';
            res.render('signup', { passwordError, layout: false});
            return;
        }

        if(password !== confirmPassword) {
            const confirmPasswordError = 'Mật khẩu xác nhận không khớp.';
            res.render('signup', { confirmPasswordError, layout: false});
            return;
        }

        const idUser = await User.findOne({id});
        if(idUser) {
            var idError = 'ID đã có người đặt, vui lòng đặt ID khác.';
            res.render('signup', { idError, layout: false});
            return;
        }
        
        const newUser = new User(req.body);
        newUser.avatar = '/img/avatar-trang.jpg';
        newUser.status = 'online';
        await newUser.save();

        res.redirect('/'); 
        return;
    }
}

module.exports = new SignupController;