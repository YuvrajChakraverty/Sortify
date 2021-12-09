let passok=true;
let emailok=true;
let credChange=false;
var new_pass= 0;

window.onload= async function() {
  document.getElementById('name').value=localStorage.getItem('name');
  document.getElementById('id').value=localStorage.getItem('id');
  document.getElementById('id').style.display='none';
  document.getElementById('passChange').style.display='none';
  const msg= document.getElementById("alert").innerHTML;
  const message= document.getElementById("message");
  if(msg==1){
    message.style.visibility='visible';
  }
  // const url_='https://sortify-1.herokuapp.com/getEmail?id='+localStorage.getItem('id');
  const url_='http://localhost/getEmail?id='+localStorage.getItem('id');
  const mail=document.getElementById('email');
  await fetch(url_).then(response => response.json()).then(res => {
      mail.value=res.email;
  });
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

function newPass(pass){
  if(!new_pass){
    pass.value=null;
    document.getElementById('sh').style.visibility='visible';
    document.getElementById('passChange').value='11111111';
    new_pass=1;
  }
}

function pass_valid(pass) {
  let msg= document.getElementById('pw_msg');
  credChange=true;
  var re=  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!#$@%&?])[a-zA-Z0-9!#$@%&?]{8,20}$/;
  if(re.test(pass.value)) {
    msg.style.visibility="hidden";
    passok=true;
  }

  else {
    msg.style.visibility="visible";
    passok=false;
  }
  
  btnchange();
}

function email_valid(email) {
  let msg= document.getElementById('em_msg');
  credChange=true;
  var re= /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  if(re.test(email.value)) {
    msg.style.visibility= "hidden";
    emailok= true;
  }

  else{
    msg.style.visibility= "visible";
    emailok= false;
  }

  btnchange();
  
}

function namechange(){
    credChange=true;
    btnchange();
}

function btnchange() {
  let submit= document.getElementById('submit');
  if((passok)&&(emailok)&&(credChange))
  {
    submit.disabled=false;
  }
  else
  {
    submit.disabled=true;
  }
}