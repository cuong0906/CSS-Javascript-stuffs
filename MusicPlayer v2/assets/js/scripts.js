const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    musicAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn= wrapper.querySelector(".play-pause"),
    prevBtn= wrapper.querySelector("#prev"),
    nextBtn= wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    repeatBtn = wrapper.querySelector("#repeat-plist"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close"),
    ulTag = wrapper.querySelector("ul"),
    seekTimeTooltip = progressArea.querySelector(".seek-time"),
    seekTimeLabel = progressArea.querySelector(".seek-time span");

let musicIndex = Math.floor((Math.random() * allMusic.length));

//create list according to the array length
for(let i = 0; i< allMusic.length; i++){
    //pass songs name, artist and image
    let liTag = `<li li-index="${i}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio src="assets/music/${allMusic[i].src}.mp3" class="${allMusic[i].src}"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);
    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () =>{
        let audioDuration = liAudioTag.duration;

        //update song total duration
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuartionTag.innerHTML = `${totalMin}:${totalSec}`;
        liAudioDuartionTag.setAttribute("time-duration",`${totalMin}:${totalSec}`);//set time-duration attr to be used
    });
}

window.addEventListener("load", () =>{
    seekTimeTooltip.style.display = "none";
    loadMusic(musicIndex);
    playingNow();
})

playPauseBtn.addEventListener("click",() =>{
    const isMusicPause = wrapper.classList.contains("play");
    isMusicPause ? pauseMusic() : playMusic();
    playingNow();
})

nextBtn.addEventListener("click", () =>{
    nextMusic();
})

prevBtn.addEventListener("click", () =>{
    prevMusic();
})

//Event::: update total time and current time on play
musicAudio.addEventListener("timeupdate", (e) =>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDurationTime = wrapper.querySelector(".duration");


    musicAudio.addEventListener("loadeddata", () =>{

        let audioDuration = musicAudio.duration;

        //update song total duration
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDurationTime.innerHTML = `${totalMin}:${totalSec}`;
    });
    
        //update playing song current time
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
})

progressArea.addEventListener("click", (e) =>{
    let progressWidthval = progressArea.clientWidth; // get width of progress bar
    let clickedOffsetX = e.offsetX; // get offsetX value
    let songDuration = musicAudio.duration; // get song total duration

    musicAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
    playMusic();
})

// on mousemove event to show tooltip current music
progressArea.addEventListener("mousemove", (e) => {
    
    let progressWidthval = progressArea.clientWidth; // get width of progress bar
    let moveOffsetX = e.offsetX;
    let songDuration = musicAudio.duration; // get song total duration
    let musicCurrent = (moveOffsetX / progressWidthval) * songDuration;
    
    seekTimeTooltip.style.display = "";
    seekTimeTooltip.style.left = `${moveOffsetX-15}px`; // show seek time label

    let currentMin = Math.floor(musicCurrent / 60);
    let currentSec = Math.floor(musicCurrent % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    seekTimeLabel.innerHTML= `${currentMin}:${currentSec}`;
})

//  on mouseleave event
progressArea.addEventListener("mouseleave", () =>{
    seekTimeTooltip.style.display = "none";
})

//Event::: repeat list 
repeatBtn.addEventListener("click", () =>{
    let getText = repeatBtn.innerText; //get innerText of icon
    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    }
})
//Event::: after song end 
musicAudio.addEventListener("ended", () =>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat": // simply play next song
            nextMusic();
            break;
        case "repeat_one": // repeat the current song
            musicAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": // shuffle song
            // generate random index of song between the max range of array length
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randomIndex = Math.floor((Math.random() * allMusic.length));
            }while(musicIndex == randomIndex); // this loop run until the next random number is not the same of current index
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})

//Event::: show music playlist
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");

})
//Event::: close music playlist
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
})

// play particular song on click

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        // remove playing class
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            // get time-duration attr value and show
            let audioDurationAttr = audioTag.getAttribute("time-duration");
            audioTag.innerText = audioDurationAttr;
        }    

        //if there is an li tag which li-index == musicIndex then add class playing now
        if(allLiTags[j].getAttribute("li-index")== musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        //add onclick attribute in all li
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length -1 ? musicIndex = 0 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    musicIndex--;
    musicIndex < 0 ? musicIndex = allMusic.length -1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function playMusic(){
    wrapper.classList.add("play");
    playPauseBtn.querySelector("i").innerText = "pause";
    musicAudio.play();
}

function pauseMusic(){
    wrapper.classList.remove("play");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    musicAudio.pause();
}

function loadMusic(index){
    musicName.innerText = allMusic[index].name;
    musicArtist.innerText = allMusic[index].artist;
    musicImg.src = `assets/img/${allMusic[index].img}.jpg`;
    musicAudio.src = `assets/music/${allMusic[index].src}.mp3`;
}

//play song on click in playlist
function clicked(ele){
    //get li index of particular clicked li tag
    let getLiIndex = ele.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that li index to music index
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
