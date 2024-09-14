// function check spelling form as words
async function spellCheckerFetch(text) {
    const spinnerElt = document.getElementById('spinnerAwait');
    spinnerElt.style.display = 'flex';
    await spinnerDataAwait(spinnerElt);
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                text: text,
                language: 'uk'
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null; // Or handle error accordingly
    } finally {
        spinnerElt.style.display = 'none'; // Hide spinner when done
    }
}

async function checkRaiseEmptStr(eltData, eltCoordinatyes) {
    const stringData = eltData.value;
    if (stringData !== '') {
        return false
    } else {
        const showAlert = await buildPupUpEmptyStringAlert(eltCoordinatyes);
        return showAlert

    }
}
async function buildPupUpEmptyStringAlert(eltCoordinates) {

    const parentAlert = document.getElementById('popupErrContainer');
    parentAlert.style.top = eltCoordinates.top;
    parentAlert.style.left = eltCoordinates.left;
    parentAlert.style.width = eltCoordinates.width;
    parentAlert.style.height = eltCoordinates.width / 2;
    parentAlert.style.border = '2px red solid';
    parentAlert.style.borderRadius = '10px';
    const mesageElt = document.createElement('p');
    mesageElt.innerText = "Це поле обов'язкове до заповнення";
    parentAlert.style.display = 'flex';
    parentAlert.style.justifyContent = 'center';
    parentAlert.style.alignItems = 'center';
    mesageElt.style.color = 'darkgreen';
    parentAlert.style.backgroundColor = 'black';
    parentAlert.style.textAlign = 'center';
    parentAlert.appendChild(mesageElt);
    await errContainerOpasityAppears();

    setTimeout(() => {
        while (parentAlert.firstChild) {
            parentAlert.removeChild(parentAlert.firstChild);
            parentAlert.style.display = 'none';
            parentAlert.top = 0;
            parentAlert.left = 0;
        }

    }, 3000);
    return true
}
// error container to appear in dradual mode;
async function errContainerOpasityAppears() {
    console.log('run the constructor');
    let opacity = 0;
    const errContainer = document.getElementById('popupErrContainer');
    console.log(errContainer);
    errContainer.style.opacity = opacity;
    errContainer.style.zIndex = 99;
    const intervalId = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(intervalId);
            return;
        } else {
            opacity += 0.01;
            document.getElementById('popupErrContainer').style.opacity = opacity;
        }
    }, 5);
}


