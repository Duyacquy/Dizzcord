const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class MessageController {
    // [GET] /message
    async show(req, res) {
        if (req.isAuthenticated()) {

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
            const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            const notiMessage = "Ấn vào biểu tưởng tin nhắn để bắt đầu nói chuyện với bạn bè.";
            res.render('message', {notiMessage, user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), userNoti: mutipleMongooseToObject(userNoti), layout: false})
        } else {
            res.redirect('/login')
        }
    }

    // [POST] /message
    async shown(req, res) {
        const {idFriend} = req.body;
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

        const UserMessage = new Schema({
            isMessageType: {type: Boolean},
            content: {type: String},
            idSentUser: {type: String},
            idReceiveUser: {type: String},
            avatarSentUser: { type: String },
            avatarReceiveUser: { type: String },
            room: {type: String},
            isSentByCurrentUser: {type: Boolean}
        })

        const user = await User.findOne({id: req.user.id});

        const UserMessages = mongoose.models[`${user.id}-message`] || mongoose.model(`${user.id}-message`, UserMessage);
        let messages;
        if (user.id < idFriend) {
            messages = await UserMessages.find({room: `${user.id} chat with ${idFriend}`});
        } else {
            messages = await UserMessages.find({room: `${idFriend} chat with ${user.id}`});
        }

        await User.updateOne(
            { id: user.id },
            { $set: { status: "online" }}
        ) 
        const friendMessage = await User.findOne({id: idFriend});

        const AwaitFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);
        const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});

        const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
        const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

        res.render('message',{messages: mutipleMongooseToObject(messages), friendMessage: mongooseToObject(friendMessage), user: mongooseToObject(user), tabFriend: mutipleMongooseToObject(tabFriend), userNoti: mutipleMongooseToObject(userNoti), layout: false});
    }

    // [POST] /message/restrict
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
            
            res.redirect('/message');
        }
    }
}
module.exports = new MessageController;