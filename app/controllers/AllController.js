const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class AllController {

    // [GET] /all
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
                res.render('all',{noRequestFriend, allFriend: mutipleMongooseToObject(allFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                res.render('all', {allFriend: mutipleMongooseToObject(allFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }
        } else {
            res.redirect('/login');
        }
    }

    // [POST] /all
    async restrict(req, res) {
        const { q, idFriend } = req.body;
        if (q === "restrict") {
            const UserFriend = new Schema({
                username: {type: String},
                id : {type: String},
                avatar: {type: String},
                relationship: {type: String},
                usersend: {type: Boolean}
            })

            const user = await User.findOne({id: req.user.id});
            const AwaitFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);
            const AwaitUser = mongoose.models[`${idFriend}-friend`] || mongoose.model(`${idFriend}-friend`, UserFriend);

            await AwaitFriend.updateOne(
                { id: idFriend },
                { $set: { relationship: "Đã chặn" }}
            )
            await AwaitUser.updateOne(
                { id: user.id},
                { $set: { relationship: "Bị chặn"}}
            )
            
            res.redirect('/all');
        }
    }

}
module.exports = new AllController;