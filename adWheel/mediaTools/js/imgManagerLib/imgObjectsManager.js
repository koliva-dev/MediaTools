
/**
 * 
 * @param {Node} hiddenInputAnchor 
 * @param {FormData} formDataMediator 
 * @param {string} typeAction
 */
async function getFileFLocal(hiddenInputAnchor, formDataMediator, typeAction) {
    // block eltsBuilder (DOM elements);
    const maxFilesQty = 5;
    if (!typeAction) {
        typeAction = await defineActionListenerType();
    }
    const instructionContainer = document.createElement('div');
    instructionContainer.style.display = 'none';
    const toolsContainer = document.createElement('div');
    toolsContainer.classList.add('img-tools-layout-container')
    const instructionBtn = document.createElement('button');
    instructionBtn.textContent = 'Інктрукція з користування';
    instructionBtn.classList.add('instruction')
    const addImgBlock = document.createElement('div');
    const initiateAddImgBtn = document.createElement('button');
    initiateAddImgBtn.textContent = 'Додати зображення';
    initiateAddImgBtn.classList.add('add-img-btn');
    const localInputStorageElt = document.createElement('input');
    localInputStorageElt.type = 'file';
    localInputStorageElt.multiple = true;
    localInputStorageElt.hidden = true;
    localInputStorageElt.name = 'image';
    localInputStorageElt.id = 'localInputStorageElt';
    // addImgBlock.appendChild(initiateAddImgBtn);
    addImgBlock.appendChild(localInputStorageElt);
    const previewImgsWrapper = document.createElement('div');
    previewImgsWrapper.id = 'imgShowcaseLocal';
    previewImgsWrapper.classList.add('img-showcase-container');
    const formDataManipulationWrapper = document.createElement('div');
    formDataManipulationWrapper.classList.add('submit-data-wrapper');
    const saveDataGoesNextEntity = document.createElement('button');
    saveDataGoesNextEntity.classList.add('submit-img-btn', 'first-submit-btn');
    saveDataGoesNextEntity.textContent = "Готово, далі..."
    const saveDataRetunmMediaManagerMenu = document.createElement('button');
    saveDataRetunmMediaManagerMenu.classList.add('submit-img-btn', 'second-submit-btn');
    saveDataRetunmMediaManagerMenu.textContent = "зберегти обране, додати медіа з іншого інструмету";
    const returnMediaManager = document.createElement('button');
    returnMediaManager.classList.add('submit-img-btn', 'third-submit-btn');
    returnMediaManager.textContent = "повернутися та обрати інший інструмент медіаменеджеру";
    formDataManipulationWrapper.appendChild(saveDataGoesNextEntity);
    formDataManipulationWrapper.appendChild(saveDataRetunmMediaManagerMenu);
    formDataManipulationWrapper.appendChild(returnMediaManager);
    toolsContainer.appendChild(initiateAddImgBtn);
    toolsContainer.appendChild(instructionBtn);
    buildBgVideoPlayer(hiddenInputAnchor);
    hiddenInputAnchor.appendChild(toolsContainer);
    hiddenInputAnchor.appendChild(instructionContainer);
    hiddenInputAnchor.appendChild(addImgBlock);
    hiddenInputAnchor.appendChild(previewImgsWrapper);
    hiddenInputAnchor.appendChild(formDataManipulationWrapper);

    // end elts builder;


    // setUp listener for add new file
    await addNewLocalImg(initiateAddImgBtn, localInputStorageElt, previewImgsWrapper, typeAction, formDataMediator);

}
async function addNewLocalImg(triggerAddElt, inputElt, showCaseImgWrapper, typeAction, formDataMediator) {
    const addDataAction = async (event) => {
        inputElt.click();
        const buildPreviewShowcase = async (event) => {
            const files = event.target.files;
            const keysMap = Array.from(formDataMediator.keys())
            if (!keysMap.includes(files[0].name)) {
                // upend data to formData
                formDataMediator.append(files[0].name, files[0]);
                // add img to showcase
                const fileObject = { value: files[0], name: files[0].name };

                await addImagePreview(showCaseImgWrapper, fileObject, typeAction, formDataMediator);

            } else {
                Swal.fire({
                    title: 'Помилка!',
                    text: 'ви намагаєтесь додати зображення яке вже було обране!',
                    icon: 'error',
                    confirmButtonText: 'Згорнути це'
                })
            }
            inputElt.value = '';
            console.log(formDataMediator, keysMap);
            inputElt.removeEventListener('change', buildPreviewShowcase);
        }
        inputElt.addEventListener('change', buildPreviewShowcase);
    }
    triggerAddElt.addEventListener(typeAction, addDataAction);

}
async function addImagePreview(previewContainer, fileObject, typeAction, formDataMediator) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'show-form-contaner-div';
    imageContainer.id = `image-container-${fileObject.name}`;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(fileObject.value);
    img.className = 'imgs-showcase';
    img.alt = `preview-${fileObject.name}`;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = 'X';
    deleteBtn.title = 'видалити';
    imageContainer.appendChild(img);
    imageContainer.appendChild(deleteBtn);
    previewContainer.appendChild(imageContainer);
    const updatedPreviewItems = previewContainer.querySelectorAll('div.show-form-contaner-div');
    console.log(updatedPreviewItems.length, updatedPreviewItems)

    deleteBtn.addEventListener(typeAction, async function () {
        await removeImage(fileObject.name, formDataMediator);
    });
}
async function removeImage(fileName, formDataMediator) {
    const containerToRemove = document.getElementById(`image-container-${fileName}`);
    if (containerToRemove) {
        containerToRemove.remove();
        formDataMediator.delete(`${fileName}`);
    }
}
async function buildBgVideoPlayer(targetElt) {
    const container = targetElt;

    // Create video element
    const video = document.createElement('video');
    video.id = 'bgVideo';
    video.muted = true; // Mute the video
    video.loop = true;  // Loop the video
    video.autoplay = true; // Start playing automatically
    video.src = './mediaTools/videoFiles/butterfly.mp4'; // Replace with your video source
    // Append video and controls to the container
    container.appendChild(video);
    video.play();
    video.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
}