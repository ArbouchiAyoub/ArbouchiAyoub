var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function (req, res) {
    res.end('Hellow World');
});

httpServer.listen(1272);

var io = require('socket.io').listen(httpServer);
var users = {};
io.sockets.on('connection', function (socket) {
    var messages = [];
    var history = 2;
    var me = false;
    console.log('Nouveau utilisateur');


    for (var k in users) {
        socket.emit('newuser', users[k]);
    }

    for (var k in messages) {
        socket.emit('newmsg', messags[k]);
    }

    /**
     * On a recue un message
     **/

    socket.on('newmsg', function (message) {
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        if (messages.length > history) {
            messages.shift();
        }
        io.sockets.emit('newmsg', message);
    })

    /**
     * Je me connect
     **/
    socket.on('login', function (user) {
        me = user;
        me.id = user.mail.replace('@', '-').replace('.', '-');
        me.avatar = 'https://gravatar.com/avatar/' + md5(user.mail) + '?s=50';
        socket.emit('logged');
        users[me.id] = me;
        io.sockets.emit('newusr', me);
    });

    /**
     * Je quitte le Chat
     **/

    socket.on('disconnect', function () {
        if (!me) {
            return false;
        }
        delete users[me.id];
        io.sockets.emit('disusr', me);
    })
});
