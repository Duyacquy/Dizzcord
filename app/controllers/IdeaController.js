const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class IdeaController {

    // [GET] /idea
    async show(req, res) {
        if(req.isAuthenticated()) {
            const UserFriend = new Schema({
                username: {type: String},
                id : {type: String},
                avatar: {type: String},
                relationship: {type: String},
                usersend: {type: Boolean}
            })

            const UserNoti = new Schema({
                username: {type: String},
                id: {type: String},
                avatar: {type: String},
                noti: {type: String},
                createAt: {type: Date, default: Date.now}
            })

            const user = await User.findOne({id: req.user.id});
            await User.updateOne(
                { id: user.id },
                { $set: { status: "online" }}
            ) 

            const AwaitFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);
            const allFriend = await AwaitFriend.find({relationship: "Bạn bè"});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            if(allFriend.length === 0) {
                const noRequestFriend = "Bạn chưa có người bạn nào cả.";
                res.render('idea',{noRequestFriend, allFriend: mutipleMongooseToObject(allFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                res.render('idea', {allFriend: mutipleMongooseToObject(allFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }
        } else {
            res.redirect('/login');
        }
    }
}

module.exports = new IdeaController;