async function showMediaInstruction(initiatorWrapperEltId, btnEltId, docsContainerId, actionType) {
    const showInstructionElt = document.getElementById(`${btnEltId}`);
    const docsContainer = document.getElementById(`${docsContainerId}`);
    const cWrapperElt = document.getElementById(`${initiatorWrapperEltId}`);
    const jsonSrc = await mediaManagerInsctruction();
    console.log(showInstructionElt);

    const retrieveJsonData = async (event) => {
        console.log('elt clicked');
        await buildInstructionDocs(event, docsContainerId, jsonSrc, cWrapperElt, actionType);
        await showNextForm(event, cWrapperElt.id, docsContainer.id);
        // await appearsDisappersWrapper(event, cWrapperElt, docsContainer, actionType)
    }
    showInstructionElt.addEventListener(actionType, retrieveJsonData);
}
async function buildInstructionDocs(event, docsWrapperId, dataObject, initiatorWrapper, actionType) {
    const winwidth = window.innerWidth;
    const head = document.createElement('h4');
    head.classList.add('instruction-head');
    head.innerText = dataObject.head;
    const menuDescription = document.createElement('div');
    const menuPresentation = dataObject.map.img;
    console.log(menuPresentation);
    const keysPresentation = Object.keys(menuPresentation);
    const docsWrapper = document.getElementById(`${docsWrapperId}`);
    docsWrapper.classList.add('instruction-wrapper');
    docsWrapper.appendChild(head);
    docsWrapper.appendChild(menuDescription);

    docsWrapper.style.overflowY = 'auto';

    docsWrapper.style.zIndex = 99;

    for (let i = 0; i < keysPresentation.length; i++) {
        const menuList = document.createElement('p');
        menuList.classList.add('instruction-menu');
        const descriptionImg = document.createElement('span');
        descriptionImg.textContent = menuPresentation[`${keysPresentation[i]}`].description;
        console.log
        descriptionImg.classList.add('menu-instruction-description-img')
        const cImg = document.createElement('img');
        const cImgContainer = document.createElement('div');

        cImg.src = menuPresentation[`${keysPresentation[i]}`].src;
        cImg.style.width = '50px';
        cImg.style.height = 'auto';
        cImgContainer.classList.add('image-instruction-menu-description')
        cImgContainer.appendChild(cImg);
        menuList.appendChild(descriptionImg);
        menuList.appendChild(cImgContainer);
        menuDescription.appendChild(menuList);
    }

    const mainTextBlock = document.createElement('div');
    mainTextBlock.classList.add('instruction-description-body');
    const maintextText = document.createElement('p');
    maintextText.classList.add('instruction-description-paragraph')
    mainTextBlock.appendChild(maintextText);
    const mainTextData = dataObject.map.instruction.main;
    docsWrapper.appendChild(mainTextBlock);
    for (let i = 0; i < mainTextData.length; i++) {
        const mainTextDescription = document.createElement('span');
        mainTextDescription.classList.add('text-box-instruction-iterrator');
        mainTextDescription.innerHTML = `${mainTextData[i].text}`;
        const brecker = document.createElement('br');
        mainTextDescription.appendChild(brecker);
        maintextText.appendChild(mainTextDescription);
    }
    const rmInstructionBlock = document.createElement('div');
    rmInstructionBlock.classList.add('rm-instruction-wrapper');
    const rmBtnElt = document.createElement('button');
    rmBtnElt.textContent = 'Зроз.., згорнути'
    rmBtnElt.classList.add('rm-instruction-btn');
    rmInstructionBlock.appendChild(rmBtnElt);
    docsWrapper.appendChild(rmInstructionBlock);
    const removecWrapper = async (event) => {
        while (docsWrapper.firstChild) {

            docsWrapper.removeChild(docsWrapper.firstChild);

        }
        console.log('rm built constructor clicked');
        await showNextForm(event, docsWrapperId, initiatorWrapper.id);
        // await appearsDisappersWrapper(event, initiatorWrapper, docsWrapper);
        rmBtnElt.removeEventListener(actionType, removecWrapper);
    }
    rmBtnElt.addEventListener(actionType, removecWrapper);
}
async function appearsDisappersWrapper(event, signalSrcWrapper, targetWrapper) {
    console.log('the switching func been called');
    let targetOnDisplay = targetWrapper.style.display;
    let initialOndisplay = signalSrcWrapper.style.display;
    targetWrapper.style.display = (targetOnDisplay === 'none', initialOndisplay !== 'none') ? (signalSrcWrapper.style.display = 'none', 'block') : (signalSrcWrapper.style.display = 'block', 'none');
}