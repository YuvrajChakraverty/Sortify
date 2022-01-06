window.onload =async function(){
        const url='https://sortify-1.herokuapp.com/artistsdata';
        // const url='http://localhost/artistsdata';
        var artistData=[];
        
        await fetch(url)
            .then(response => response.json())
            .then(res => {
                artistData= res;
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
}