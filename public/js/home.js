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


// Xuất hiện bảng icon khi hover vào nút like 
var likeButton = document.querySelectorAll('.post-friend__emoji--parent');
var iconBar = document.querySelectorAll('.post-friend__feedback--emoji');
var iconBarArea = document.querySelectorAll('.post-friend__feedback--like');

likeButton.forEach((ele,i) => {
  likeButton[i].onmouseenter = () => {
    var timeoutId = setTimeout(() => {
      iconBar[i].classList.remove('inactive')
      iconBar[i].classList.add('active');
    },1000)
    iconBarArea[i].onmouseleave = () => {
      clearTimeout(timeoutId);
      setTimeout(() => {
        iconBar[i].classList.remove('active');
        iconBar[i].classList.add('inactive');
      },500) 
    }
  }
})


// Đổi hiệu ứng nút Like trong các bài post
const likeAudio = document.createElement('audio');
likeAudio.src = '../audio/likeAudio.m4a';

var userName = document.querySelector('.option-table__item-name').textContent;
var userAvatar = document.querySelector('.option-table__item-avatar img').src;
var imagePost = document.querySelectorAll('.post-friend__content img');
var userId = document.querySelector('.option-table__item-id').textContent.slice(1);
var friendIds = document.querySelectorAll('.post-friend__time');
var friendAvatar = document.querySelectorAll('.post-friend__avatar img');

let likeSetTimeout = [];

function likeButtonEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  var textParentStyle = window.getComputedStyle(textParent[i].children[0]).getPropertyValue('color');
  var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
  var newIcon = '<i class="fa-solid fa-thumbs-up outside effect"></i>';
  
  likeAudio.play();
  if(textParentStyle === 'rgb(64, 128, 255)') {
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else if(textParentStyle === 'rgb(233, 235, 240)') {
    likeParent[i].children[0].parentElement.innerHTML = newIcon; 
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(64, 128, 255)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => {
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Thích vào 1 bài viết của bạn",
        feedback: "fa-solid fa-thumbs-up outside effect",
        feedbackTextClass: "post-friend__emoji blue",
        feedbackText: "Thích",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)  
  }
}

function likeEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  var textParentStyle = window.getComputedStyle(textParent[i].children[0]).getPropertyValue('color');
  
  likeAudio.play(); 
  if(textParentStyle === 'rgb(64, 128, 255)') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233 ,235 ,240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-thumbs-up outside effect"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;

    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(64, 128, 255)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => {
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Thích vào 1 bài viết của bạn",
        feedback: "fa-solid fa-thumbs-up outside effect",
        feedbackTextClass: "post-friend__emoji blue",
        feedbackText: "Thích",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }  
}

function heartEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  
  likeAudio.play();
  if(textParent[i].children[0].innerText === 'Yêu thích') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-heart outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;
    
    textParent[i].children[0].innerText = 'Yêu thích';
    textParent[i].children[0].style.color = 'rgb(252,42,44)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => { 
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Yêu thích vào 1 bài viết của bạn",
        feedback: "fa-solid fa-heart outside",
        feedbackTextClass: "post-friend__emoji pink",
        feedbackText: "Yêu thích",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }
}

function laughEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  
  likeAudio.play();
  if(textParent[i].children[0].innerText === 'Haha') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-face-laugh-squint outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;
    
    textParent[i].children[0].innerText = 'Haha';
    textParent[i].children[0].style.color = 'rgb(249,211,66,1)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => {
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Haha vào 1 bài viết của bạn",
        feedback: "fa-solid fa-face-laugh-squint outside",
        feedbackTextClass: "post-friend__emoji yellow",
        feedbackText: "Haha",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }
}

function sadEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  
  likeAudio.play();
  if(textParent[i].children[0].innerText === 'Buồn') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-face-sad-tear outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;
    
    textParent[i].children[0].innerText = 'Buồn';
    textParent[i].children[0].style.color = 'rgb(65,128,255,1)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => {
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Buồn vào 1 bài viết của bạn",
        feedback: "fa-solid fa-face-sad-tear outside",
        feedbackTextClass: "post-friend__emoji blue",
        feedbackText: "Buồn",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }
}

function surpriseEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  
  likeAudio.play();
  if(textParent[i].children[0].innerText === 'Wow') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-face-surprise outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;
    
    textParent[i].children[0].innerText = 'Wow';
    textParent[i].children[0].style.color = 'rgb(249,211,66,1)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => {
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Wow vào 1 bài viết của bạn",
        feedback: "fa-solid fa-face-surprise outside",
        feedbackTextClass: "post-friend__emoji yellow",
        feedbackText: "Wow",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }
}

function angryEffect(i) {
  var likeParent = document.querySelectorAll('.likeParentOutside');
  var textParent = document.querySelectorAll('.textParentOutside');
  
  likeAudio.play();
  if(textParent[i].children[0].innerText === 'Phẫn nộ') {
    var oldIcon = '<i class="fa-solid fa-thumbs-up outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = oldIcon;
    textParent[i].children[0].innerText = 'Thích';
    textParent[i].children[0].style.color = 'rgb(233, 235, 240)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);
    socket.emit('deleteEmoji', {
      userid: userId,
      feedback: "fa-solid fa-thumbs-up outside",
      feedbackTextClass: "post-friend__emoji",
      feedbackText: "Thích",
      imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
    })
  }
  else {
    var newIcon = '<i class="fa-solid fa-face-angry outside"></i>';
    likeParent[i].children[0].parentElement.innerHTML = newIcon;
    
    textParent[i].children[0].innerText = 'Phẫn nộ';
    textParent[i].children[0].style.color = 'rgb(220,8,27)';

    if(likeSetTimeout[i]) clearTimeout(likeSetTimeout[i]);

    likeSetTimeout[i] = setTimeout(() => { 
      var friendId = friendIds[i].textContent.slice(1);
      socket.emit('emoji', {
        username: userName,
        userid: userId,
        avatar: userAvatar,
        content: "đã thả Phẫn nộ vào 1 bài viết của bạn",
        feedback: "fa-solid fa-face-angry outside",
        feedbackTextClass: "post-friend__emoji red",
        feedbackText: "Phẫn nộ",
        receiveIdUser: friendId,
        imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, "")
      })
    }, 5000)
  }
}

var likeIcon = document.querySelectorAll('.fa-thumbs-up.inside');
var heartIcon = document.querySelectorAll('.fa-heart.inside');
var laughIcon = document.querySelectorAll('.fa-face-laugh-squint.inside');
var sadIcon = document.querySelectorAll('.fa-face-sad-tear.inside');
var surpriseIcon = document.querySelectorAll('.fa-face-surprise.inside');
var angryIcon = document.querySelectorAll('.fa-face-angry.inside');

for(var i = 0; i < likeIcon.length; i++) {
  (function(index) {
    likeButton[index].addEventListener('click', function() {
      likeButtonEffect(index);
    });
    likeIcon[index].addEventListener('click', function() {
      likeEffect(index);
    });
    heartIcon[index].addEventListener('click', function() {
      heartEffect(index);
    });
    laughIcon[index].addEventListener('click', function() {
      laughEffect(index);
    });
    sadIcon[index].addEventListener('click', function() {
      sadEffect(index);
    });
    surpriseIcon[index].addEventListener('click', function() {
      surpriseEffect(index);
    });
    angryIcon[index].addEventListener('click', function() {
      angryEffect(index);
    });
  })(i);
}

// Gửi comment cho của người dùng bình luận về 1 ảnh
var commentSentButton = document.querySelectorAll('.fa-paper-plane');
var inputValue = document.querySelectorAll('.send-message-input');

commentSentButton.forEach((button, i) => {
  button.onclick = () => {
    var contentInput = inputValue[i].value;
    if (contentInput.trim() !== '') {
      var friendId2 = friendIds[i].textContent.slice(1);
      if (userId < friendId2) {
        socket.emit('sentComment', {
          userName: userName,
          userid: userId,
          userAvatar: userAvatar.replace(/^http:\/\/localhost:3000/, ""),
          receiveIdUser: friendId2,
          receiveAvatarUser: friendAvatar[i].src.replace(/^http:\/\/localhost:3000/, ""),
          content: contentInput,
          imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, ""),
          room: `${userId[i]} chat with ${friendId2}`
        })
      } else {
        socket.emit('sentComment', {
          userName: userName,
          userid: userId,
          userAvatar: userAvatar.replace(/^http:\/\/localhost:3000/, ""),
          receiveIdUser: friendId2,
          receiveAvatarUser: friendAvatar[i].src.replace(/^http:\/\/localhost:3000/, ""),
          content: contentInput,
          imgPost: imagePost[i].src.replace(/^http:\/\/localhost:3000/, ""),
          room: `${friendId2} chat with ${userId}`
        })
      } 
      inputValue[i].value = '';
    }
  } 
}) 

// Ẩn hiện phần tạo bài viết 

var statusButton = document.querySelector('.status__button');
var deleteStatus = document.querySelector('.fa-circle-xmark');

statusButton.onclick = () => {
  var statusCreate = document.querySelector('.status__create');
  var backgroundStatusCreate = document.querySelector('.background-blur');
  statusCreate.style.display = 'flex';
  setTimeout(() => {
    statusCreate.style.opacity = '1';
    backgroundStatusCreate.style.display = 'block';
  },90)
}
deleteStatus.onclick = () => {
  var statusCreate = document.querySelector('.status__create');
  var backgroundStatusCreate = document.querySelector('.background-blur');
  statusCreate.style.display = 'none';
  setTimeout(() => {
    statusCreate.style.opacity = '0';
    backgroundStatusCreate.style.display = 'none';
  },90)
}

// Ẩn hiện phần comment
var commentArea = document.querySelectorAll('.send-message');
var commentButton = document.querySelectorAll('.post-friend__feedback--comment');
var containerElm = document.querySelector('.container-tab0');

commentButton.forEach((ele, i) => {
  commentButton[i].onclick = () => {
    if(commentArea[i].style.display === '' || commentArea[i].style.display === 'none') {
      commentArea[i].style.display = 'flex';
      containerElm.scrollTop += 90;
    }
    else {
      commentArea[i].style.display = 'none';
    }
  }
})
  

// Upload ảnh để đăng bài

function encodeImageFileAsURL(element, imageElement) {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    imageElement.src = reader.result;
  }
  reader.readAsDataURL(file);
}

document.getElementById('fileInput').onchange = (event) => {
  var imgParent = document.querySelector('.status__create-post');
  var img = document.querySelector('.status__create-image-posting');

  if (img) {
    imgParent.removeChild(img); 
  }

  var beforeChild = document.querySelector('.status__create-image'); 
  var newImg = document.createElement("img");
  newImg.classList.add('status__create-image-posting');
  newImg.src = "";
  imgParent.insertBefore(newImg, beforeChild);
  
  encodeImageFileAsURL(event.target, newImg);
};

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

//console.log(addFriendButton.style);



