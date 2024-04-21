const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class OnlineController {

    // [GET] /online
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

            let onlineFriend;
            let onlineFriends = [];
            tabFriend.forEach(async (friend) => {
                onlineFriend = await User.findOne( {id: friend.id , status: "online"});   
    
                if(onlineFriend) {
                    onlineFriends.push(onlineFriend);
                } 
            }) 

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            if(onlineFriends.length === 0) {
                const noRequestFriend = "Không có người bạn nào đang online cả.";
                res.render('online',{noRequestFriend, user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                res.render('online',{user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), onlineFriends: mutipleMongooseToObject(onlineFriends),  userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }
        } else {
            res.redirect('/login');
        }
    }

    // [POST] /online
    async block(req, res) {
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
            
            res.redirect('/online');
            return;
        }
    }
}
module.exports = new OnlineController;