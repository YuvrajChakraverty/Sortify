window.onload= async function(){
    document.getElementById('form').action= '/feedback?id='+localStorage.getItem('id');
    const url_='https://sortify-1.herokuapp.com/getEmail?id='+localStorage.getItem('id');
    // const url_='http://localhost/getEmail?id='+localStorage.getItem('id');
    const mail=document.getElementById('email');
    mail.style.display='none';
    await fetch(url_).then(response => response.json()).then(res => {
        mail.value=res.email;
    });
    const name= document.getElementById('name');
    name.style.display='none';
    name.value= localStorage.getItem('name');
}
function char_check(textbox){
    document.getElementById('char_count').innerText= `${300 - textbox.value.length} characters remaining`;
}