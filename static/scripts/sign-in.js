window.onload= function() {
  const msg= document.getElementById("alert").innerHTML;
  if(msg==1){
    console.log("hello")
    alert("Account doesn't exist!");
  }
  if(msg==2){
    alert("Incorrect password!");
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