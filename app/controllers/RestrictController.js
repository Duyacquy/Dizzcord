const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class RestrictController {

    // [GET] /restrict/
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

            const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});
            const restrictFriend = await AwaitFriend.find({relationship: "Đã chặn"});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            if(restrictFriend.length === 0) {
                const noRequestFirend = "Bạn chưa chặn một người nào cả.";
                res.render('restrict',{noRequestFirend, restrictFriend: mutipleMongooseToObject(restrictFriend), tabFriend: mutipleMongooseToObject(tabFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                res.render('restrict', {restrictFriend: mutipleMongooseToObject(restrictFriend), tabFriend: mutipleMongooseToObject(tabFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }
        } else {
            res.redirect('/login');
        }
    }

    // [POST] /restrict
    async unblockAndBlock(req, res) {
        const { q, idFriend } = req.body;
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

        if (q === "restrict") {
            await AwaitFriend.updateOne(
                { id: idFriend },
                { $set: { relationship: "Đã chặn" }}
            )
            await AwaitUser.updateOne(
                { id: user.id},
                { $set: { relationship: "Bị chặn"}}
            )

            res.redirect('/restrict');
        }

        if (q === "unblock") {

            await AwaitFriend.updateOne(
                { id: idFriend },
                { $set: { relationship: "Bạn bè" }}
            )
            await AwaitUser.updateOne(
                { id: user.id},
                { $set: { relationship: "Bạn bè"}}
            )

            res.redirect('/restrict');
        }
    }

}
module.exports = new RestrictController;