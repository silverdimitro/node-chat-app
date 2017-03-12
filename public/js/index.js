var socket = io();
socket.on('connect',function (){
  console.log('connected server');

  // socket.emit('createMessage',{
  //   from:'andrew',
  //   text:'this is example'
  // });
});

socket.on('disconnect',function (){
  console.log('disconnected from server');
});

socket.on('newMessage',function (data) {
  console.log('newMessage received ',data);
});
