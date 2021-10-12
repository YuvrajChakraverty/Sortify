const artist_name1= document.getElementById("artistname").innerHTML;
const artist_name2= artist_name1.replace(" ","%20");
const url= 'music/' + artist_name2;
console.log(url);

fetch(url)
.then(response => response.json())
.then(res => {
    res.data.forEach(element => {

        const song= document.createElement('li');
        const songname= document.createTextNode(element.name);
        song.appendChild(songname);
        document.ul.appendChild(song);
        console.log(element);
    });
})
.catch(error => console.error(error))