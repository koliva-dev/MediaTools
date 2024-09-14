async function onStageManagerText(elementsMapping, initFormIndex, typeAction, acceptedData, checkinginputData) {
    const cStage = Object.keys(elementsMapping)[initFormIndex];
    const clayout = elementsMapping[`${cStage}`];
    const dataTargetId = clayout.dataContainerId;
    const thisContainerId = clayout.wrapperId;
    const thisContainerElt = document.getElementById(`${thisContainerId}`);
    const dataTargetElt = document.getElementById(`${dataTargetId}`);
    const submitButnId = clayout.buttonId;
    let storageFormData = clayout.formData;
    const targetCoordinates = await getTargetCoorginates(dataTargetId);
    eltSwitchNextLayout = document.getElementById(`${submitButnId}`);
    checkinginputData = async (event) => {
        //first set check empty string;
        const emptyString = await checkRaiseEmptStr(dataTargetElt, targetCoordinates);
        if (!emptyString) {
            // retrieve pair of cWrapperId, nextWrapperId
            const nextFormids = await toNextForm(clayout);
            const dataValue = dataTargetElt.value;
            const dataValueCapitalized = await capitalizeFirstLetterOfEachSentence(dataValue)
            // get data from spellchecker;
            const spellCheckedData = await spellCheckerFetch(dataValueCapitalized);
            //time to read the errors
            console.log('data from server with erors or ok', spellCheckedData);
            // const thisContainerElt = document.getElementById('contentHelper');
            acceptedData = await dataCheckedRetriever(spellCheckedData, dataValueCapitalized, thisContainerElt, dataTargetElt, typeAction);
            if (acceptedData !== undefined) {
                dataTargetElt.value = acceptedData;
                // update FormData with accepted textValue;
                storageFormData.append(dataTargetElt.name, dataTargetElt.value);
                // rm evtlistener of this btn on-action;
                eltSwitchNextLayout.removeEventListener(typeAction, checkinginputData);
                // switch to next form;
                await showNextForm(event, nextFormids[0], nextFormids[1]);
                // call evtListener with change index of stage processing;
                let newInitIndex = initFormIndex + 1;
                await setInitIndex(newInitIndex);
            } else {
                const updaterListener = async (event) => {
                    if (event.target === dataTargetElt) {
                        acceptedData = event.target.value;
                        storageFormData.append(dataTargetElt.name, acceptedData);
                        eltSwitchNextLayout.removeEventListener(typeAction, checkinginputData);
                        dataTargetElt.removeEventListener('change', updaterListener);
                        // switch to next form;
                        await showNextForm(event, nextFormids[0], nextFormids[1]);
                        // call evtListener with change index of stage processing;
                        let newInitIndex = initFormIndex + 1;
                        await setInitIndex(newInitIndex);
                    }
                }
                dataTargetElt.addEventListener('change', updaterListener);
            }
        }
    }
    eltSwitchNextLayout.addEventListener(typeAction, checkinginputData);
}
