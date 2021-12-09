let passok=false;
let emailok=false;

window.onload= async function() {
  const msg= document.getElementById("alert").innerHTML;
  const message= document.getElementById("message");
  if(msg==1){
    message.style.visibility='visible';
  }
}

function hide() {
  const message= document.getElementById("message");
  message.style.visibility='hidden';
}

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

function email_valid(email) {
  let msg= document.getElementById('em_msg');

  var re= /^[a-z0-9._-]+@[a-z.-]+\.[a-z]{2,6}$/;
  if(re.test(email.value)) {
    msg.style.visibility= "hidden";
    emailok= true;
  }

  else{
    msg.style.visibility= "visible";
    emailok= false;
  }

  var checkbx= document.getElementById("checkbox");
  btnchange(checkbx);
  
}

function btnchange(checkbx) {
  let submit= document.getElementById('submit');
  if((checkbx.checked)&&(passok)&&(emailok))
  {
    submit.disabled=false;
  }
  else
  {
    submit.disabled=true;
  }
}
