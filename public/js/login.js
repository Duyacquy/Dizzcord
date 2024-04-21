// Ẩn hiện phần mật khẩu

var eyeButton = document.querySelector('.fa-eye-slash');

eyeButton.onclick = () => {
  var password = document.getElementById('password');

  if(password.type === 'password') {
    password.type = 'text';
    eyeButton.classList.remove('fa-eye-slash');
    eyeButton.classList.add('fa-eye');
  }
  else {
    password.type = 'password';
    eyeButton.classList.remove('fa-eye');
    eyeButton.classList.add('fa-eye-slash');
  }
}

// Hiện outline khi focus vào input
var passwordInput = document.getElementById('password');

passwordInput.onfocus = () => {
  var passwordArea = document.querySelector('.password');
  passwordArea.style.outline = '2px solid rgb(4,106,228,1)';
}
passwordInput.onblur = () => {
  var passwordArea = document.querySelector('.password');
  passwordArea.style.outline = '1px solid black';
}

// Ẩn hiện lỗi khi đăng nhập sai

if(window.location.search.search('error') !== -1) {
  document.querySelector('.sign-in-error').classList.remove('hidden');
}
