const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class AwaitController {

    // [GET] /await
    async show(req, res) {
        if(req.isAuthenticated()) {
            const user = await User.findOne({id: req.user.id});
            await User.updateOne(
                { id: user.id },
                { $set: { status: "online" }}
            ) 

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
    
            const AwaitFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);

            const awaitFriend = await AwaitFriend.find({relationship: "Đang chờ xử lí", usersend: false});
            const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            if(awaitFriend.length === 0) {
                const noRequestFirend = "Không có yêu cầu kết bạn nào đang chờ cả.";
                res.render('await',{noRequestFirend, tabFriend: mutipleMongooseToObject(tabFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                res.render('await',{awaitFriend: mutipleMongooseToObject(awaitFriend), tabFriend: mutipleMongooseToObject(tabFriend), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }

        } else {
            res.redirect('/login');
        }
    }
    
    // [POST] /await
    async addAndBlock(req, res) {
        const { button, q, idFriend } = req.body;

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

            res.redirect('/await')
        }

        if (button === "add") {

            await AwaitFriend.updateOne(
                {id: idFriend},
                { $set: {relationship: "Bạn bè"}}
            )
            await AwaitUser.updateOne(
                {id: user.id},
                { $set: {relationship: "Bạn bè"}}
            )
            
            const FriendNoti = mongoose.models[`${idFriend}-noti`] || mongoose.model(`${idFriend}-noti`, UserNoti);

            const receiveUserNoti  = new FriendNoti({
                username: user.username,
                id: user.id,
                avatar: user.avatar,
                noti: "đã chấp nhận lời mời kết bạn"
            });
            await receiveUserNoti.save();

            res.redirect('/await');
        }

        if (button === "delete") {

            await AwaitFriend.deleteOne({id: idFriend});
            await AwaitUser.deleteOne({id: user.id});

           res.redirect('/await');
        }
    }
}
module.exports = new AwaitController;