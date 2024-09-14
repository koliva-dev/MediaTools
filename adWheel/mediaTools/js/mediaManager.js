async function initDeviceSetBehavior(event, required) {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    // Handling 'click' or 'touchstart' event based on the device type
    if (required === 'click') {
        return regex.test(navigator.userAgent) ? 'touchstart' : 'click';

        // Handling 'dblclick' or 'doubletap'
    } else if (required === 'dblclick') {
        return regex.test(navigator.userAgent) ? 'doubletap' : 'dblclick';

        // Handling 'mousedown', 'mousemove', 'mouseup' events for drawing
    } else if (required === 'drawing') {
        return regex.test(navigator.userAgent) ?
            {
                down: 'touchstart',
                move: 'touchmove',
                up: 'touchend'
            } :
            {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup'
            };

        // Handling 'swipe' or 'scroll' events for mobile/desktop
    } else if (required === 'swipe') {
        return regex.test(navigator.userAgent) ? 'touchmove' : 'scroll';

        // Handling 'mousedown' and 'mouseup' for basic mouse events (or touch equivalents)
    } else if (required === 'mousedown' || required === 'mouseup') {
        return regex.test(navigator.userAgent) ? ['touchstart', 'touchend'] : ['mousedown', 'mouseup'];

        // Handling 'mousemove', corresponding to 'touchmove' on mobile devices
    } else if (required === 'mousemove') {
        return regex.test(navigator.userAgent) ? 'touchmove' : 'mousemove';

        // Handling swipe-like gestures, scroll for mobile, mousewheel for desktop
    } else if (required === 'scroll') {
        return regex.test(navigator.userAgent) ? 'touchmove' : 'scroll';

        // Handling right-click or longpress for context menu on mobile
    } else if (required === 'contextmenu') {
        return regex.test(navigator.userAgent) ? 'longpress' : 'contextmenu';

        // Handling touch events only for mobile
    } else if (required === 'touch') {
        return ['touchstart', 'touchmove', 'touchend'];

        // Default case for undefined or unsupported events
    } else {
        return regex.test(navigator.userAgent) ? 'touch' : 'mouse';
    }
}

async function wellcomeDecoratorRotator(event, playAudio, formData, stageMedia) {
    let rotationActive = rotationActivateDeactivate(stageMedia);


}
async function rotationActivateDeactivate(param) {
    return param;
}
