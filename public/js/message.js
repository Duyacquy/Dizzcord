 // Ẩn hiện nút chuông thông báo và bảng nút account
 var notiElement = document.querySelector('.noti');
 var bellElement = document.querySelector('.fa-bell');
 var notiArea = document.querySelector('.notiArea');
 
 bellElement.onclick = function() {
   if(notiElement.style.opacity === '' || notiElement.style.opacity === '0') {
     notiElement.style.opacity = '1';
     setTimeout(() => {
       notiElement.style.display = 'block';
     },100)
   }
   else {
     notiElement.style.opacity = '0';
     setTimeout(() => {
       notiElement.style.display = 'none';
     },100)
   }
 }
 
 var accountIcon = document.querySelector('#account');
 var accountElement = document.querySelector('.option-table');
 var accountArea = document.querySelector('.accountArea');
 
 accountIcon.onclick = function() {
   if(accountElement.style.opacity === '1') {
     accountElement.style.opacity = '0';
     setTimeout(() => {
       accountElement.style.display = 'none';
     },100)
   }
   else {
     accountElement.style.opacity = '1';
     setTimeout(() => {
       accountElement.style.display = 'block';
     },100)
   }
 }
 
 document.onclick = function(event) {
   var targetElement = event.target;
   if(!notiArea.contains(targetElement) && notiElement.style.opacity === '1') {
     notiElement.style.opacity = '0';
     setTimeout(() => {
       notiElement.style.display = 'none';
     },100)
   }
   if(!accountArea.contains(targetElement) && accountElement.style.opacity === '1') {
     accountElement.style.opacity = '0';
     setTimeout(() => {
       accountElement.style.display = 'none';
     },100)
   }
 }
 
 // Thay đổi icon khi hover vào
 var signOutButton = document.querySelector('.option-table__button__signout');
 
 signOutButton.onmouseenter = () => {
   var oldSignOutIcon = document.querySelector('.fa-door-closed');
   var newSignOutHTML = '<i class="fa-solid fa-door-open"></i>';
   oldSignOutIcon.parentElement.innerHTML = newSignOutHTML;
   signOutButton.onmouseleave = () => {
     var newSignOutIcon = document.querySelector('.fa-door-open');
     var oldSignOutHTML = '<i class="fa-solid fa-door-closed"></i>';
     newSignOutIcon.parentElement.innerHTML = oldSignOutHTML;
   }
 }
 
 // Ẩn hiện phần bạn bè
 
 var friendList = document.querySelector('.col-left-friend-list');
 var friendButton = document.getElementById('col-left__item2');
 
 friendButton.onclick = () => {
    friendList.classList.toggle('hidden');
    friendButton.classList.toggle('keep');
 }

 // Chat box
var idUser = document.querySelector('.option-table__item-id').textContent;
var userId = idUser.slice(1);
var idFriend = document.querySelector('.message-friend__id').textContent;
var friendId = idFriend.slice(1);

var userAvatar = document.querySelector('.option-table__item-avatar img').src;
var friendAvatar = document.querySelector('.message-friend__avatar img').src;

if (userId < friendId) {
  socket.emit('joinRoom', `${userId} chat with ${friendId}`);
} else {
  socket.emit('joinRoom', `${friendId} chat with ${userId}`);
}

const messageInput = document.querySelector('.message-send__input');
const messageArea = document.querySelector('.message-send__area');

function scrollToBottom() {
  var chatBox = document.querySelector('.message-box');
  chatBox.scrollTop = chatBox.scrollHeight;
}

scrollToBottom();

messageArea.addEventListener('submit', (e) => {
  e.preventDefault();
  if (messageInput.value.trim()) {
    if (userId < friendId) {
      socket.emit('send message', {
        content: messageInput.value,
        idSentUser: userId,
        idReceiveUser: friendId,
        avatarSentUser: userAvatar,
        avatarReceiveUser: friendAvatar,
        room: `${userId} chat with ${friendId}`
      })
    } else {
      socket.emit('send message', {
        content: messageInput.value,
        idSentUser: userId,
        idReceiveUser: friendId,
        avatarSentUser: userAvatar,
        avatarReceiveUser: friendAvatar,
        room: `${friendId} chat with ${userId}`
      })
    } 
    messageInput.value = '';
  }
});

socket.on('chat message', (msg) => {
  if (msg.idSentUser === userId) {
    var messageSentBlock = document.createElement('div'); 
    messageSentBlock.classList.add('message-send');

    var messageSent = document.createElement('div');
    messageSent.textContent = msg.content;
    messageSent.classList.add('message-send__text');

    var avatar = document.createElement('div');
    avatar.classList.add('message-send__avatar');

    var imgSentBlock = document.createElement('img');
    imgSentBlock.src = `${userAvatar}`;
    avatar.appendChild(imgSentBlock);

    messageSentBlock.appendChild(messageSent);
    messageSentBlock.appendChild(avatar);

    var container = document.querySelector('.message-box');
    container.appendChild(messageSentBlock);
  } 
  if (msg.idSentUser === friendId) {
      var messageReceiveBlock = document.createElement('div'); 
      messageReceiveBlock.classList.add('message-receive');

      var messageReceive = document.createElement('div');
      messageReceive.textContent = msg.content;
      messageReceive.classList.add('message-receive__text');

      var avatar = document.createElement('div');
      avatar.classList.add('message-receive__avatar');

      var imgReceiveBlock = document.createElement('img');
      imgReceiveBlock.src = `${friendAvatar}`;
      avatar.appendChild(imgReceiveBlock);

      messageReceiveBlock.appendChild(avatar);
      messageReceiveBlock.appendChild(messageReceive);

      var container = document.querySelector('.message-box');
      container.appendChild(messageReceiveBlock);
  }
})

// Ẩn hiện phần ghi chú khi di chuột qua biểu tượng tin nhắn phần col-left
document.addEventListener('DOMContentLoaded',function() {
  var icons = document.querySelectorAll('.fa-comment.col ,.fa-ellipsis-vertical.col');
  var noteInIcons = document.querySelectorAll('.fa-comment-note.col , .fa-ellipsis-vertical-note.col'); 
  icons.forEach((element,index) => {
    element.onmouseenter = function() {
      noteInIcons[index].style.opacity = '1';
      var timeoutId = setTimeout(() => {
        noteInIcons[index].style.display = 'block';
      },150)
      element.onmouseleave = function() {
        clearTimeout(timeoutId);
        noteInIcons[index].style.opacity = '0';
        setTimeout(() => {
        noteInIcons[index].style.display = 'none';
        },150)
      }
    } 
  })
})

// Ẩn hiện phần setting trên phần bạn bè col-left
var optionFriendCol = document.querySelectorAll('.fa-ellipsis-vertical.col');
var optionFriendTableCol = document.querySelectorAll('.col-left-setting');

optionFriendCol.forEach((res,i,arr) => {
  arr[i].onclick = () => {
    optionFriendTableCol[i].classList.toggle('hidden');
  }
})

optionFriendTableCol.forEach((res,i,arr) => {
  arr[i].onmouseleave = () => {
    if(!optionFriendTableCol[i].classList.contains('hidden')) {
      setTimeout(() => {
        optionFriendTableCol[i].classList.add('hidden');
      },200)    
    }
  }
})

// Gửi request lên server rằng người dùng đã offline
window.addEventListener('beforeunload', function(event) {
  socket.emit('offline', userId);
});