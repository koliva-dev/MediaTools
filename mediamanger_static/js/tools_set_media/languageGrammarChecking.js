

// function check spelling form as words
async function checkTextWithLanguageTool(text) {
    const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            text: text,
            language: 'uk'
        })
    });
    const data = await response.json();
    return data;
}
// 
async function spellCheckedParser(obj, cLnag, inputEl, stageCorrection = undefined) {
    let cStage;
    if (stageCorrection === undefined || stageCorrection === 0) {
        cStage = 0;
    } else {
        cStage = stageCorrection;
    }
    const detectedLang = obj.language.detectedLanguage.name === cLnag;
    // const positionMessage = inputEl.getBoundingClientRect();
    // console.log('input position', positionMessage);

    if (!detectedLang && cStage === 0) {
        const msg = `<span style="color: darkred">У вашому тексті присутні помилки:</span><br>Мова яку ви затосували: ${obj.language.detectedLanguage.name}.<br>`
        const contextErr = `Вдімінність від головної мови, присутня мова: ${obj.language.detectedLanguage.name}<br>Натискаючи корегувати текст буде видалено!`;
        await raiseSyntaxAlert(msg, inputEl, '', contextErr, cStage, obj, cLnag);
        return;
    } else if (obj.matches && detectedLang) {
        cStage = 1;
        const errArray = obj.matches;
        const correctionsData = await correctingOrphErr(errArray, inputEl.value);
        let msg = '';
        let newValue = '';

        const inputFieldData = await raiseSyntaxAlert(msg, inputEl, 'newValue', '', cStage, obj, cLnag, correctionsData);
        if (inputFieldData) {
            console.log('the data been returned from syntax alert:', inputFieldData);
            return inputFieldData;
        }

    }


}
async function raiseSyntaxAlert(msg, elt, newValue, contextErr, stageCorrection, obj = undefined, cLang = undefined, correctingData = undefined) {
    if (stageCorrection === 1 && !correctingData) {
        return elt.value;
    }
    let messageWrapper = document.createElement('div');
    messageWrapper.id = 'nameSpellChecker';
    let messageBody;
    let errDescription;
    document.body.appendChild(messageWrapper);
    messageWrapper.style.backgroundColor = 'green';
    messageWrapper.style.color = 'lightblue';
    messageWrapper.style.border = '2px solid black';
    messageWrapper.style.borderRadius = '7px';
    messageWrapper.style.padding = '5px';
    messageWrapper.style.alignItems = 'center';
    messageWrapper.style.textAlign = 'center';
    messageWrapper.style.display = 'block';
    messageWrapper.style.position = 'absolute';
    if (stageCorrection === 0) {
        messageBody = document.createElement('p');
        errDescription = document.createElement('span');
        errDescription.innerHTML = contextErr;
        messageBody.innerHTML = msg;
        messageBody.appendChild(errDescription);
        messageWrapper.appendChild(messageBody);

    } else if (stageCorrection === 1 && correctingData) {
        messageBody = document.createElement('div');
        messageBody.id = 'textCorrectorWrapper';
        const messgeContext = document.createElement('p');
        messgeContext.innerText = 'Відкорегуйте помилки!';
        messageBody.appendChild(messgeContext);
        messageWrapper.appendChild(messageBody);
        await correctorConstructor(elt.value, messageBody.id, correctingData);
    }


    let buttonsWrapper = document.createElement('div');
    let agreeDataChange = document.createElement('button');
    agreeDataChange.style.margin = '3px';
    agreeDataChange.textContent = 'Корегувати';
    let leaveDataAsIs = document.createElement('button');
    leaveDataAsIs.style.margin = '3px';
    leaveDataAsIs.textContent = 'Хай буде так';
    buttonsWrapper.appendChild(agreeDataChange);
    buttonsWrapper.appendChild(leaveDataAsIs);

    messageWrapper.appendChild(buttonsWrapper);
    let positionMessage = elt.getBoundingClientRect();
    let heigtEl = positionMessage.height;
    let topEl = positionMessage.top;
    let leftEl = positionMessage.left;
    messageWrapper.style.top = `${topEl + heigtEl}px`;
    messageWrapper.style.left = `${leftEl + 7}px`;
    const changeEltToCorrectedData = async (evt) => {
        if (evt.target === agreeDataChange && newValue != null) {
            elt.value = newValue;
            agreeDataChange.removeEventListener('click', changeEltToCorrectedData);
            leaveDataAsIs.removeEventListener('click', changeEltToCorrectedData);
            document.body.removeChild(messageWrapper);

        } else if (evt.target === leaveDataAsIs && stageCorrection === 0) {
            // second iteration of spellChecking to lef functioonality passing farther;
            spellCheckedParser(obj, cLang, elt, stageCorrection);

            // agreeDataChange.removeEventListener('click', changeEltToCorrectedData);
            // leaveDataAsIs.removeEventListener('click', changeEltToCorrectedData);
            // document.body.removeChild(messageWrapper);
        } else if (stageCorrection === 1) {
            const assembledData = await textAssembler(true);
            if (assembledData) {
                elt.value = assembledData;
                if (messageWrapper !== undefined) {
                    while (messageWrapper.firstChild) {
                        messageWrapper.removeChild(messageWrapper.firstChild)
                    }
                    document.body.removeChild(messageWrapper);
                }
                return assembledData;
            }
        }
    }
    agreeDataChange.addEventListener('click', changeEltToCorrectedData);
    leaveDataAsIs.addEventListener('click', changeEltToCorrectedData);

}

// lets avoide uncapitalized errors
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
async function correctingOrphErr(errArray, text) {
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
        console.log('no errors detected');
    }
}
// replacement by offset (with chosen word will be replaced)
async function replaceWordByOffset(sentence, offset, newWord) {
    const result = await getWordByOffset(sentence, offset);
    if (result) {
        const { index } = result;
        const words = sentence.split(' ');
        words[index] = newWord; // Replace the word at the specified index
        return words.join(' '); // Join the words back into a sentence
    }
    return sentence; // Return original if offset is not found
}

async function correctorConstructor(text, parentElementId, correctingData) {
    if (!correctingData) {
        return;
    }
    let eventListenerType;
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    if (regex.test(navigator.userAgent)) {
        eventListenerType = 'touchdownn';
    } else {
        eventListenerType = 'click';
    }

    const parentElement = document.getElementById(parentElementId);
    const words = correctingData.words;
    const corrections = correctingData.corrections;
    const textMapping = text.split(' ');
    let plainText = '';
    const wrongIndexes = [];
    const wrongMap = {}
    const newElementP = document.createElement('p');
    newElementP.id = 'correctionSentence';
    if (words.length > 0) {
        for (let ind = 0; ind < words.length; ind++) {
            wrongIndexes.push(words[ind].index);
            wrongMap[words[ind].index] = ind;
        }
        for (let i = 0; i < textMapping.length; i++) {
            const cWord = textMapping[i];
            if (!wrongIndexes.includes(i)) {
                plainText += cWord + ' ';
            } else {
                const correctTextEl = document.createElement('span');
                correctTextEl.classList.add('correct-text', 'constructor');
                correctTextEl.setAttribute('text-val', plainText);
                correctTextEl.textContent = plainText;
                plainText = '';
                newElementP.appendChild(correctTextEl);
                const cSrcInd = wrongMap[i];
                const cwrongText = words[cSrcInd];
                const selectContainer = document.createElement('span');
                selectContainer.classList.add('wrong-word', 'constructor');
                const wrongWord = document.createElement('select');
                wrongWord.classList.add('wrong-select', 'constructor-select');
                const cWrongWord = document.createElement('option');
                cWrongWord.text = cwrongText.word;
                cWrongWord.value = cwrongText.word;
                wrongWord.appendChild(cWrongWord);
                // adding all corrections provided
                const correctionArray = corrections[cSrcInd];
                if (correctionArray.length > 0) {
                    for (let i = 0; i < correctionArray.length; i++) {
                        const altText = correctionArray[i];
                        if (altText) {
                            const altWord = document.createElement('option');
                            altWord.text = altText + ' ';
                            altWord.value = altText + ' ';
                            wrongWord.appendChild(altWord);
                        }
                    }
                    const altWord = document.createElement('option');
                    altWord.text = 'свій варіаант';
                    altWord.value = '';
                    altWord.id = 'altWord';
                    wrongWord.appendChild(altWord);
                    let prevStageDisplaySelect;

                    altWord.addEventListener(eventListenerType, function (event) {
                        if (event.target === altWord) {
                            const hiddenInputOption = document.createElement('input');
                            hiddenInputOption.type = 'text';
                            hiddenInputOption.name = 'altword';
                            hiddenInputOption.placeholder = 'Ваш варіант тут';
                            const doneSelfInput = document.createElement('button');
                            doneSelfInput.textContent = 'готово';
                            selectContainer.appendChild(hiddenInputOption);
                            selectContainer.appendChild(doneSelfInput);

                            prevStageDisplaySelect = altWord.parentElement.style.display;
                            altWord.parentElement.style.display = 'none';
                            doneSelfInput.addEventListener(eventListenerType, function (event) {
                                if (event.target === doneSelfInput && hiddenInputOption.value) {
                                    altWord.text = hiddenInputOption.value;
                                    altWord.value = hiddenInputOption.value;
                                    selectContainer.removeChild(hiddenInputOption);
                                    selectContainer.removeChild(doneSelfInput);
                                    altWord.parentElement.style.display = prevStageDisplaySelect;
                                }
                            })

                        }
                    })
                }
                selectContainer.appendChild(wrongWord);
                newElementP.appendChild(selectContainer);
            }
        }
        if (plainText != '') {
            const lastText = document.createElement('span');
            lastText.classList.add('correct-text', 'constructor');
            lastText.textContent = plainText;
            lastText.setAttribute('text-val', plainText);
            plainText = '';
            newElementP.appendChild(lastText);
        }
    }
    parentElement.appendChild(newElementP);
    return parentElement;
}

async function textAssembler(assembling) {
    if (assembling) {
        const selectorAltText = document.querySelectorAll('.constructor');
        const eltsArray = Array.from(selectorAltText);
        let assmbledText = '';

        for (let i = 0; i < eltsArray.length; i++) {
            if (!eltsArray[i].getAttribute('class').includes('wrong-word')) {
                const textData = eltsArray[i].getAttribute('text-val');
                assmbledText += textData;
            } else {
                let valueChosen;
                const spanElt = eltsArray[i].children[0];
                valueChosen = spanElt.options[spanElt.selectedIndex].value
                spanElt.options[spanElt.selectedIndex].value + ' ';
                const initialWord = spanElt[0].value;
                const symbol = await checkReturnRe(initialWord);
                if (symbol !== null && spanElt.options[spanElt.selectedIndex] !== spanElt[0]) {
                    valueChosen = valueChosen + symbol + ' ';
                } else {
                    valueChosen = valueChosen + ' ';
                }
                spanElt.setAttribute('value', `${valueChosen}`);
                eltsArray[i].setAttribute('text-val', `${valueChosen}`);
                assmbledText += valueChosen;
            }


        }
        console.log('text assembled to publication: assmbledText', assmbledText);
        return assmbledText;
    }

}
async function checkReturnRe(wordInit) {
    const patternRe = /[,.?:;!-]/;
    const matchSym = wordInit.match(patternRe);
    if (matchSym) {
        return matchSym[0];
    } else {
        return null;
    }
}