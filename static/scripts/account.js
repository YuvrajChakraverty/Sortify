window.onload = async function() {
    const del=document.getElementById('delete');
    del.addEventListener('click', confirm_del);
    document.getElementById('name').innerText=localStorage.getItem('name');
<<<<<<< HEAD
    document.getElementById('userid').innerText= 'User ID: '+localStorage.getItem('id');
    const url_='https://sortify-1.herokuapp.com/getEmail?id='+localStorage.getItem('id');
    // const url_='http://localhost/getEmail?id='+localStorage.getItem('id');
=======
    // const url_='https://sortify-1.herokuapp.com/getEmail';
    const url_='http://localhost/getEmail';
>>>>>>> urlbranch
    const mail=document.getElementById('email');
    await fetch(url_).then(response => response.text()).then(res => {
        mail.innerText=res;
    });
    // const _url='https://sortify-1.herokuapp.com/getID';
    const _url='http://localhost/getID';
    const ID=document.getElementById('userid');
    await fetch(_url).then(response => response.text()).then(res => {
        ID.innerText= 'User ID: '+res;
    });
} 

async function confirm_del() {
    const response=confirm("Are you sure you want to permanently delete your account?");
    if(response){
<<<<<<< HEAD
        const url='https://sortify-1.herokuapp.com/deleteAccount?id='+localStorage.getItem('id');
        // const url='http://localhost/deleteAccount?id='+localStorage.getItem('id');
=======
        // const url='https://sortify-1.herokuapp.com/deleteAccount';
        const url='http://localhost/deleteAccount';
>>>>>>> urlbranch
        var status=0;
        await fetch(url).then(response => response.text()).then(res => status=res);
        if(status==1){
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