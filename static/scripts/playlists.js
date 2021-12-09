let n=[];
n[0]=localStorage.getItem('pl1');
n[1]=localStorage.getItem('pl2');
n[2]=localStorage.getItem('pl3');

window.onload=function() {
    
    for(let i=0;i<3;i++){
        if(n[i]>0){
            const p=i+1;
            const pID='p'+p;
            const play=document.getElementById(pID);
            if(n[i]>1){
                play.innerText=n[i]+' tracks';
            }
            else{
                play.innerText=n[i]+' track';
            }
            play.classList.remove('p');
            play.classList.add('p_');
            play.parentElement.style.pointerEvents='all';
            play.parentElement.parentElement.classList.add('enabled');
        }
    }

}