
async function showNextForm(event, cFormWrapId, nextFormWrapId) {
    console.log('here forms id for showNextFGorm', cFormWrapId, nextFormWrapId);
    const cFormWrap = document.getElementById(cFormWrapId);
    const nextFormWrap = document.getElementById(nextFormWrapId);
    const cFormDisplay = cFormWrap.style.display;
    if (cFormDisplay !== 'none') {
        let opacity1 = 1;
        let opacity2 = 0;
        cFormWrap.style.display = 'block';
        cFormWrap.style.opacity = opacity1;
        nextFormWrap.style.display = 'block';
        nextFormWrap.style.opacity = opacity2;


        const intervalId = setInterval(() => {
            if (opacity1 <= 0 && opacity2 >= 1) {
                clearInterval(intervalId);
                cFormWrap.style.display = 'none';
                nextFormWrap.style.display = 'block';
            } else {
                opacity1 -= 0.01;
                opacity2 += 0.01;
                document.getElementById(cFormWrapId).style.opacity = opacity1;
                document.getElementById(nextFormWrapId).style.opacity = opacity2;
            }
        }, 10);

    } else {
        cFormWrap.style.display = 'none';
        nextFormWrap.style.display = 'block';
    }
}
async function defineActionListenerType() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent) ? 'touchstart' : 'click';
}
async function updateFormData(formData, inputName, ...data) {
    // Check if formData is empty
    if (Object.keys(formData).length !== 0) {
        // Clear formData if it's not empty
        formData = {};
    }

    // If data contains multiple items, treat it as an array; otherwise, use the single value
    if (data.length === 1) {
        formData[inputName] = data[0];
    } else {
        formData[inputName] = data;
    }
    // Return the updated formData
    return Object.keys(formData).length !== 0
}

async function toNextForm(obj) {
    return obj.toNextParams;
}
async function getTargetCoorginates(targetEltId) {
    const targetElt = document.getElementById(`${targetEltId}`);
    const targetCoordinates = targetElt.getBoundingClientRect();
    return targetCoordinates
}
async function spinnerDataAwait(parentEltSpiner) {
    let intervalId;
    if (parentEltSpiner.style.display !== 'none') {
        let spinerDot = 0;
        let basePhrase = 'Обробка даніх';
        const msgSpinerElt = document.getElementById('spinerMsg');
        intervalId = setInterval(() => {
            if (spinerDot <= 4) {
                spinerDot += 1;
                msgSpinerElt.innerText = basePhrase + '.'.repeat(spinerDot);
            } else {
                spinerDot = 0;
                msgSpinerElt.innerText = basePhrase;
            }
            if (document.getElementById(parentEltSpiner.id).style.display === 'none') {
                clearInterval(intervalId);
                intervalId = null;
                msgSpinerElt.innerText = basePhrase;
                return;
            }
        }, 500);
    }
}