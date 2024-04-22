const http = require('http')
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const { Server } = require("socket.io")

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Schema = mongoose.Schema;

const route = require('./routes')
const db = require('./config/db')
const User = require('./app/models/User')

const app = express()
const port = 3000
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

db.connect();

app.use(session({
    secret: "sessionofdizzcord",
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({    
    extended: true
}))
app.use(express.json())

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('view engine','handlebars')
app.set('views', path.join(__dirname, 'views'))

route(app)

io.on('connection', (socket) => {
    socket.on('offline',async (a) => {
        const user = await User.findOne({id: a});
            await User.updateOne(
                { id: a },
                { $set: { status: "offline" }}
            )
    })
    socket.on('joinRoom', (room) => {
        socket.join(room);
    })
    
    const UserMessage = new Schema({
        isMessageType: { type: Boolean },
        content: { type: String },
        idSentUser: { type: String },
        idReceiveUser: { type: String },
        avatarSentUser: { type: String },
        avatarReceiveUser: { type: String },
        room: { type: String },
        isSentByCurrentUser: {type: Boolean}
    });

    socket.on('send message',async (data) => {
        const UserMessages = mongoose.models[`${data.idSentUser}-message`] || mongoose.model(`${data.idSentUser}-message`, UserMessage);
        const FriendMessages = mongoose.models[`${data.idReceiveUser}-message`] || mongoose.model(`${data.idReceiveUser}-message`, UserMessage);

        const friendMessage = new FriendMessages({
            isMessageType: true,
            content: data.content,
            idSentUser: data.idSentUser,
            idReceiveUser: data.idReceiveUser,
            avatarSentUser: data.avatarSentUser,
            avatarReceiveUser: data.avatarReceiveUser,
            room: data.room,
            isSentByCurrentUser: false
        })
        friendMessage.save();

        const userMessage = new UserMessages({
            isMessageType: true,
            content: data.content,
            idSentUser: data.idSentUser,
            idReceiveUser: data.idReceiveUser,
            avatarSentUser: data.avatarSentUser,
            avatarReceiveUser: data.avatarReceiveUser,
            room: data.room,
            isSentByCurrentUser: true
        })
        userMessage.save();

        io.to(data.room).emit('chat message', {
            content: data.content,
            idSentUser: data.idSentUser,
            idReceiveUser: data.idReceiveUser,
        });
    });

    const UserNoti = new Schema({
        username: {type: String},
        id: {type: String},
        avatar: {type: String},
        noti: {type: String},
        createAt: {type: Date, default: Date.now}
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

    socket.on('emoji',async (data) => {
        const NotiFriends = mongoose.models[`${data.receiveIdUser}-noti`] || mongoose.model(`${data.receiveIdUser}-noti`, UserNoti);
        const notiFriend = new NotiFriends({
            username: data.username,
            id: data.userid,
            avatar: data.avatar,
            noti: data.content,
        })
        notiFriend.save();

        const FriendPost = mongoose.models[`${data.userid}-friendpost`] || mongoose.model(`${data.userid}-friendpost`, UserPost);

        await FriendPost.updateOne(
            { src: data.imgPost },
            { $set: { 
                reaction: data.feedback,
                reactionTextClass: data.feedbackTextClass,
                reactionText: data.feedbackText
            } }
        )
    })

    socket.on('deleteEmoji',async (data) => {
        const FriendPost = mongoose.models[`${data.userid}-friendpost`] || mongoose.model(`${data.userid}-friendpost`, UserPost);
        await FriendPost.updateOne(
            { src: data.imgPost },
            { $set: { 
                reaction: data.feedback,
                reactionTextClass: data.feedbackTextClass,
                reactionText: data.feedbackText
            } }
        )
    })

    socket.on('sentComment',async (data) => {
        const UserMessages = mongoose.models[`${data.userid}-message`] || mongoose.model(`${data.userid}-message`, UserMessage);
        const FriendMessages = mongoose.models[`${data.receiveIdUser}-message`] || mongoose.model(`${data.receiveIdUser}-message`, UserMessage);
        const NotiFriends = mongoose.models[`${data.receiveIdUser}-noti`] || mongoose.model(`${data.receiveIdUser}-noti`, UserNoti);

        const commentImageFriend = new FriendMessages({
            isMessageType: false,
            content: data.imgPost,
            idSentUser: data.userid,
            idReceiveUser: data.receiveIdUser,
            avatarSentUser: data.userAvatar,
            avatarReceiveUser: data.receiveAvatarUser,
            room: data.room,
            isSentByCurrentUser: false
        })
        await commentImageFriend.save();

        const commentImageUser = new UserMessages({
            isMessageType: false,
            content: data.imgPost,
            idSentUser: data.userid,
            idReceiveUser: data.receiveIdUser,
            avatarSentUser: data.userAvatar,
            avatarReceiveUser: data.receiveAvatarUser,
            room: data.room,
            isSentByCurrentUser: true
        })
        await commentImageUser.save();
        
        const commentMessageFriend = new FriendMessages({
            isMessageType: true,
            content: data.content,
            idSentUser: data.userid,
            idReceiveUser: data.receiveIdUser,
            avatarSentUser: data.userAvatar,
            avatarReceiveUser: data.receiveAvatarUser,
            room: data.room,
            isSentByCurrentUser: false
        })
        await commentMessageFriend.save();

        const commentMessageUser = new UserMessages({
            isMessageType: true,
            content: data.content,
            idSentUser: data.userid,
            idReceiveUser: data.receiveIdUser,
            avatarSentUser: data.userAvatar,
            avatarReceiveUser: data.receiveAvatarUser,
            room: data.room,
            isSentByCurrentUser: true
        })
        await commentMessageUser.save();

        const notiFriend = new NotiFriends({
            username: data.userName,
            id: data.userid,
            avatar: data.userAvatar,
            noti: "đã bình luận 1 bài viết của bạn",
        })
        notiFriend.save();
    })
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});