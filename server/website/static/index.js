const canvas = document.getElementById("canvas")
const resetBt = document.getElementById("reset")
let pixels = document.querySelectorAll(".pixel")

function makePixels() {
    let html = ""
    for (let i = 0; i < 28 * 28; i++) {
        let template = `<div class="pixel id_${i}"></div>`
        html += template
    }
    canvas.innerHTML = html;
    pixels = document.querySelectorAll(".pixel")
}

makePixels()

document.addEventListener('dragstart', (e) => {
    e.preventDefault()
})

let isDrawing = false

canvas.onmousedown = e => { isDrawing = true }
canvas.onmouseup = e => { isDrawing = false }
canvas.onmousemove = e => { draw() }

function draw() {
    if (!isDrawing) return
    document.querySelector(".pixel:hover").style.backgroundColor = "white"
    let pixelArray = []
    pixels.forEach((pixel, index) => {
        if (pixel.style.backgroundColor === "white") {
            pixelArray[index] = 1
        } else {
            pixelArray[index] = 0
        }
    })
    console.log(pixelArray)
}

resetBt.onclick = e => { pixels.forEach(pixel => { pixel.style.backgroundColor = "black" }) }
