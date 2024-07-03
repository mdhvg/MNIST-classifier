const canvas = document.getElementById("canvas")
const resetBt = document.getElementById("reset")
let pixels = document.querySelectorAll(".pixel")
let root = document.documentElement;
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
    socket.onmessage = m => {
        try {
            let predictions = JSON.parse(m.data)
            let minValue = Math.min(...predictions)
            predictions.forEach((prediction, index) => {
                predictions[index] += minValue;
            })
            let maxValue = Math.max(...predictions)
            for (let i = 0; i < predictions.length; i++) {
                let percentage = (maxValue / predictions[i]) * 100;
                root.style.setProperty(`--value-${i}`, `${percentage}%`);
            }
        }
        catch (err) {
            let predictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            pixelArray = [];
            console.log(`Incorrect prediction format ⛔\n${err}`)
        }
    }
    socket.onerror = e => { console.log(`Socket Error Occured ⛔\n${e}`); connectSock() }
}

function draw() {
    if (!isDrawing) return
    document.querySelector(".pixel:hover").style.backgroundColor = "white"
    pixels.forEach((pixel, index) => {
        if (pixel.style.backgroundColor === "white") {
            pixelArray[index] = 1
            pixelArray[index - 28] = 0.5
            pixelArray[index + 28] = 0.5
            pixelArray[index + 1] = 0.5
            pixelArray[index - 1] = 0.5
        } else {
            pixelArray[index] = 0
        }
    })
    if (Math.floor(Math.random() + Math.random())) { socket.send(JSON.stringify(pixelArray)) }
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