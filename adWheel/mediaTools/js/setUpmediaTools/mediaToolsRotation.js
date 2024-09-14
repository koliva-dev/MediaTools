

const wheelSound = new Audio("./mediaTools/sounds/rusty-gears.mp3");
wheelSound.loop = true;
let isrotating = true;
async function mediatoolsRotator(typeAction) {

    // if (Array.from(initiatorWrapper.childNodes).includes(event.target) || (Array.from(initiatorWrapper.children).includes(event.target))) {
    let menuElement = document.getElementById('mediaToolsMenu');
    let jumpToolsMax = -30;
    let elementsTools = document.querySelectorAll('div.media-tool');
    let SubelementsArray = Array.from(elementsTools);
    let menuPos = menuElement.getBoundingClientRect();
    let elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width ** 2))) / 2;
    let centerx = window.innerWidth / 2;
    let centery = window.innerHeight / 2;
    // await playWheel();
    await defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax, wheelSound, typeAction);
    window.addEventListener('orientationchange', async function () {
        centery = window.innerHeight / 2;
        centerx = window.innerWidth / 2;
        menuElement = document.getElementById('mediaToolsMenu')
        elementsTools = document.querySelectorAll('div.media-tool');
        SubelementsArray = Array.from(elementsTools);
        menuPos = menuElement.getBoundingClientRect();
        elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width ** 2))) / 2;
        await defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax, wheelSound, typeAction);
    });
    window.addEventListener('resize', async function () {
        centery = window.innerHeight / 2;
        centerx = window.innerWidth / 2;
        menuElement = document.getElementById('mediaToolsMenu')
        elementsTools = document.querySelectorAll('div.media-tool');
        SubelementsArray = Array.from(elementsTools);
        menuPos = menuElement.getBoundingClientRect();
        elementRadius = (Math.sqrt((menuPos.height ** 2) + (menuPos.width ** 2))) / 2;
        await defineLayoutMesh(SubelementsArray, elementRadius, centerx, centery, menuElement, jumpToolsMax, wheelSound);
    })
    // }

}

async function defineLayoutMesh(eltsArray, circleRadius, centerX, centerY, stopElement, jumpTools) {
    const totalElements = eltsArray.length;
    let innerJumpTools = jumpTools
    let angleIncrement = 0;
    let radiusDecrement = 0;
    let coefIncr = 1;
    const angleIncrement_ = 360 / totalElements; // Angle between each element
    await setIsRotating(true);
    async function animate() {
        if (isrotating) {
            angleIncrement = angleIncrement > 360 ? 0 : angleIncrement;
            angleIncrement += 0.33;
            radiusDecrement += coefIncr;
            if (radiusDecrement > 30) {
                coefIncr = -0.2;
            } else if (radiusDecrement < -10) {
                coefIncr = 0.5;
            }


            // finish incr-decr logic!!!!!!!!!!!!!!!!!!!!!!

            for (let i = 0; i < totalElements; i++) {
                const cElement = eltsArray[i];
                const cElementParams = cElement.getBoundingClientRect();
                const cElementHeight = cElementParams.height;
                const cElementWidth = cElementParams.width;


                // Calculate the angle in radians for current element
                const angleInRadians = (angleIncrement_ * i + angleIncrement) * (Math.PI / 180);

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
    stopElement.addEventListener(typeAction, async () => {
        if (isrotating) {
            await setIsRotating(false);
            await stopPlayWheel();
        } else {
            await setIsRotating(true);
            await playWheel();
        }
    });
    document.addEventListener('isrotatingTools', async function (event) {
        if (event.detail.isrotating) {
            await playWheel();
            requestAnimationFrame(animate);
        } else {
            await stopPlayWheel();
        }
    });
    animate();
}
async function playWheel() {

    wheelSound.play();
    return wheelSound;
}
async function stopPlayWheel() {
    wheelSound.pause();
    wheelSound.currentTime = 0;
}
async function setIsRotating(newState) {
    if (isrotating !== newState) {
        isrotating = newState;

    }
    const mediaRotatorToolsListener = new CustomEvent('isrotatingTools', {
        detail: { isrotating: isrotating }
    });
    document.dispatchEvent(mediaRotatorToolsListener);
}  