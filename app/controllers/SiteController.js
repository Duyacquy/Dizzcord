const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class SiteController {
    async userHome(req, res) {
        if(req.isAuthenticated()) {
            const UserFriend = new Schema({
                username: {type: String},
                id : {type: String},
                avatar: {type: String},
                relationship: {type: String},
                usersend: {type: Boolean}
            })

            const UserPost = new Schema({ 
                username: {type: String},
                id : {type: String},
                avatar: {type: String},
                status: {type: String},
                src: {type: String},
                reaction: {type: String},
                reactionTextClass: {type: String},
                reactionText: {type: String},
                createAt: {type: Date, default: Date.now}
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

            const FriendPost = mongoose.models[`${user.id}-friendpost`] || mongoose.model(`${user.id}-friendpost`, UserPost);
            const friendPost = await FriendPost.find().sort({createAt: -1});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            if (friendPost.length > 0) {
                res.render('home',{user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), friendPost: mutipleMongooseToObject(friendPost), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                const noPost1 = "Chưa có bài đăng nào cả"
                const noPost2 = "Hãy kết bạn để xem bài viết của họ."
                res.render('home',{noPost1, noPost2, user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), friendPost: mutipleMongooseToObject(friendPost), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }

        } else {
            res.redirect('/login');
        }
    } 

    // [POST] /
    async block(req, res) {
        const { q, idFriend } = req.body;

        const UserFriend = new Schema({
            username: {type: String},
            id : {type: String},
            avatar: {type: String},
            relationship: {type: String},
            usersend: {type: Boolean}
        })

        const user = await User.findOne({id: req.user.id});

        if (q === "restrict") {
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

            res.redirect('/');
        }
    }
}

module.exports = new SiteController;