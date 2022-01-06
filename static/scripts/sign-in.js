if(document.cookie!=''){
  window.location.replace('/home');
}

window.onload= function() {
  const msg= document.getElementById("alert").innerHTML;
  const message= document.getElementById("message");

  if(msg==1){
    message.textContent="Account not Found !";
    message.style.visibility='visible';
  }

  if(msg==2){
    message.textContent="Incorrect Password !";
    message.style.visibility='visible';
  }

  
}

function change() {
    let sh= document.getElementById('sh');
    let password= document.getElementById('password');
    if(password.getAttribute("type")=="password")
     {password.setAttribute("type","text");
      sh.setAttribute("src","../static/imgs/icons/show_eye.png");}
    else
     {password.setAttribute("type","password");
     sh.setAttribute("src","../static/imgs/icons/hide_eye.png")}
     
}

function hide() {
  const message= document.getElementById("message");
  message.style.visibility='hidden';
}