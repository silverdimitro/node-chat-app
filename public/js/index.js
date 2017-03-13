var socket = io();
socket.on('connect',function (){
  console.log('connected server');
});

socket.on('disconnect',function (){
  console.log('disconnected from server');
});

socket.on('newMessage',function (data) {
  var formattedTime=moment(data.createdAt).format('h:mm a');

var template = jQuery('#message-template').html();
var html = Mustache.render(template,{
  text:data.text,
  from:data.from,
  createdAt:formattedTime
});
jQuery('#messages').append(html);
//
// var li = jQuery('<li></li>');
// li.text(`${data.from}: ${formattedTime}: ${data.text}`);
// jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function (message) {
  var formattedTime=moment(message.createdAt).format('h:mm a');
  var template=jQuery('#location-message-template').html();
  var html = Mustache.render(template,{
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  });
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">my current locaion</a>');
  // li.text(`${message.from}: ${formattedTime} `);
  // a.attr('href',message.url);
  // li.append(a);
  jQuery('#messages').append(html);

});
jQuery('#message-form').on('submit',function (e) {
  e.preventDefault();
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage',{
    from:'user',
    text:messageTextbox.val()
  },function(){
    messageTextbox.val('')
  });
});
var locationButton = jQuery('#send-location');
locationButton.on('click',function () {
  if(!navigator.geolocation){
    return alert('geolocation not  supported by your browser.');
  }
  locationButton.attr('disabled','disabled').text('sending location');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('send location');
  socket.emit('createLocationMessage', {
    latitude:position.coords.latitude,
    longitude:position.coords.longitude
  });
  },function () {
    locationButton.removeAttr('disabled').text('send location');

    alert('unable to fetch location');
  });
});
