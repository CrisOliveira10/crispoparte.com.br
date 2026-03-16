const pages = document.querySelectorAll(".page")

const next = document.getElementById("next")
const prev = document.getElementById("prev")

const sound = document.getElementById("sound")

let index = 0

function flipSound(){

sound.currentTime = 0
sound.play()

}

next.onclick = () => {

if(index < pages.length){

pages[index].classList.add("flip")

flipSound()

index++

}

}

prev.onclick = () => {

if(index > 0){

index--

pages[index].classList.remove("flip")

flipSound()

}

}