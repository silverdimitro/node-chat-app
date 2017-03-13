var socket = io();
function scrollToBottom (){
//selectors
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');
//heights
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();
if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
  messages.scrollTop(scrollHeight);
}
}

socket.on('connect',function (){
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
    if (err) {
      alert(err);
        window.location.href = '/';
    }else {
      console.log('no error');
    }
  });
});

socket.on('disconnect',function (){
  console.log('disconnected from server');
});

socket.on('updateUserList',function (users) {
  var ol =jQuery('<ol></ol>');
  users.forEach(function (user){
    ol.append(jQuery('<li></li>').text(user));
      });
      jQuery('#users').html(ol);
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
scrollToBottom();
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
  scrollToBottom();
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
