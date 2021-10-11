function ppchange(ppicon) {
    const play_song="../static/imgs/icons/playsong.png";
    const pause_song="../static/imgs/icons/pause.png";
    var run=true;
    var source= ppicon.src;

    if(source.localeCompare(pause_song)!=0)
     {
      ppicon.src = pause_song;
      run=false;
    } 
    // else{
    //     alert("bc");
    //   ppicon.src = play_song;
    // }
    if((source.localeCompare(play_song)!=0)&&(run))
    {
     ppicon.src = play_song;
   } 
}