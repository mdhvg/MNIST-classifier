const canvas = document.getElementById("canvas")
const resetBt = document.getElementById("reset")
let pixels = document.querySelectorAll(".pixel")
let isDrawing = false
let pixelArray = []
let socket;

function makePixels() {
    let html = ""
    for (let i = 0; i < 28 * 28; i++) {
        let template = `<div class="pixel id_${i}"></div>`
        html += template
    }
    canvas.innerHTML = html;
    pixels = document.querySelectorAll(".pixel")
}

function connectSock() {
    socket = new WebSocket(`ws${window.location.href.substring(window.location.href.indexOf('p') + 1)}`)
    socket.onopen = s => {
        console.log("Ready ✨")
    }
}

function draw() {
    if (!isDrawing) return
    document.querySelector(".pixel:hover").style.backgroundColor = "white"
    pixels.forEach((pixel, index) => {
        if (pixel.style.backgroundColor === "white") {
            pixelArray[index] = 1
        } else {
            pixelArray[index] = 0
        }
    })
    socket.send(pixelArray)
}

function initFunctions() {
    makePixels()
    connectSock()
    document.addEventListener('dragstart', (e) => {
        e.preventDefault()
    })
    canvas.onmousedown = e => { isDrawing = true }
    canvas.onmouseup = e => { isDrawing = false }
    canvas.onmousemove = e => { draw() }
    resetBt.onclick = e => { pixels.forEach(pixel => { pixel.style.backgroundColor = "black" }) }
}

initFunctions()