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

// Đổi tab trong phần setting
var changeAvatarTab = document.querySelector('.change-avatar');
var changePasswordTab = document.querySelector('.change-password');
var changeAvatarNavi = document.querySelector('.change-avatar-tab');
var changePasswordNavi = document.querySelector('.change-password-tab');

changeAvatarNavi.onclick = () => {
  if (!changeAvatarNavi.classList.contains('active')) {
    changeAvatarNavi.classList.add('active');
    changeAvatarTab.classList.remove('hidden');
    changePasswordNavi.classList.remove('active');
    changePasswordTab.classList.add('hidden');
  }
}

changePasswordNavi.onclick = () => {
  if (!changePasswordNavi.classList.contains('active')) {
    changePasswordNavi.classList.add('active');
    changePasswordTab.classList.remove('hidden');
    changeAvatarNavi.classList.remove('active');
    changeAvatarTab.classList.add('hidden');
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

// Ẩn hiện phần mật khẩu
var oldPasswordEye = document.querySelector('#old-password-eye');
var newPasswordEye = document.querySelector('#new-password-eye');
var confirmPasswordEye = document.querySelector('#confirm-password-eye');


oldPasswordEye.onclick = () => {
  var oldPassword = document.getElementById('old-password');

  if(oldPassword.type === 'password') {
    oldPassword.type = 'text';
    oldPasswordEye.classList.remove('fa-eye-slash');
    oldPasswordEye.classList.add('fa-eye');
  }
  else {
    oldPassword.type = 'password';
    oldPasswordEye.classList.remove('fa-eye');
    oldPasswordEye.classList.add('fa-eye-slash');
  }
}

newPasswordEye.onclick = () => {
  var newPassword = document.getElementById('new-password');

  if(newPassword.type === 'password') {
    newPassword.type = 'text';
    newPasswordEye.classList.remove('fa-eye-slash');
    newPasswordEye.classList.add('fa-eye');
  }
  else {
    newPassword.type = 'password';
    newPasswordEye.classList.remove('fa-eye');
    newPasswordEye.classList.add('fa-eye-slash');
  }
}

confirmPasswordEye.onclick = () => {
  var confirmPassword = document.getElementById('confirm-password');

  if(confirmPassword.type === 'password') {
    confirmPassword.type = 'text';
    confirmPasswordEye.classList.remove('fa-eye-slash');
    confirmPasswordEye.classList.add('fa-eye');
  }
  else {
    confirmPassword.type = 'password';
    confirmPasswordEye.classList.remove('fa-eye');
    confirmPasswordEye.classList.add('fa-eye-slash');
  }
}

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
  var imgParent = document.querySelector('.change-avatar-main');
  var img = document.querySelector('.image-change-avatar');

  if (img) {
    imgParent.removeChild(img); 
  }
  
  var beforeChild = document.querySelector('.label-change-avatar'); 
  var newImg = document.createElement("img");
  newImg.classList.add('image-change-avatar');
  newImg.src = "";
  imgParent.insertBefore(newImg, beforeChild);
  
  encodeImageFileAsURL(event.target, newImg);
};
