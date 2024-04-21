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

// Làm sáng phần "gửi lời mời kết bạn" khi focus vào ô input
var addFriendButton = document.querySelector('.add-friend__input');
var addFriendSend = document.querySelector('.add-friend__send');
var addFriendFindFriend = document.querySelector('.add-friend__find-friend');

addFriendButton.oninput = () => {
  if(addFriendButton.value.trim() === '') {
    addFriendSend.classList.remove('cin');
  }
  else addFriendSend.classList.add('cin');
}
addFriendButton.onfocus = () => {
  addFriendFindFriend.style.outline = '2px solid rgb(4,106,228,1)';
  addFriendButton.onblur = () => {
    addFriendFindFriend.style.outline = '';
  }
}

// Ẩn hiện phần bạn bè

var friendList = document.querySelector('.col-left-friend-list');
var friendButton = document.getElementById('col-left__item2');

friendButton.onclick = () => {
  friendList.classList.toggle('hidden');
  friendButton.classList.toggle('keep');
}

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

// Gửi request lên server rằng người dùng đã offline
window.addEventListener('beforeunload', function(event) {
  var idUser = document.querySelector('.option-table__item-id').textContent;
  var userId = idUser.slice(1);
  socket.emit('offline', userId);
});