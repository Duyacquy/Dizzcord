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

// Ẩn hiện phần ghi chú khi di chuột qua biểu tượng tin nhắn
document.addEventListener('DOMContentLoaded',function() {
  var icons = document.querySelectorAll('.fa-comment.tab ,.fa-ellipsis-vertical.tab');
  var noteInIcons = document.querySelectorAll('.fa-comment-note.tab , .fa-ellipsis-vertical-note.tab'); 
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

// Ẩn hiện nút "những mục khác" trong phần bạn bè
var optionFriend = document.querySelectorAll('.fa-ellipsis-vertical.tab');
var optionFriendTable = document.querySelectorAll('.fa-ellipsis-item');

optionFriend.forEach((res,i,arr) => {
  arr[i].onclick = () => {
    optionFriendTable[i].classList.toggle('hidden');
  }
})

optionFriendTable.forEach((res,i,arr) => {
  arr[i].onmouseleave = () => {
    if(!optionFriendTable[i].classList.contains('hidden')) {
      setTimeout(() => {
        optionFriendTable[i].classList.add('hidden');
      },200)    
    }
  }
}) 

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

// Search lọc người dùng
var searchBar  = document.querySelector('.tab-main__input');

searchBar.addEventListener('input', (e) => {
  var txtSearch = e.target.value.trim().toLowerCase();
  var friends = document.querySelectorAll('.tab-main__friends');
  
  friends.forEach(friend => {
    if (friend.innerText.toLowerCase().includes(txtSearch)) {
      friend.classList.remove('hidden');
    } else {
      friend.classList.add('hidden');
    }
  })
})

// Gửi request lên server rằng người dùng đã offline
window.addEventListener('beforeunload', function(event) {
  var idUser = document.querySelector('.option-table__item-id').textContent;
  var userId = idUser.slice(1);
  socket.emit('offline', userId);
});
