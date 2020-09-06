var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3000);
//express
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
//socket io
server.playerID = 1
io.on('connection', function (socket) {
    socket.on('chat', function(msg){
        io.emit('chat', msg);
    });
    socket.on('newPlayer',function(){
        server.playerID = server.playerID == 1 ? 2 : 1
        socket.player = {id: server.playerID};
        io.emit('newPlayer',getPlayer());
    });
    socket.on('sendPlayerData',function(id, action, args){
        io.emit('sendPlayerData',id, action, args);
    });
});

function getPlayer(){
    var players = [];
    var player;
    Object.keys(io.sockets.connected).forEach(function(socketID){
        player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return player;
}
// end of server.js
