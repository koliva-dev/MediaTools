
/**
 * 
 * @param {Object} dataObj 
 * @param {String} initText 
 * 
 * @returns {String} correctionData
 */
async function dataCheckedRetriever(dataObj, initText, containerElt, dataElt, typeAction) {
    // data structure: array within Obj.matches; .then -> get original word by its offset, 
    // within array by index of detected errs. 
    let updatedData;
    const errorsDetected = dataObj.matches;
    const correctionData = await correctionMap(errorsDetected, initText);
    // correctionData null if no errors, so if null, return initText
    if (correctionData === null) {
        return initText;
    } else {
        // proceed to correcting the text
        await correctorInterface(containerElt, dataElt, correctionData, typeAction);
        const evtChangeListener = async (event) => {
            if (event.target === dataElt) {
                dataElt.removeEventListener('change', evtChangeListener);
                return event.target.value;
            }
        }
        dataElt.addEventListener('change', evtChangeListener);
    }

}

// define word by offset in sentence
async function getWordByOffset(sentence, offset) {
    const words = sentence.split(' ');
    let currentOffset = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        // Check if the offset falls within the current word's range
        if (offset >= currentOffset && offset < currentOffset + word.length) {
            return { word: word, index: i };
        }
        currentOffset += word.length + 1; // +1 for the space
    }
    return null; // Offset not found
}


// defining errors in the sentence (text)
async function correctionMap(errArray, text) {
    // Arrays to store results
    let replacementsArray = [];
    let wordRelated = [];

    // Loop through each error entry in errArray
    for (let i = 0; i < errArray.length; i++) {
        try {
            const errWordOffset = errArray[i].context.offset; // Get the offset
            const cWord = await getWordByOffset(text, errWordOffset); // Await asynchronous operation
            wordRelated.push({ word: cWord.word, offset: errWordOffset, index: cWord.index }); // Store the word related to the offset

            // Map replacements to extract values and push to replacementsArray
            const replacements = errArray[i].replacements.map(word => word.value);
            replacementsArray.push(replacements);
        } catch (error) {
            console.error(`Error processing entry ${i}:`, error);
            // Handle errors as needed
        }
    }

    // Optionally return results or process them further
    // return { wordRelated, replacementsArray };
    if (wordRelated.length > 0) {
        return { words: wordRelated, corrections: replacementsArray };
    } else {
        return null;
    }
}

// Capitalize each first letter to Capital letter;
async function capitalizeFirstLetterOfEachSentence(text) {
    if (text.includes('.')) {
        return text
            .split('.')
            .map(sentence => {
                const trimmed = sentence.trim();
                return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
            })
            .join('. ');
    } else {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}

async function correctorInterface(thisContainer, dataContainer, correctionMapData, typeAction) {
    // building stages  on production set to comments all logs
    const errorContainer = document.getElementById('popupErrContainer');
    console.log('erorContainer defined/udefined', errorContainer)
    const parentCoordinates = await getTargetCoorginates(thisContainer.id);
    console.log('coordinates of current from wrapper/ undefined', parentCoordinates);
    const sentenceInit = dataContainer.value;
    const sentenceArray = sentenceInit.split(' ');
    const corrections = correctionMapData.corrections;
    const wordMap = correctionMapData.words;
    let mediatorVar = '';
    let headPoint = document.createElement('h4');
    headPoint.textContent = 'у тексті виявлено орфографічні помилки:';
    errorContainer.appendChild(headPoint);
    let instruction = document.createElement('span');
    instruction.textContent = "Відкорегуйте текст відповідно підказок, або додайте свій варіант, також можна залишити як є, після чого натисніть далі, текст буде збережено.";
    instruction.style.fontSize = '10px';
    errorContainer.appendChild(instruction);
    let deviderHead = document.createElement('hr');
    errorContainer.appendChild(deviderHead);
    let sentanceWrapper = document.createElement('p');
    sentanceWrapper.classList.add('err-corrector');
    errorContainer.appendChild(sentanceWrapper);
    let wrongIndexes = [];
    // loop for retrieve all detected words with its indexes as appears in splited sentence;
    for (let i = 0; i < wordMap.length; i++) {
        wrongIndexes.push(wordMap[i].index);
    }
    // iteration for each word within splited sentence;
    for (let i = 0; i < sentenceArray.length; i++) {
        if (!wrongIndexes.includes(i)) {
            mediatorVar += sentenceArray[i] + ' ';
        } else {
            if (mediatorVar !== '') {
                const noWrong = document.createElement('span');
                noWrong.classList.add('no-wrong', 'word-iterator');
                noWrong.textContent = mediatorVar;
                sentanceWrapper.appendChild(noWrong);
                mediatorVar = '';
            }
            // here processing wrong word;
            console.log('entering point to wrong map consturctor');
            for (wrong = 0; wrong < wordMap.length; wrong++) {
                console.log('lets revise wordMap as is', wordMap);

                if (wordMap[wrong].index === i) {
                    console.log('here defined wring word with index', i);
                    const selectContainer = document.createElement('span');
                    selectContainer.classList.add('word-iterator');
                    sentanceWrapper.appendChild(selectContainer);
                    const wrongSelect = document.createElement('select');
                    selectContainer.appendChild(wrongSelect)
                    wrongSelect.classList.add('is-wrong');
                    const initWrong = document.createElement('option');
                    initWrong.text = sentenceArray[i];
                    initWrong.value = sentenceArray[i];
                    wrongSelect.appendChild(initWrong);
                    if (corrections[wrong].length > 1) {
                        for (let opt = 0; opt < corrections[wrong].length; opt++) {
                            const optVal = corrections[wrong][opt];
                            const optElt = document.createElement('option');
                            optElt.text = optVal;
                            optElt.value = optVal;
                            wrongSelect.appendChild(optElt);
                        }
                    }
                    const selfCreate = document.createElement('option');
                    selfCreate.text = 'інше слово';
                    selfCreate.value = 'інше слово';
                    console.log(selfCreate);
                    wrongSelect.appendChild(selfCreate);
                    selectContainer.appendChild(wrongSelect);
                    let prevStageDisplaySelect;
                    let actionListener;
                    if (typeAction) {
                        actionListener = 'change';
                        wrongSelect.addEventListener(actionListener, async function (event) {
                            const selectedOptIndex = event.target.selectedIndex;
                            const selectedOpt = event.target.options[selectedOptIndex];
                            if (selectedOpt === selfCreate) {
                                console.log('elt been clicked,', selectedOpt);
                                console.log(event.type);
                                const hiddenInputOption = document.createElement('input');
                                hiddenInputOption.type = 'text';
                                hiddenInputOption.name = 'altword';
                                hiddenInputOption.placeholder = 'Ваш варіант тут';
                                const doneSelfInput = document.createElement('button');
                                doneSelfInput.textContent = 'готово';
                                selectContainer.appendChild(hiddenInputOption);
                                selectContainer.appendChild(doneSelfInput);

                                prevStageDisplaySelect = selfCreate.parentElement.style.display;
                                selfCreate.parentElement.style.display = 'none';
                                doneSelfInput.addEventListener(typeAction, function (event) {
                                    if (event.target === doneSelfInput && hiddenInputOption.value) {
                                        selfCreate.text = hiddenInputOption.value;
                                        selfCreate.value = hiddenInputOption.value;
                                        selectContainer.removeChild(hiddenInputOption);
                                        selectContainer.removeChild(doneSelfInput);
                                        selfCreate.parentElement.style.display = prevStageDisplaySelect;
                                        wrongSelect.setAttribute('value', hiddenInputOption.value);
                                    }
                                })
                            } else {
                                wrongSelect.setAttribute('value', selectedOpt.value);
                            }
                        })
                    }
                }
            }
        }

    }
    if (mediatorVar !== '') {
        const noWrong = document.createElement('span');
        noWrong.classList.add('no-wrong', 'word-iterator');
        noWrong.textContent = mediatorVar;
        sentanceWrapper.appendChild(noWrong);
    }
    const finalDevider = document.createElement('hr');
    const submitCorrectionContainer = document.createElement('div');
    const submitDataButton = document.createElement('button');
    submitDataButton.textContent = "Зберегти, та далі.";
    submitDataButton.style.backgroundColor = 'black';
    submitDataButton.style.border = '3px darkgreen solid';
    submitDataButton.style.color = 'lightgreen';
    submitDataButton.style.cursor = 'pointer';

    submitCorrectionContainer.appendChild(submitDataButton);
    errorContainer.appendChild(finalDevider);
    errorContainer.appendChild(submitCorrectionContainer);
    submitCorrectionContainer.addEventListener(typeAction, async function (event) {
        if (event.target === submitDataButton) {
            console.log('action to save been clicked', submitDataButton);
            // submission data process with returning data to caller;
            const dataToRecord = await correctedSentenceAssembler(sentanceWrapper);
            console.log('data updated been achieved from user');
            // set newValue to elt with dipatcher to be available with 'shange' listeners;
            await newValueUpdater(dataContainer, dataToRecord);
            console.log('updated data now:', dataContainer.value, 'elt resposive:', dataContainer);
            await removeChildsErrContainer(errorContainer);
        }
    })
    await textCorrectorManager(parentCoordinates, errorContainer);
    await errContainerOpasityAppears();

}

/**
 * 
 * @param {object} coordinates 
 * @param {element} errContainer 
 */

async function textCorrectorManager(coordinates, errContainer) {
    // point err container position
    errContainer.style.display = 'block';
    errContainer.style.textAlign = 'center';
    errContainer.style.justifyItems = 'center';
    errContainer.style.backgroundColor = 'black';
    errContainer.style.border = '3px darkred solid';
    errContainer.style.borderRadus = '10px';
    errContainer.style.color = '#ffec82bd';
    errContainer.style.top = `${coordinates.top}px`;
    errContainer.style.left = `${coordinates.left}px`;
    errContainer.style.width = `${coordinates.width}px`;
    errContainer.style.minHeight = `${coordinates.height}px`;
}

async function correctedSentenceAssembler(eltParagraph) {
    const decoupledParagraph = eltParagraph.querySelectorAll('.word-iterator');
    let assembledData = '';
    if (decoupledParagraph.length > 1) {
        for (let i = 0; i < decoupledParagraph.length; i++) {
            const expression = decoupledParagraph[i];
            if (!expression.querySelector('select')) {
                const cdata = expression.innerText;
                assembledData += cdata;
                console.log(expression.innerText);
            } else {
                const dataContainer = expression.querySelector('select');
                if (dataContainer.selectedIndex === -1) {
                    let indexChosen = 0;
                    let dataVal = dataContainer.options[indexChosen].value;
                    assembledData += `${dataVal} `;
                } else {
                    let dataVal = dataContainer.options[dataContainer.selectedIndex].value;
                    assembledData += `${dataVal} `;
                }

            }

        }
    }
    return assembledData;
}
async function removeChildsErrContainer(errContainer) {
    // Assuming errContainer is already a DOM element reference
    while (errContainer.firstChild) {
        // Remove the first child of errContainer
        errContainer.removeChild(errContainer.firstChild);
    }

    // Optionally hide the container if needed
    errContainer.style.display = 'none';
}

async function newValueUpdater(dataElt, newValue) {
    dataElt.value = newValue;
    const event = new Event('change', { bubbles: true });
    dataElt.dispatchEvent(event);
}