var socket = io();
socket.on('connect',function (){
  console.log('connected server');
});

socket.on('disconnect',function (){
  console.log('disconnected from server');
});

socket.on('newMessage',function (data) {
console.log('new message ',data);
var li = jQuery('<li></li>');
li.text(`${data.from} ${data.text}`);
jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();

  socket.emit('createMessage',{
    from:'user',
    text:jQuery('[name=message]').val()
  },function(){

  });
});
