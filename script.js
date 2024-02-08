let currentSong = new Audio();
let songs;

// Function to convert seconds to "mm:ss" format
function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5501/Project/Project-3/Songs");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1]);

        }
    }
    return songs;
}
const palyMusic = (track) => {
    let audio = new Audio("./Songs/" + track)
    currentSong.src = "./Songs/" + track;
    currentSong.play()
    play.src = "./Assets/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // Get the list of all the songs
    songs = await getSongs();

    //show all the songs  in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
      <img class="invert" src="./Assets/music.svg" alt="">
      <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Song Artist</div>
      </div>
      <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="./Assets/play.svg" alt="">
      </div></li>`;
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            palyMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
    //Attach an event listener to play and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./Assets/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "./Assets/play.svg"
        }
    })
    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        const totalDuration = !isNaN(currentSong.duration) ? currentSong.duration : 0;
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSecond(currentSong.currentTime)}
        :${secondsToMinutesSecond(totalDuration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //Add an event listener to selector
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    });

    //Add an event listener to hamburge
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add an event listener to close hamburge
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // add an event listener to previous
    previous.addEventListener("click", () => {
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            palyMusic(songs[index - 1])
        }
    })
    // add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            palyMusic(songs[index + 1])
        }
    })


}

main();