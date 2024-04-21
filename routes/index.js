const loginRouter = require('./login');
const logoutRouter = require('./logout');
const signupRouter = require('./signup');
const onlineRouter = require('./online');
const allRouter = require('./all');
const awaitRouter = require('./await');
const restrictRouter = require('./restrict');
const addFriendRouter = require('./addFriend');
const messageRouter = require('./message');
const userhomeRouter = require('./userhome');
const settingRouter = require('./setting');
const helpRouter = require('./help');
const ideaRouter = require('./idea');
const siteRouter = require('./site');

function route(app) {

    app.use('/login', loginRouter);
    
    app.use('/logout', logoutRouter);

    app.use('/sign-up', signupRouter);

    app.use('/online', onlineRouter);

    app.use('/all', allRouter);

    app.use('/await', awaitRouter);

    app.use('/restrict', restrictRouter);

    app.use('/add-friend', addFriendRouter);

    app.use('/message', messageRouter);

    app.use('/userhome', userhomeRouter);

    app.use('/setting', settingRouter);

    app.use('/help', helpRouter);

    app.use('/idea', ideaRouter);

    app.use('/', siteRouter);
}

module.exports = route;
