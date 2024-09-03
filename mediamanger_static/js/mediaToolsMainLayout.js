document.addEventListener('DOMContentLoaded', function(){

    mediatoolsRotator();
})
function mediatoolsRotator(){
    let menuElement = document.getElementById('mediaToolsMenu');
    let jumpToolsMax = -30;
    let elementsTools = document.querySelectorAll('div.media-tool');
    let SubelementsArray = Array.from(elementsTools);
    let menuPos = menuElement.getBoundingClientRect();
    let elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width**2))) / 2;
    let centerx = window.innerWidth / 2;
    let centery = window.innerHeight / 2;
    playWheel();
    defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax);
    window.addEventListener('orientationchange', function(){
        centery = window.innerHeight / 2;
        centerx = window.innerWidth / 2;
        menuElement = document.getElementById('mediaToolsMenu')
        elementsTools = document.querySelectorAll('div.media-tool');
        SubelementsArray = Array.from(elementsTools);
        menuPos = menuElement.getBoundingClientRect();
        elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width**2))) / 2;
        defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax);
    });
    window.addEventListener('resize', function(){
        centery = window.innerHeight / 2;
        centerx = window.innerWidth / 2;
        menuElement = document.getElementById('mediaToolsMenu')
        elementsTools = document.querySelectorAll('div.media-tool');
        SubelementsArray = Array.from(elementsTools);
        menuPos = menuElement.getBoundingClientRect();
        elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width**2))) / 2;
        defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax);
    })
}

function defineLayoutMesh(eltsArray, circleRadius, centerX, centerY, stopElement, jumpTools) {
    const totalElements = eltsArray.length;
    let innerJumpTools = jumpTools
    let angleIncrement = 0;
    let radiusDecrement = 0;
    let coefIncr = 1;
    const angleIncrement_ = 360 / totalElements; // Angle between each element
    setIsRotating(true);
    function animate(){
        if (isrotating){
            angleIncrement = angleIncrement > 360 ? 0 : angleIncrement;
            angleIncrement += 0.33;
            radiusDecrement += coefIncr;
            if (radiusDecrement > 30){
                coefIncr = -0.2;
            } else if (radiusDecrement < -10){
                coefIncr = 0.5;
            }
            

            // finish incr-decr logic!!!!!!!!!!!!!!!!!!!!!!
            
            for (let i = 0; i < totalElements; i++) {
                const cElement = eltsArray[i];
                const cElementParams = cElement.getBoundingClientRect();
                const cElementHeight = cElementParams.height;
                const cElementWidth = cElementParams.width;


                // Calculate the angle in radians for current element
                const angleInRadians = (angleIncrement_ * i +  angleIncrement) * (Math.PI / 180);

                // Calculate x and y positions on the circle
                const posX = centerX + (circleRadius + radiusDecrement + innerJumpTools) * Math.cos(angleInRadians) - (cElementWidth / 2);
                const posY = centerY + (circleRadius + radiusDecrement + innerJumpTools) * Math.sin(angleInRadians) - (cElementHeight / 2);

                // Set the element's position
                cElement.style.left = `${posX}px`;
                cElement.style.top = `${posY}px`;
            }
            requestAnimationFrame(animate);
        }
    }
    stopElement.addEventListener('click', ()=>{
        if (isrotating){
            setIsRotating(false);
            stopPlayWheel();
        } else {
            setIsRotating(true);
            playWheel();
        }
    });
    document.addEventListener('isrotatingTools', function(event) {
        if (event.detail.isrotating) {
            playWheel();
            requestAnimationFrame(animate);
        } else {
            stopPlayWheel();
        }
    });
    animate();
}



