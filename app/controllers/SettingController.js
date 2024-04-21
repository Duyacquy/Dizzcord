const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class SettingController {

    // [GET] /
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
       
            res.render('setting',{user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
        } else {
            res.redirect('/login');
        }
    }

    // [POST] /setting/changePassword

    async changePassword(req, res) {
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

        const { oldPassword, newPassword, confirmPassword, userId } = req.body;

        const user = await User.findOne({id: userId});

        const AwaitFriend = mongoose.models[`${userId}-friend`] || mongoose.model(`${userId}-friend`, UserFriend);
        const allFriend = await AwaitFriend.find({relationship: "Bạn bè"});

        const NotiUser = mongoose.models[`${userId}-noti`] || mongoose.model(`${userId}-noti`, UserNoti);
        const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

        if(oldPassword === '' || newPassword === '' || confirmPassword === '') {
            const errorChangePassword = "Vui lòng nhập đầy đủ thông tin.";
            res.render('setting', {errorChangePassword, user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
            return;
        }

        if (newPassword !== confirmPassword) {
            const errorChangePassword = "Mật khẩu xác nhận không khớp.";
            res.render('setting', {errorChangePassword, user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
            return;
        }

        if (oldPassword !== user.password) {
            const errorChangePassword = "Mật khẩu cũ không đúng.";
            res.render('setting', {errorChangePassword, user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
            return;
        } else {
            if (oldPassword === newPassword ) {
                const errorChangePassword = "Mật khẩu mới giống mật khẩu ban đầu.";
                res.render('setting', {errorChangePassword, user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
                return;
            } 
            if(newPassword.length < 8) {
                const errorChangePassword = 'Mật khẩu phải chứa ít nhất 8 kí tự.';
                res.render('setting', {errorChangePassword, user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), allFriend: mutipleMongooseToObject(allFriend), layout: false});
                return;
            } else {
                await User.updateOne(
                    { id: user.id },
                    { $set: { password: newPassword }}
                ) 
                await User.updateOne(
                    { id: user.id },
                    { $set: { status: "offline" }} 
                ) 
                res.redirect('/login');
                return;
            }       
        }
    }

    // [POST] /setting/changeAvatar
    async changeAvatar(req, res) {
        const { userId } = req.body;

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

        const user = await User.findOne({id: userId});

        const Friends = mongoose.models[`${userId}-friend`] || mongoose.model(`${userId}-friend`, UserFriend);
        const userPost = mongoose.models[`${userId}-userpost`] || mongoose.model(`${userId}-userpost`, UserPost);
        const friends = await Friends.find();

        for (const friend of friends) {
            var FriendEach = mongoose.models[`${friend.id}-friend`] || mongoose.model(`${friend.id}-friend`, UserFriend);
            var FriendPost = mongoose.models[`${friend.id}-friendpost`] || mongoose.model(`${friend.id}-friendpost`, UserPost);
            await FriendEach.updateMany(
                { id: userId },
                { $set: { avatar: `/img/${req.file.filename}`}}
            )
            await FriendPost.updateMany(
                { id: userId},
                { $set: { avatar: `/img/${req.file.filename}`}}
            )
        }

        await userPost.updateMany(
            { id: user.id },
            { $set: { avatar: `/img/${req.file.filename}` }}
        )

        await User.updateOne(
            { id: user.id },
            { $set: { avatar: `/img/${req.file.filename}` }}
        ) 
        res.redirect('/setting');
        return;
    }

    // [POST] /setting/restrict
    async restrict(req, res) {
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

            res.redirect('/setting');
        }
        return;
    }
}

module.exports = new SettingController;