let tracksarray= [];
let prev_track= 0;

window.onload= function() {
    var ul= document.getElementById("tracks");
    var dp= document.getElementById("artistimg");
    var numtracks= document.getElementById("numtracks");
    if(document.getElementById("artistname")!=null) {

        const artist_name1= document.getElementById("artistname").innerHTML;
        const artist_name2= artist_name1.replace(" ","%20");
        // const url1= 'http://localhost/artistdp/' + artist_name2;
        // const url2= 'http://localhost/tracksdata/' + artist_name2;
        const url1= 'https://sortify-1.herokuapp.com/artistdp/' + artist_name2;
        const url2= 'https://sortify-1.herokuapp.com/tracksdata/' + artist_name2;

        fetch(url1)
            .then(response => response.json())
            .then(res => {
                dp.src= res.url;
        })
        .catch(error => console.error(error))
        
        fetch(url2)
            .then(response => response.json())
            .then(res => {
                tracksarray= tracksarray.concat(res);
                numtracks.innerText= res.length + " tracks";

                for(let i=0; i<res.length; i++) {
                    var li= document.createElement('li');
                    li.appendChild(document.createTextNode(res[i].name));
                    li.setAttribute("id", i);
                    li.setAttribute("class", "track");
                    li.setAttribute("onclick", "playthis(this)");
                    ul.appendChild(li);

                }
        })
        .catch(error => console.error(error))
    }

}

function playthis(track) {
    const audio= document.getElementById("audio");
    const audiourl= document.getElementById("audiourl");
    const current_song= document.getElementById("current_song");
    const prev= document.getElementById(prev_track);
    prev.classList.remove("track_playing");
    prev.classList.add("track");
    prev.style.fontWeight= "normal";
    for(let i=0; i<tracksarray.length; i++) {
        if(tracksarray[i].name==track.innerHTML) {
            audiourl.src= tracksarray[i].url;
            current_song.innerText= tracksarray[i].name + " - " + tracksarray[i].artist;
            prev_track= i;
            break;
        }
    }
    audio.load();
    audio.play();
    track.classList.remove("track");
    track.classList.add("track_playing");
    track.style.fontWeight= "bold";
    
}


function next() {
    var next_song_id= prev_track+1;
    if(prev_track==tracksarray.length-1)
    {
        next_song_id=0;
    }
    var current= document.getElementById(next_song_id);
    playthis(current);
}
