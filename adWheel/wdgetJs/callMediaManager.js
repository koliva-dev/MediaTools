// function manager to show mediamanager, aim to regulate all next behavior;
async function callMediaManager(initiatorWrapperId, targerWrapperId, callerButtonId, elementsMapping, initFormIndex, typeAction, dataOperator) {
    let callerManagerWrapper;
    const initiatorWrapperElt = document.getElementById(`${initiatorWrapperId}`);
    const targerWrapperElt = document.getElementById(`${targerWrapperId}`);
    const callerButtonElt = document.getElementById(`${callerButtonId}`);
    console.log('callMediaManager here, elts been found:', callerButtonElt, targerWrapperElt, initiatorWrapperElt, typeAction);
    const cStage = Object.keys(elementsMapping)[initFormIndex];
    const clayout = elementsMapping[`${cStage}`];
    let storageFormData = clayout.formData;

    // listener for call mediamanager
    const raiseMediamanagerLayout = async (event, initiatorWrapperElt, targerWrapperElt, callerButtonElt, initFormIndex, storageFormData, typeAction) => {
        if (event.target === callerButtonElt) {
            // call wrapper target, and then call rotator(ler collect elements for next eventListener)
            let dataOperationMapping = {
                targetContainerId: 'setUpMediaToolsWrapper',
                toolsLib: {
                    "chooseLocalUploadImg": {
                        anchorid: "localUploadAnchor",
                        'function': async function (event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction) {
                            await localFilesBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction);
                        }
                    },
                    "chooseTakePhoto": {
                        anchorid: "takePhotoAnchor",
                        'function': async function (event) {
                            await photoImagesBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction);
                        }
                    },
                    "chooseTakeVideo": {
                        anchorid: "takeVideoAnchor",
                        'function': async function (event) {
                            await videoFragmentsBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction);
                        }
                    },
                    "chooseUploadFromWeb": {
                        anchorid: "urlSrcAnchor",
                        'function': async function (event) {
                            await urlSrcImagesBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction)
                        }
                    },
                    "drawHandedImgDiv": {
                        anchorid: "handDrawAnchor",
                        'function': async function (event) {
                            await handDrawingBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction)
                        }

                    }
                }
            }
            let formDataMediator = new FormData();
            await showNextForm(event, initiatorWrapperId, targerWrapperId);
            await mediatoolsRotator(typeAction);
            const elementsCatalogToListen = targerWrapperElt.querySelectorAll('img.img-tool');
            let clickImgTool = async (event) => {
                // now replace mediaManagerWrapper with mediatoolsWrapper, with eltsBuilder before appears;
                const nextWrapperElt = document.getElementById(dataOperationMapping.targetContainerId);
                const toolsDefiner = dataOperationMapping.toolsLib;
                let toolSet;
                Object.keys(toolsDefiner).forEach((idMap => {
                    if (idMap === event.target.id) {
                        toolSet = toolsDefiner[`${idMap}`];
                        return;
                    }
                }));
                let cElement = targerWrapperElt;
                const imgFormId = toolSet.anchorid;
                const imgFormElt = document.getElementById(`${imgFormId}`);
                imgFormElt.style.display = 'block';
                await toolSet['function'](event, cElement, nextWrapperElt, imgFormElt, formDataMediator, undefined, typeAction);
                event.target.removeEventListener(typeAction, clickImgTool);
            }
            const startListenerToolsCalling = async (event) => {
                if (event.detail.isrotating === false) {
                    const allElts = Array.from(elementsCatalogToListen);
                    for (let i = 0; i < allElts.length; i++) {
                        //open set of listeners by clicking on img-tool
                        let elementForClick = allElts[i];
                        console.log(elementForClick.onclick);
                        elementForClick.addEventListener(typeAction, clickImgTool);
                    }
                } else {
                    const allElts = Array.from(elementsCatalogToListen);
                    for (let i = 0; i < allElts.length; i++) {
                        //open set of listeners by clicking on img-tool
                        let elementForClick = allElts[i];
                        console.log(elementForClick.onclick);
                        elementForClick.removeEventListener(typeAction, clickImgTool);
                    }
                }
            }
            document.addEventListener('isrotatingTools', startListenerToolsCalling);

        }
    }
    callerManagerWrapper = async (event) => raiseMediamanagerLayout(event, initiatorWrapperElt, targerWrapperElt, callerButtonElt, initFormIndex, storageFormData, typeAction);
    callerButtonElt.addEventListener(typeAction, callerManagerWrapper);
}

async function localFilesBuilder(event, mediaManagerWrapper, targetWrapper, thisAnchorWrapper, formDataMediator, instructionsJson, typeAction) {
    // initial start layout the container with mediabuilder of required body elts;
    await getFileFLocal(thisAnchorWrapper, formDataMediator, typeAction);
    await showNextForm(event, mediaManagerWrapper.id, targetWrapper.id);

}
async function urlSrcImagesBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction) {

}
async function handDrawingBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction) {

}
async function photoImagesBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction) {

}
async function videoFragmentsBuilder(event, parentWrapper, thisAnchorWrapper, formDataContainer, instructionsJson, typeAction) {

}