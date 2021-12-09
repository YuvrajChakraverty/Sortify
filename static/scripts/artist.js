var tracksarray=[];
let prev_track= 0;
let hide=1;
let fav=0;
taskbar=parseInt(localStorage.getItem('taskbar'));
shuffle=parseInt(localStorage.getItem('shuffle'));
var shuffleArray=[];

var url;

async function getData() {

    await fetch(url)
                .then(response => response.json())
                .then(res => {
                    tracksarray= tracksarray.concat(res);
                    tracksarray.sort(function(a, b){
                        let x = a.name.toLowerCase();
                        let y = b.name.toLowerCase();
                        if (x < y) {return -1;}
                        if (x > y) {return 1;}
                        return 0;
                      });
                })
                .catch(error => console.error(error))
}



window.onload= async function() {
    
    document.getElementById("artistimg").src=document.getElementById('pic_url').innerText;
    
    const artist__name=document.getElementById('artistname').innerText.replaceAll(' ','%20');
    url= 'https://sortify-1.herokuapp.com/tracksdata/' + artist__name;
    // url= 'http://localhost/tracksdata/' + artist__name;
    
    await getData();
    
    const url_='https://sortify-1.herokuapp.com/favArtists?id='+localStorage.getItem('id');
    // const url_='http://localhost/favArtists?id='+localStorage.getItem('id');
        
        await fetch(url_)
            .then(response => response.json())
            .then(res => {
                const n=document.getElementById('artistname').innerText;
                for(let i=0;i<res.length;i++){
                    if(n==res[i].name){
                        fav=1;
                        break;
                    }
                }
        })
        .catch(error => console.error(error))

    if(fav==1){
        document.getElementById('favArt').src='../static/imgs/icons/fav.png';
    }
    
    if(shuffle==1){
        document.getElementById('shuffle').src="../static/imgs/icons/shuffle.png";
        createShuffleArray(tracksarray.length);
    }
    if(taskbar==0){
        const elm=document.getElementById('collapse');
        collapse(elm);
    }

    document.getElementById("numtracks").innerText=tracksarray.length + " tracks";

    document.body.addEventListener('click', (evt) => {
        if(evt.target.parentElement.className!="options"){
            const opt=document.getElementById('options');
            opt.style.visibility='hidden';
        }
    }); 

    var ul= document.getElementById("tracks");

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
        var track_no;
        var t=i+1;
        if(i<9){
            track_no=document.createTextNode('0'+t+'. ');
        }
        else{
            track_no=document.createTextNode(t+'. ');
        }
        var track_=document.createElement('div');
        track_.setAttribute('class','track_name');
        var track_name=document.createTextNode(tracksarray[i].name);
        track_.appendChild(track_name);
        left.appendChild(track_no);
        left.appendChild(track_);

        //li>div1>right
        var right= document.createElement('div');
        right.setAttribute('class','right');
        right.appendChild(document.createTextNode(tracksarray[i].length));

        div1.appendChild(left);
        div1.appendChild(right);

        //li>div2>options
        var options= document.createElement('img');
        options.setAttribute('src','../static/imgs/icons/options.png');
        options.setAttribute('onclick', 'popup(this)');
        div2.appendChild(options);

                    
        // li.setAttribute("id", i);
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
        next_song_id= prev_track+1;
        if(prev_track==tracksarray.length-1)
        {
            next_song_id=0;
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
    var prev_song_id= prev_track-1;
    if(prev_track==0)
    {
        prev_song_id=0;
    }
    var current= document.getElementById(prev_song_id);
    playthis(current);
}

function favStatusChange(image) {
    var act=''
    const art=document.getElementById('artistname').innerText.replaceAll(' ','+');
    if(fav==0){
        image.src="../static/imgs/icons/fav.png";
        act='add';
        const _url= 'https://sortify-1.herokuapp.com/artFavStatusChange?art='+art+'&act='+act+'&id='+localStorage.getItem('id');
        // const _url= 'http://localhost/artFavStatusChange?art='+art+'&act='+act+'&id='+localStorage.getItem('id');
        fetch(_url);
        fav=1;
    }

    else if(fav==1){
        image.src="../static/imgs/icons/notfav.png";
        act='rem'
        const _url= 'https://sortify-1.herokuapp.com/artFavStatusChange?art='+art+'&act='+act+'&id='+localStorage.getItem('id');
        // const _url= 'http://localhost/artFavStatusChange?art='+art+'&act='+act+'&id='+localStorage.getItem('id');
        fetch(_url);
        fav=0;
    }
    else{
        console.log('Fav Status error');
    }
}

function shufflePlay(image){
    if(shuffle==0){
        image.src="../static/imgs/icons/shuffle.png";
        localStorage.setItem('shuffle',1);
        createShuffleArray(tracksarray.length);
        shuffle=1;
    }
    else if(shuffle==1){
        image.src="../static/imgs/icons/no-shuffle.png";
        localStorage.setItem('shuffle',0);
        shuffle=0;
    }
    else{
        console.log("error with shuffle value");
    }
}

function createShuffleArray(l){
    for(let i=0; i<l; i++){
        shuffleArray[i]=i;
    }
}

function popup(option) {
    const options= document.getElementById('options');
    const selected_song=document.getElementById('selected_song');
    var ID_= option.parentElement.parentElement.getElementsByClassName('track_info')[0].id;
    const selected= document.getElementById(ID_).getElementsByClassName('track_name')[0];
    selected_song.innerText=selected.innerText;
    const player= document.getElementById('player');
    if(player.style.visibility!='visible'){
        document.getElementById('options').style.bottom='10px';
    }
    
    options.style.visibility='visible';
}

async function add(elm) {
    var list='pl'+elm.innerText.replace('Add to Playlist ','');
    if(elm.innerText=='Add to Favorites'){
        list='fav';
    }
    var track=document.getElementById('selected_song').innerText.replaceAll(' ','+');
    const url_='https://sortify-1.herokuapp.com/addTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    // const url_='http://localhost/addTrack?list='+list+'&track='+track+'&id='+localStorage.getItem('id');
    var status= 0;
    await fetch(url_).then(response => response.text()).then(res => status=res);
    if(status==1){
        localStorage.setItem(list, parseInt(localStorage.getItem(list))+1);
    }
}

function collapse(collapse){
    localStorage.setItem('taskbar',0);
    document.getElementById('player').style.height='110px';
    document.getElementById('options').style.bottom='120px';
    collapse.style.display='none';
}