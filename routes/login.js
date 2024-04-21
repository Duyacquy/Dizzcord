const express = require('express')
const router = express.Router();

const loginController = require('../app/controllers/LoginController');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/User');

router.get('/', loginController.show)
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error'
}));

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password'
},async (id, password, done) => {

    const user = await User.findOne({ id, password });

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }   
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ id: id });

    if(user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
})

module.exports = router;