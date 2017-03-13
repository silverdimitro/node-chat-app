const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {generateMessage,generateLocationMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');

  socket.on('join',(params,callback)=>{
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('name and room name are required');
    }
    socket.join(params.room);
    //socket.leave('the office fans');
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));

    callback();
  });
  socket.on('createMessage',(data,callback)=>{
    console.log('got createMessage from client with ',data);
    io.emit('newMessage',generateMessage(data.from,data.text));
    callback();
  });
  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('admin',coords.latitude, coords.longitude));
  });
  socket.on('disconnect',()=>{
    console.log('client disconnected');
    var user = users.removeUser(socket.id);
    if(user){

      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('admin',`${user.name} has left`));
    }
  });


});

server.listen(port,()=>{
  console.log(`'server is runnig at '${port}`);
});
