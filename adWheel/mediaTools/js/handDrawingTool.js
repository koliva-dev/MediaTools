let chosenTool;

let cLineColor = 'blue';
let fillingObjColor;
let canvasBgColor;
const eltColor = document.getElementById('thisLineColor');
// lets create drawing area entity
const visibleCanvas = document.getElementById('drawToolCanvas');
// set the canvas property to drawing
const visibleCtx = visibleCanvas.getContext('2d');
// predefine drawing intiator flag
let isDrawing = false;


// initiate system init points

function drawArtFunctionGetTool(element){

    const parentThis = document.getElementById('pickUpDrawTool');
    const allInput = Array.from(parentThis.querySelectorAll('input'));
    // lets rm all eventlisteners

    allInput.forEach(element_ =>{
        if (element_){
            element_.checked = false;
            element.checked = true;
            try {
                visibleCanvas.removeEventListener(element_.getAttribute('act-val'), toolsDrawDefiner[element_.value]);
            }
            catch(error){};
        }
    })
    // rm all eventlisteners 

    chosenTool = toolsDrawDefiner[element.value]
    // setup chosen tool
    try {
        visibleCanvas.addEventListener(element.getAttribute('act-val'), chosenTool);
    }
    catch(error){};
}

// vars used for handdrawing tools
let lastX = 0;
let lastY = 0;
// vars for lines2dots
let startX = null;
let startY = null;
let events = null;
let isAwaitingForSecondClick = false;
let tempLinePreview = false;


// set of tools to draw
// Hand drawing
// -- //
let handDrivenLineInit = (event) => {
    const handDrivenLine = (event) => {
        if (!isDrawing) {
            return
        }
        const [x, y] = [event.offsetX, event.offsetY];
        visibleCtx.beginPath();
        visibleCtx.moveTo(lastX, lastY);
        visibleCtx.lineTo(x, y);
        visibleCtx.stroke();
        [lastX, lastY] = [x, y];
    };

    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];
    const moseUpEvt = () => { isDrawing = false; };
    const mouseOutEvt = () => { if (isDrawing) isDrawing = false; };
    // Draw on canvas
    visibleCanvas.addEventListener('mousemove', handDrivenLine);
    // Stop drawing
    visibleCanvas.addEventListener('mouseup', moseUpEvt);
    // Stop drawing on mouse leave
    visibleCanvas.addEventListener('mouseout', mouseOutEvt);
}
// -- //



// TWO DOTS LINE BLOCK => block definer initiate2dotsLine (line btwn two dots by drag and drop logic)

const offScreenCanvas = document.createElement('canvas');
const offScreenCtx = offScreenCanvas.getContext('2d');
offScreenCanvas.width = visibleCanvas.width;
offScreenCanvas.height = visibleCanvas.height;
function eraiseAllFCanvas(){
    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    drawingState.lines = [];
}
const drawingState = {
    isDrawing2dLine: false,
    startX: 0,
    startY: 0,
    lines: [],
};

let draw2dotsLine = (x1, y1, x2, y2, ctx) => {
    if (drawingState.isDrawing2dLine) {       
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = cLineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
let redraw2dotsLine = () => {
    offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    drawingState.lines.forEach(([x1, y1, x2, y2]) => {
        draw2dotsLine(x1, y1, x2, y2, offScreenCtx);
    });
}
let drawLineReprMouseMove = (event) => {
    if (drawingState.isDrawing2dLine){

        const currentX = event.offsetX;
        const currentY = event.offsetY;
        redraw2dotsLine();
        draw2dotsLine(drawingState.startX, drawingState.startY, currentX, currentY, offScreenCtx);
        visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
        visibleCtx.drawImage(offScreenCanvas, 0, 0);
    }
}
let completion2dotsLine = (event) => {
    // event mouseup
    if (drawingState.isDrawing2dLine) {
        const currentX = event.offsetX;
        const currentY = event.offsetY;
        drawingState.lines.push([drawingState.startX, drawingState.startY, currentX, currentY]);
        drawingState.isDrawing2dLine = false;
    }
}

const initiate2dotsLine = (event) => {
    console.log('initiated 2dots');

    // act-value set to mousedown
    drawingState.isDrawing2dLine = true;
    drawingState.startX = event.offsetX;
    drawingState.startY = event.offsetY;
    // here initiation chain evt listeners to complete line
    visibleCanvas.addEventListener('mousemove', drawLineReprMouseMove);
    visibleCanvas.addEventListener('mouseup', completion2dotsLine);
}
// END TWO DOTS LINE BLOCK

// Set default styles for drawing
const getLineColor = (event) => {
    if (event.target === eltColor){
        console.log('color value been changed to', eltColor.value);
        cLineColor = eltColor.value;
        visibleCtx.strokeStyle = cLineColor;
    }
}
eltColor.addEventListener('change', getLineColor);
 // Line color
visibleCtx.lineWidth = 2; // Line width
var toolsDrawDefiner = {
    drawHanded: handDrivenLineInit,
    simple2dotsline: initiate2dotsLine,
    polyLine: 'polyline',
    triangle: 'triangle',
    rectangle: 'rectangle',
    polygon: 'polygon',
    circle: 'circle',
    ellipse: 'ellipse',
    eraise: 'eraise',
    chooseElement: 'chooseElement',
    previewImage: 'previewImage',
    eraiseAll: eraiseAllFCanvas
}
