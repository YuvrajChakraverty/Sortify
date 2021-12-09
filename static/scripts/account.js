window.onload = async function() {
    const del=document.getElementById('delete');
    del.addEventListener('click', confirm_del);
    document.getElementById('name').innerText=localStorage.getItem('name');
    document.getElementById('userid').innerText= 'User ID: '+localStorage.getItem('id');
    // const url_='https://sortify-1.herokuapp.com/getEmail?id='+localStorage.getItem('id');
    const url_='http://localhost/getEmail?id='+localStorage.getItem('id');
    const mail=document.getElementById('email');
    await fetch(url_).then(response => response.json()).then(res => {
        mail.innerText=res.email;
    });
} 

async function confirm_del() {
    const response=confirm("Are you sure you want to permanently delete your account?");
    if(response){
        // const url='https://sortify-1.herokuapp.com/deleteAccount?id='+localStorage.getItem('id');
        const url='http://localhost/deleteAccount?id='+localStorage.getItem('id');
        var status=0;
        await fetch(url).then(response => response.text()).then(res => status=res);
        if(status==1){
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('name');
            localStorage.removeItem('fav');
            localStorage.removeItem('pl1');
            localStorage.removeItem('pl2');
            localStorage.removeItem('pl3');
            localStorage.removeItem('taskbar');
            localStorage.removeItem('shuffle');
            localStorage.removeItem('sort');

            window.location.replace('/account-deleted');
        }
    }
}