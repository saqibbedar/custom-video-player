// selectors
const video = document.querySelector(".bedar-video");
const volumeButton = document.querySelector(".volume-button");
const volumeRangeSlider = document.querySelector(".volume-range");
const turnOffVolumeButton = document.querySelector(".turn-off-volume");
const mainControlsWrapper = document.querySelector(".main-controls-wrapper");
const playBackSpeedOptions = document.querySelector(".options");
const pictureInPicture = document.querySelector(".pic-in-pic");
const viewFullScreen = document.querySelector(".view-full-screen");
const skipBackward = document.querySelector(".skip-backward");
const skipForward = document.querySelector(".skip-forward");
const playButton = document.querySelector(".play-btn"); 
const videoProgress = document.querySelector(".video-progress");
const mainPlayPauseButton = document.querySelector(".main-play-pause-button");
const currentVideoTime = document.querySelector(".currentTime");
const videoDuration = document.querySelector(".video-duration");

// check state
let isClicked = false;
let isMuted = false;
let timeoutId;

// responsiveProgress
videoProgress.onchange = ()=>{
    video.currentTime = videoProgress.value;
}

// get video duration
video.addEventListener('loadedmetadata', e => {
    videoProgress.max = e.target.duration;
    videoDuration.innerText = formatTime(e.target.duration);
});

// format video time
const formatTime = time => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;
    if(hours == 0){
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

// updateTime and set progressValue
video.addEventListener("timeupdate", (e)=>{
    let {currentTime, duration} = e.target;
    // let percent = (currentTime / duration) * 100;
    videoProgress.value = currentTime;
    currentVideoTime.innerText = formatTime(currentTime);
})

// get video current time onclick of videoProgress
videoProgress.addEventListener("click", e =>{
    let videoProgressWidth = video.clientWidth - `${18}px`;
    video.currentTime = (e.offsetX / videoProgressWidth) * video.duration;
})

// view full screen
const fullScreen = () => {
    var container = document.querySelector(".container");
    container.classList.toggle("full-screen");
    
    if (container.classList.contains("full-screen")) {
        viewFullScreen.innerHTML = `<svg height="100%" viewBox="0 0 36 36" width="100%"><g class="fullscreen-button-corner-2"><path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" id="ytp-id-233"></path></g><g class="fullscreen-button-corner-3"><path d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" id="ytp-id-234"></path></g><g class="fullscreen-button-corner-0"><path d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"></path></g><g class="fullscreen-button-corner-1"><path  d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"></path></g></svg>`;
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        viewFullScreen.innerHTML = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><g class="fullscreen-button-corner-0"><path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" ></path></g><g class="fullscreen-button-corner-1"><path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8"></path></g><g class="fullscreen-button-corner-2"></use><path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path></g><g class="fullscreen-button-corner-3"><path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" ></path></g></svg>`
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    }
  }  

// picture in picture
pictureInPicture.addEventListener("click", ()=>{
    video.requestPictureInPicture();
})

// handlers
const handleVolumeButton = ()=>{
    isMuted = !isMuted;
    if(isMuted){
        video.muted = true;
        turnOffVolumeButton.style.display = "block";
        volumeRangeSlider.value = 0; // set the slider value to 0 when the volume is muted
    }
    else{
        video.muted = false;
        turnOffVolumeButton.style.display = "none";
        volumeRangeSlider.value = video.volume; // update the slider value to match the video volume when the volume is unmuted
    }
}

// handleVolumeRangeSlider
const handleVolumeRangeSlider = (e)=>{
    video.volume = e.target.value;
    if(video.volume === 0){
        turnOffVolumeButton.style.display = "block";
    }
    else{
        turnOffVolumeButton.style.display = "none";
    }
}

// control visibility
const makeControlsVisible = () => {
    mainControlsWrapper.classList.remove("active");
    mainPlayPauseButton.classList.remove("active");
    clearTimeout(timeoutId); // clear the timeout when mouse enters
}

const makeControlsInvisible = () => {
    if (isClicked) { // only hide controls if video is playing
        timeoutId = setTimeout(() => {
            mainControlsWrapper.classList.add("active");
            mainPlayPauseButton.classList.add("active");
        }, 1500);
    }
}

// main Function 
const togglePlayPause = () => {
    isClicked = !isClicked; // toggle the boolean state onclick
    if (isClicked) {
        playButton.innerHTML = `<svg height="100%" viewBox="0 0 36 36" width="100%"><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-117"></path></svg>`;
        mainPlayPauseButton.innerHTML = playButton.innerHTML;
        video.play();
        video.classList.remove("filter"); // if video is playing the remove brightness of video
        makeControlsInvisible(); // hide controls after 1s
    } else {
        playButton.innerHTML = `<svg height="100%" viewBox="0 0 36 36" width="100%"><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-41"></path></svg>`;
        mainPlayPauseButton.innerHTML = playButton.innerHTML;
        video.pause();
        video.classList.add("filter"); // if vide is paused then make brightness of video a bit low
        makeControlsVisible(); // show controls when video is paused
    }
};

// Handle controls visibility on mouseEvents
mainControlsWrapper.addEventListener("mouseenter", ()=>{
    makeControlsVisible(); // show controls when video is paused
})
mainControlsWrapper.addEventListener("mouseleave", ()=>{
    makeControlsInvisible(); // hide controls after 1s
})

// playBackSpeed 
playBackSpeedOptions.querySelectorAll("li").forEach(option =>{
    option.addEventListener("click", ()=>{ 
        video.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
        playBackSpeedOptions.querySelector(".checked").classList.remove("checked");
        option.classList.add("checked")
    })
})

// If video gets completed then it should handle the playPause buttons
const handleVideoCompletion = ()=>{
    togglePlayPause();
}

// viewFullScreen on doubleClick
video.addEventListener("dblclick", ()=>{
    fullScreen()
})

//  skip backward to 5s
skipBackward.addEventListener("click", ()=>{
    video.currentTime -= 5;
})
// skip forward to 5s
skipForward.addEventListener("click", ()=>{
    video.currentTime += 5;
})

// events
volumeButton.addEventListener("click", handleVolumeButton);
playButton.addEventListener("click", togglePlayPause);
video.addEventListener("mouseenter", makeControlsVisible);
video.addEventListener("mouseleave", makeControlsInvisible);
video.addEventListener("ended", handleVideoCompletion);
volumeRangeSlider.addEventListener("input", handleVolumeRangeSlider);
viewFullScreen.addEventListener("click", fullScreen); // view fullScreen


// Responsive => adjust it when get free time

// const mediaQuery = window.matchMedia("(max-width: 767px)");

// mediaQuery.addEventListener("change", (mediaQuery)=>{
//     if(mediaQuery.matches){
        
//     }
// })