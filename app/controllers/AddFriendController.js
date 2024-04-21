const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class AddFriendController {

    // [GET] /addFriend
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

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});
            res.render('addfriend',{user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), userNoti: mutipleMongooseToObject(userNoti), layout: false});
        } else {
            res.redirect('/login');
        }
    }

    // [POST] /add-friend
    async searchAndBlock(req, res) {
        const { q, idFriend, id } = req.body;

        const friendSearch = await User.findOne({id: id});
        const user = await User.findOne({id: req.session.passport.user});

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
        const AwaitUser = mongoose.models[`${id}-friend`] || mongoose.model(`${id}-friend`, UserFriend);

        const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
        const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

        if (q === "restrict") {
            await AwaitFriend.updateOne(
                { id: idFriend },
                { $set: { relationship: "Đã chặn" }}
            )
            await AwaitUser.updateOne(
                { id: user.id},
                { $set: { relationship: "Bị chặn"}}
            )

            res.redirect('/add-friend');
        }

        if(friendSearch === null) {
            var notiNoSearch = "Không tìm thấy kết quả nào.";
            res.render('addFriend', {user: mongooseToObject(user), notiNoSearch, userNoti: mutipleMongooseToObject(userNoti), layout: false});
            return;
        }
        
        if(friendSearch.id === req.session.passport.user) {
            var notiSearchError = "Không thể gửi lời mời kết bạn cho bản thân!";
            res.render('addFriend', {user: mongooseToObject(user), notiSearchError, userNoti: mutipleMongooseToObject(userNoti), layout: false});
            return;
        }
 
        const idCheck = await AwaitFriend.findOne({id: friendSearch.id});

        if (idCheck) {
            if (idCheck.relationship === "Bị chặn") {
                var notiSearchError = "Bạn đã bị người bạn này đã chặn rồi.";
                res.render('addFriend', {user: mongooseToObject(user), notiSearchError, userNoti: mutipleMongooseToObject(userNoti), layout: false});
                return;
            }
            if (idCheck.relationship === "Đã chặn") {
                var notiSearchError = "Bạn đã từng chặn người bạn này rồi.";
                res.render('addFriend', {user: mongooseToObject(user), notiSearchError, userNoti: mutipleMongooseToObject(userNoti), layout: false});
                return;
            }
            var notiSearchError = "Bạn hoặc người này đã gửi lời mời kết bạn rồi.";
            res.render('addFriend', {user: mongooseToObject(user), notiSearchError, userNoti: mutipleMongooseToObject(userNoti), layout: false});
            return;
        } else {
            const sentNewFriend = new AwaitFriend({
                username: friendSearch.username,
                id: friendSearch.id,
                avatar: friendSearch.avatar,
                relationship: "Đang chờ xử lí",
                usersend: true
            });
            sentNewFriend.save();

            const receiveNewFriend = new AwaitUser({
                username: user.username,
                id: user.id,
                avatar: user.avatar,
                relationship: "Đang chờ xử lí",
                usersend: false
            });
            receiveNewFriend.save();
                
            var notiSucess = "Gửi lời mời kết bạn thành công.";

            const FriendNoti = mongoose.models[`${friendSearch.id}-noti`] || mongoose.model(`${friendSearch.id}-noti`, UserNoti);

            const receiveUserNoti  = new FriendNoti({
                username: user.username,
                id: user.id,
                avatar: user.avatar,
                noti: "đã gửi lời mời kết bạn"
            });
            await receiveUserNoti.save();

            res.render('addFriend', {user: mongooseToObject(user), notiSucess, userNoti: mutipleMongooseToObject(userNoti), layout: false});

            return;
        }

    }
    
}
module.exports = new AddFriendController;