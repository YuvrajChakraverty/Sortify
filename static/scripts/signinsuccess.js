window.onload= function() {

    localStorage.setItem('name', document.getElementById('name').innerText);
    localStorage.setItem('fav', document.getElementById('nFav').innerText);
    localStorage.setItem('pl1', document.getElementById('nP1').innerText);
    localStorage.setItem('pl2', document.getElementById('nP2').innerText);
    localStorage.setItem('pl3', document.getElementById('nP3').innerText);

    if(localStorage.getItem('taskbar')===null){
        localStorage.setItem('taskbar',1);
    }
    if(localStorage.getItem('sort')===null){
        localStorage.setItem('sort',0);
    }
    if(localStorage.getItem('shuffle')===null){
        localStorage.setItem('shuffle',0);
    }

    window.location.replace('/home');
}