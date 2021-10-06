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