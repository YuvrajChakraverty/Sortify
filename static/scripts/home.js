window.onload= function(){
    time();
    setInterval(time, 1000);
    if(parseInt(localStorage.getItem('taskbar'))==0){
        document.getElementById('collapse').style.display='none';
        document.getElementById('dateTime').style.height='70px';
        document.getElementById('expand').style.display='block';
    }
}

var hourNow=25;
var changeHour=true;

const months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function time(){
    let now= new Date();

    let hours= now.getHours();
    
    if(hourNow!=hours){
        changeHour=true;
    }
    if(changeHour){

        changeHour=false;
        let greetWord='';
        
        if((hours>=0)&&(hours<5)){
            greetWord='Good evening, ';
        }
        else if((hours>=5)&&(hours<12)){
            greetWord='Good morning, ';
        }
        else if((hours>=12)&&(hours<18)){
            greetWord='Good afternoon, ';
        }
        else if((hours>=18)&&(hours<24)){
            greetWord='Good evening, ';
        }
        else{
            greetWord='Hi, ';
        }
        
        document.getElementById('greet').innerText=greetWord+localStorage.getItem('name');
    }

    hourNow=hours;
    let hour0='';
    if(hours<10){
        hour0='0'
    }
    let mins= now.getMinutes();
    let min0='';
    if(mins<10){
        min0='0'
    }
    let secs= now.getSeconds();
    let sec0='';
    if(secs<10){
        sec0='0'
    }

    let date= now.getDate();
    let mon= now.getMonth();
    let month= months[mon];
    let year= now.getFullYear();

    document.getElementById('time').innerText= hour0+ hours+':'+min0+ mins+':'+sec0+ secs;
    document.getElementById('date').innerText=date+' '+month+' '+year;


}

function expand(up){
    up.style.display='none';
    document.getElementById('dateTime').style.height='120px';
    document.getElementById('collapse').style.display='block';
    localStorage.setItem('taskbar','1');
}

function collapse(down){
    down.style.display='none';
    document.getElementById('dateTime').style.height='70px';
    document.getElementById('expand').style.display='block';
    localStorage.setItem('taskbar','0');
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.replace('/');
}