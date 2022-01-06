var artistNum=0;
var songs=localStorage.getItem('fav');


window.onload= async function(){
    
    // const url='https://sortify-1.herokuapp.com/favArtists';
    const url='http://localhost/favArtists';
        var artistData=[];
        
        await fetch(url)
            .then(response => response.json())
            .then(res => {
                artistData= res;
                artistNum=artistData.length;
        })
        .catch(error => console.error(error)) 

        const artists=document.getElementById("artists");

        for(let i=0; i<artistData.length; i++){
            var a = document.createElement('a');
            a.setAttribute('class','artist');
            var artist_name=artistData[i].name.replaceAll(" ","%20");
            a.href= "/artist/" + artist_name;
            var image= document.createElement('img');
            image.setAttribute('class','pic');
            image.src=artistData[i].url;
            var name=document.createTextNode(artistData[i].name);
            a.appendChild(image);
            a.appendChild(name);
            artists.appendChild(a);
        }

    const artist= document.getElementById('artists');
    const text1= document.getElementById('noArtists');
    if(artistNum==0) {
        text1.style.display='flex';
        artist.style.gridTemplateColumns='1fr';
    }

    const text2a= document.getElementById('a');
    const text2b= document.getElementById('b');
    const favSongs=document.getElementById('favSongs');
    if(songs==0) {
        text2a.style.display='block';
        text2b.style.display='none';
        favSongs.style.pointerEvents='none';
        favSongs.setAttribute('href','');
    }

    else{
        var word;
        text2a.style.display='none';
        if(songs>1){
            word='Songs';
        }
        else{
            word='Song';
        }
        text2b.innerText=songs+' Favorite '+word;
        text2b.style.display='block';
        favSongs.style.pointerEvents='auto';
        favSongs.setAttribute('href','/favorite-songs');
    }
}
