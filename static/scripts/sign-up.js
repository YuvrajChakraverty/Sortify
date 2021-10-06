let passok=false;

function change(eye) {
  let password= document.getElementById('password');
  if(password.type=="password")
  {password.type="text";
  eye.src="../static/imgs/icons/show_eye.png";}
  else
  {password.type="password";
  eye.src="../static/imgs/icons/hide_eye.png";}
  
}

function pass_valid(pass) {
  let msg= document.getElementById('pw_msg');
  
  var re=  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!#$@%&?])[a-zA-Z0-9!#$@%&?]{8,20}$/;
  if(re.test(pass.value)) {
    msg.style.visibility="hidden";
    passok=true;
  }

  else {
    msg.style.visibility="visible";
    passok=false;
  }
  
  var checkbx= document.getElementById("checkbox");
  btnchange(checkbx);
}

function btnchange(checkbx) {
  let submit= document.getElementById('submit');
  if((checkbx.checked)&&(passok))
  {
    submit.disabled=false;
  }
  else
  {
    submit.disabled=true;
  }
}
