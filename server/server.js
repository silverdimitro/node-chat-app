const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');

  socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

  socket.on('createMessage',(data,callback)=>{
    console.log('got createMessage from client with ',data);
    io.emit('newMessage',generateMessage(data.from,data.text));
    callback('from server');
  });
  socket.on('disconnect',()=>{
    console.log('client disconnected');
  });
});

server.listen(port,()=>{
  console.log(`'server is runnig at '${port}`);
});
