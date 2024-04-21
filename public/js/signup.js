// Hiện chú thích khi focus vào phần tử và phát hiện lỗi sai

var inputElement = document.querySelectorAll('input');

inputElement.forEach((element, index) => {
  var submitButton = document.querySelector('.submit-button-main');
  var inputValue = '';
  element.oninput = (event) => {
    inputValue = event.target.value;
  }
  element.onblur = (event) => {
    if(index === 0) {
      var userNameError = document.querySelector('.user-name-error');
      if(inputValue === '') {
        userNameError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  Bạn chưa nhập tên người dùng';
        element.style.outline = '1px solid red';
      }
      else {
        userNameError.innerHTML = '';
        element.style.outline = '1px solid black';
      }
    }
    
    if(index === 1) {
      var idError = document.querySelector('.id-error');
      inputValue.trim();
      if(inputValue === '') {
        idError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  Bạn chưa nhập ID';
        element.style.outline = '1px solid red';
      }
      else {
        for(var i=0; i < inputValue.length; i++) {
          var ok;
          if(inputValue[i] === ' ') {
            idError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  ID không chứa dấu cách';
            element.style.outline = '1px solid red';
            ok = false;
            break;
          }
          else ok = true;
        }
        if(ok) {
          idError.innerHTML = '';
          element.style.outline = '1px solid black';
        }   
      }
    }
    
    if(index === 2) {
      var passwordError = document.querySelector('.password-error');
      inputValue.trim();
      if(inputValue === '') {
        passwordError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  Bạn chưa nhập mật khẩu';
        element.style.outline = '1px solid red';
      }
      else if(inputValue.length < 8) {
        passwordError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  Mật khẩu phải chứa ít nhất 8 kí tự';
        element.style.outline = '1px solid red';
      }
      else {
        passwordError.innerHTML = '';
        element.style.outline = '1px solid black';
      }
    }
    
    if(index === 3) {
      var passwordInput = document.querySelector('.password-input');
      var confirmPasswordError = document.querySelector('.confirm-password-error');
      inputValue.trim();
      if(inputValue !== passwordInput.value.trim()) {
        confirmPasswordError.innerHTML = '<span><i class="fa-solid fa-triangle-exclamation"></i></span>  Mật khẩu xác nhận không khớp';
        element.style.outline = '1px solid red';
      }
      else {
        confirmPasswordError.innerHTML = '';
        element.style.outline = '1px solid black';
      }
    }
  } 
})