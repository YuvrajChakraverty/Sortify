var tracksarray=[];
let prev_track= 0;
let hide=1;
let popped=0;
let removed=[];
let largest=0;
let largeSame=true;
taskbar=parseInt(localStorage.getItem('taskbar'));
shuffle=parseInt(localStorage.getItem('shuffle'));
sort=parseInt(localStorage.getItem('sort'));
var shuffleArray=[];
const params= new URLSearchParams(window.location.search);
const playlist_num= params.get('playlist');


// const url= 'https://sortify-1.herokuapp.com/userTracks?list=pl'+playlist_num+'&id='+localStorage.getItem('id');
const url= 'http://localhost/userTracks?list=pl'+playlist_num+'&id='+localStorage.getItem('id');

async function getData() {

    await fetch(url)
                .then(response => response.json())
                .then(res => {
                    tracksarray= tracksarray.concat(res);
                    if(sort==1){
                        tracksarray.sort(function(a, b){
                            let x = a.name.toLowerCase();
                            let y = b.name.toLowerCase();
                            if (x < y) {return -1;}
                            if (x > y) {return 1;}
                            return 0;
                          });
                    }
                })
                .catch(error => console.error(error))
}



window.onload= async function() {

    await getData();

     
    var ul= document.getElementById("tracks");
    var numtracks= document.getElementById("num_tracks");
    var word=' tracks';
    if(tracksarray.length==1){
        word=' track'
    }
    numtracks.innerText= tracksarray.length + word;

    largest=tracksarray.length-1;

    if(sort==1){
        document.getElementById('sort').src="../static/imgs/icons/sorted.png";
    }
    if(shuffle==1){
        document.getElementById('shuffle').src="../static/imgs/icons/shuffle.png";
        createShuffleArray(tracksarray.length);
    }
    if(taskbar==0){
        const elm=document.getElementById('collapse');
        collapse(elm);
    }

    document.body.addEventListener('click', (evt) => {
        if(evt.target.parentElement.className!="options"){
            const opt=document.getElementById('options');
            opt.style.visibility='hidden';
        }
    }); 

    for(let i=0; i<tracksarray.length; i++) {
                    
        // li
        var li= document.createElement('li');
        // li>div1,div2
        var div1= document.createElement('div');
        var div2= document.createElement('div');
        div1.setAttribute("class", "track_info track_static");
        div1.setAttribute("onclick", "playthis(this)");
        div1.setAttribute("id", i);
        div2.setAttribute("class", "options");
        li.appendChild(div1);
        li.appendChild(div2);

        //li>div1>left
        var left= document.createElement('div');
        left.setAttribute('class','left');
        var track_num= document.createElement('div');
        track_num.setAttribute('class','track_no');
        var track_no;
        var t=i+1;
        if(i<9){
            track_no=document.createTextNode('0'+t+'. ');
        }
        else{
            track_no=document.createTextNode(t+'. ');
        }
        track_num.appendChild(track_no);
        var track_=document.createElement('div');
        track_.setAttribute('class','track_name');
        var track_name=document.createTextNode(tracksarray[i].name);
        track_.appendChild(track_name);
        left.appendChild(track_num);
        left.appendChild(track_);

        //li>div1>center
        var center= document.createElement('div');
        center.setAttribute('class','center');
        center.appendChild(document.createTextNode('- '+tracksarray[i].artist));

        //li>div1>right
        var right= document.createElement('div');
        right.setAttribute('class','right');
        right.appendChild(document.createTextNode(tracksarray[i].length));

        div1.appendChild(left);
        div1.appendChild(center);
        div1.appendChild(right);

        //li>div2>options
        var options= document.createElement('img');
        options.setAttribute('src','../static/imgs/icons/options.png');
        options.setAttribute('onclick', 'popup(this)');
        div2.appendChild(options);

                    
        li.setAttribute("class", "track");
        ul.appendChild(li);
    }

    const last= document.getElementById(tracksarray.length-1).parentElement;
    last.style.border="none";   
        
}

function playthis(track) {

    if(hide){
        const player= document.getElementById("player");
        player.style.visibility='visible';
        if(document.getElementById('collapse').style.display=='none'){
           document.getElementById('options').style.bottom='120px';
        }
        else{
           document.getElementById('options').style.bottom='160px';
        }
        hide=0;
    }
    
    const audio= document.getElementById("audio");
    const audiourl= document.getElementById("audiourl");
    const current_song= document.getElementById("current_song");
    const prev= document.getElementById(prev_track);
    const left= track.getElementsByClassName("left")[0];
    const song_name= left.innerText;
    const song= song_name.slice(4);
    prev.classList.remove("track_playing");
    prev.classList.add("track_static");
    for(let i=0; i<tracksarray.length; i++) {
        if(tracksarray[i].name==song) {
            audiourl.src= tracksarray[i].url;
            current_song.innerText= tracksarray[i].name + " - " + tracksarray[i].artist;
            prev_track= i;
            if((shuffle==1)&&(shuffleArray.includes(i))){
                var ind= shuffleArray.indexOf(i);
                shuffleArray.splice(ind,1);
                if(shuffleArray.length==0){
                    createShuffleArray(tracksarray.length);
                }
            }
            break;
        }
    }
    audio.load();
    audio.play();
    track.classList.remove("track_static");
    track.classList.add("track_playing");
    
}


function next() {
    var next_song_id;
    if(shuffle==0){
        next_song_id= prev_track;
        for(let i=prev_track+1;i<tracksarray.length;i++){
            if(removed.includes(i)==false){
                next_song_id=i;
                break;
            }
        }
        if(next_song_id==prev_track){
            for(let i=0;i<tracksarray.length;i++){
                if(removed.includes(i)==false){
                    next_song_id=i;
                    break;
                }
            }
        }
    }
    else{
        var random= Math.floor(Math.random() * shuffleArray.length);
        next_song_id= shuffleArray[random];
        shuffleArray.splice(random,1);
        if(shuffleArray.length==0){
            createShuffleArray(tracksarray.length);
        }
    }
    var current= document.getElementById(next_song_id);
    playthis(current);
}

function prev() {
    var prev_song_id=prev_track;
    for(let i=prev_track-1;i>=0;i--){
        if(removed.includes(i)==false){
            prev_song_id=i;
            break;
        }
    }
    var current= document.getElementById(prev_song_id);
    playthis(current);
}

function sortList(){
    if(sort==0){
        localStorage.setItem('sort',1);
    }
    else if(sort==1){
        localStorage.setItem('sort',0);
    }
    else{
        console.log("error with sorted value")
    }
    location.reload();
}

function shufflePlay(image){
    if(shuffle==0){
        image.src="../static/imgs/icons/shuffle.png";
        createShuffleArray(tracksarray.length);
        localStorage.setItem('shuffle',1);
        shuffle=1;
    }
    else if(shuffle==1){
        image.src="../static/imgs/icons/no-shuffle.png";
        localStorage.setItem('shuffle',0);
        shuffle=0;
    }
    else{
        console.log("error with shuffle value")
    }
}

function createShuffleArray(l){
    var k=0;
    for(let i=0; i<l;i++){
        if(removed.includes(i)==false){
            shuffleArray[k]=i;
            k++;
        }
    }
}

function popup(option) {
    const options= document.getElementById('options');
    const selected_song=document.getElementById('selected_song');
    var ID_= option.parentElement.parentElement.getElementsByClassName('track_info')[0].id;
    popped= parseInt(ID_);
    const selected= document.getElementById(ID_).getElementsByClassName('track_name')[0];
    selected_song.innerText=selected.innerText;
    document.getElementById('selected_song_artist').innerText=document.getElementById(ID_).getElementsByClassName('center')[0].innerText
    const player= document.getElementById('player');
    if(player.style.visibility!='visible'){
        document.getElementById('options').style.bottom='10px';
    }
    
    options.style.visibility='visible';
}

async function add() {
    const list='fav';
    var track=document.getElementById('selected_song').innerText.replaceAll(' ','+');
    // const url_='https://sortify-1.herokuapp.com/addTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    const url_='http://localhost/addTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    var status= 0;
    await fetch(url_).then(response => response.text()).then(res => status=res);
    if(status==1){
        localStorage.setItem(list, parseInt(localStorage.getItem(list))+1);
    }
}

async function remove() {
    const list='pl'+playlist_num;
    var track=document.getElementById('selected_song').innerText.replaceAll(' ','+');
    // const url_='https://sortify-1.herokuapp.com/removeTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    const url_='http://localhost/removeTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    var status= 0;
    await fetch(url_).then(response => response.text()).then(res => status=res);
    if(status==1){
        document.getElementById(popped).parentElement.style.display='none';

        removed.push(popped);

        localStorage.setItem(list, parseInt(localStorage.getItem(list))-1);
        if(tracksarray.length==removed.length){
            window.location.replace('/playlists');
        }

        if(shuffle==1){
            if(shuffleArray.includes(popped)){
                const ind= shuffleArray.indexOf(popped);
                shuffleArray.splice(ind, 1);
                if(shuffleArray.length==0){
                    createShuffleArray(tracksarray.length);
                }
            }
        }

        var word=' tracks';
        if(parseInt(localStorage.getItem(list))==1){
            word=' track';
        }
        document.getElementById('num_tracks').innerText=localStorage.getItem(list)+word;

        largeSame=true;

        for(let i=popped+1;i<tracksarray.length;i++){
            if(removed.includes(i)==false){
                largest=i;
                largeSame=false;
                const trackNameElm= document.getElementById(i).getElementsByClassName("track_no")[0];
                var numChar= trackNameElm.innerText.replace('. ','');
                var num=parseInt(numChar);
                num=num-1;
                var newNumChar=num.toString();
                if(num<10){
                    newNumChar='0'+newNumChar;
                }
                trackNameElm.innerText=newNumChar+'. ';
            }
        }
        if(largeSame){
            largest=largest-1;
        }
        document.getElementById(largest).parentElement.style.border="none";
    }
}

function collapse(collapse){
    localStorage.setItem('taskbar',0);
    document.getElementById('player').style.height='110px';
    document.getElementById('options').style.bottom='120px';
    collapse.style.display='none';
}