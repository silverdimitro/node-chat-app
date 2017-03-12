const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');

  // socket.emit('newMessage',{
  //   from:'irfan',
  //   text:'hello there',
  //   createdAt:1234
  // });
  socket.on('createMessage',(data)=>{
    console.log('got createMessage from client with ',data);

    io.emit('newMessage',{
      from:data.from,
      text:data.text,
      createdAt: new Date().getTime()
    });

  });
  socket.on('disconnect',()=>{
    console.log('client disconnected');
  });
});

server.listen(port,()=>{
  console.log(`'server is runnig at '${port}`);
});
