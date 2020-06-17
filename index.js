'use strict';
let sf = 10; //sizeFactor
let boxColour = "#000";

//constants declaration
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

// Removes the context menu when right clicking inside the canvas
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

function init() {
    //initialise with proper values
    setCanvasDimensions();
    //changeable declaration
    let width = canvas.width;
    let height = canvas.height;
    c.strokeStyle = "#000";
    // 50 seems to look right for most values i tried, it's not important enough to focus on
    c.lineWidth = sf/50;
    // drawGrid(c, height, width);
    addEventListeners(canvas, c, rect);
}

function clearCanvas(canvas, c) {
    c.clearRect(0,0,canvas.width,canvas.height);
}

function drawLine(c, x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.stroke();
}

function randomCol() {
    // 16581375 is 255^3, this generates a number between that, which is then converted to hex
    let a = Math.floor(Math.random() * 16581375);
    return `#${a.toString(16)}`;
}

function drawSquare(c, x, y, col) {
    c.fillStyle = col;
    c.fillRect(x*sf, y*sf, sf, sf);
}

function drawGrid(c, height, width) {
    console.log("drawing");
    // BUG: when running it from an event listener it only does it once??
    // if the canvas width and height are the same we don't need two for loops
    if(width == height) {
        for(let i=sf; i<width; i+=sf){
            drawLine(c, i, 0, i, height);
            drawLine(c, 0, i, width, i);
        }
    } else {
        for(let i=sf; i<width; i+=sf) {
            drawLine(c, i, 0, i, height);
        }
        for(let i=sf; i<height; i+=sf) {
            drawLine(c, 0, i, width, i);
        }
    }
}

function addEventListeners(canvas, c, rect) {
    //resize canvas when the window resizes
    canvas.addEventListener('resize', setCanvasDimensions());
    canvas.addEventListener("mousedown", (e) => {
        switch (e.button) {
            case 0: // Left click
                //allow for draggin over multiple squares
                canvas.addEventListener('mousemove', mousemoveHandler);
                break;
            case 1: // Middle mouse button
                e.preventDefault();
                return;
            case 2: // Right click
                //allow for draggin over multiple squares
                // BUG: does not work as eraser, only makes a single square white
                canvas.addEventListener('mousemove', mousemoveHandler(e, "#ffffff"));
                return;
        }
        //get the location of the cursor on the screen, then take away where the canvas starts
        //probably could just do e.clientx, etc. but better safe than sorry
        let x = Math.floor((e.clientX - rect.left)/sf);
        let y = Math.floor((e.clientY - rect.top)/sf);
        drawSquare(c, x, y, boxColour);
    });

    // When the user stops clicking, stops squares being drawn
    window.addEventListener('mouseup', (e) => {
        canvas.removeEventListener('mousemove', mousemoveHandler);
    });
    // When the user's mouse leaves the canvas, stop squares being drawn
    window.addEventListener('mouseout', (e) => {
        canvas.removeEventListener('mousemove', mousemoveHandler);
    });

    // Gets the numeric values of the colour inputs
    let colInputs = Object.values(document.getElementsByClassName('colInput'));
    // The square next to the colour inputs that will display the current colour
    let colOutput = document.getElementById('colShow');
    colInputs.forEach(el => {
        el.addEventListener("mousemove", (e) => {
            //convert the three values to rgb, was going to use hex code, but it was much harder, and this works
            let newCol = `rgb(${colInputs[0].value},${colInputs[1].value},${colInputs[2].value})`;
            colOutput.style.backgroundColor = newCol;
            boxColour = newCol;
        });
    });

    // Allows the user to change the scale of the squares
    let scaleInput = document.getElementById('scaleInput');
    scaleInput.addEventListener('change', (e) => {
        sf = scaleInput.value;
        c.lineWidth = sf/50;
        clearCanvas(canvas, c);
        // console.log(`width: ${canvas.width}\nheight: ${canvas.height}`);
        // drawGrid(c, canvas.height, canvas.width);
    });

    // Clears the screen on button press
    let clearScreenBtn = document.getElementById('clearScreen');
    clearScreenBtn.addEventListener('click', (e) => {
        clearCanvas(canvas, c);
        // drawGrid(c, canvas.height, canvas.width);
    });
}

// Separate function for mouse move so that the event listener can be added and removed
function mousemoveHandler(e, col = boxColour) {
    let x = Math.floor((e.clientX - rect.left)/sf);
    let y = Math.floor((e.clientY - rect.top)/sf);
    drawSquare(c,x,y, col);
}

// Canvas setup
function setCanvasDimensions() {
    console.log("resizing");
    //setup proper Canvas sizing
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
}
