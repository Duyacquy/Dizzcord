const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/User')
const { mongooseToObject } = require('../../util/mongoose')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class UserhomeController {

    // [GET] /userhome
    async show(req, res) {
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
            const userPost = mongoose.models[`${user.id}-userpost`] || mongoose.model(`${user.id}-userpost`, UserPost);

            const AwaitFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);
            const tabFriend = await AwaitFriend.find({relationship: "Bạn bè"});

            const NotiUser = mongoose.models[`${user.id}-noti`] || mongoose.model(`${user.id}-noti`, UserNoti);
            const userNoti = await NotiUser.find().sort({createAt: -1}).limit(10);

            const userpost = await userPost.find().sort({createAt: -1});

            if (userpost.length > 0) {
                res.render('userhome',{tabFriend: mutipleMongooseToObject(tabFriend), userpost: mutipleMongooseToObject(userpost), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            } else {
                const noPost = "Bạn chưa đăng bài viết nào cả.";
                res.render('userhome',{noPost, tabFriend: mutipleMongooseToObject(tabFriend), userpost: mutipleMongooseToObject(userpost), user: mongooseToObject(user), userNoti: mutipleMongooseToObject(userNoti), layout: false});
            }

        } else {
            res.redirect('/login');
        }
    }

    // [POST] /userhome
    async post(req, res) {
        const { status, userId } = req.body;
        const user = await User.findOne({id: userId});

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

        const AllFriend = mongoose.models[`${user.id}-friend`] || mongoose.model(`${user.id}-friend`, UserFriend);
        const userPost = mongoose.models[`${user.id}-userpost`] || mongoose.model(`${user.id}-userpost`, UserPost);

        const allFriend = await AllFriend.find({relationship: "Bạn bè"});
        allFriend.forEach(async element => {
            const friendPost = mongoose.models[`${element.id}-friendpost`] || mongoose.model(`${element.id}-friendpost`, UserPost);
            const newFriendPost = new friendPost({
                status: status,
                src: `/img/${req.file.filename}`,
                username: user.username,
                id: user.id,
                avatar: user.avatar,
                reaction: "fa-solid fa-thumbs-up outside",
                reactionTextClass: "post-friend__emoji",
                reactionText: "Thích"
            });

            await newFriendPost.save();
        });

        const newUserPost = new userPost({
            status: status,
            src: `/img/${req.file.filename}`,
            username: user.username,
            id: user.id,
            avatar: user.avatar
        });
        await newUserPost.save();
        res.redirect('/userhome');
    }
}

module.exports = new UserhomeController;
