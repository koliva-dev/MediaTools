function helperAdCreator(cStage = null) {
    if (!cStage && window.initIndex === undefined) {
        initIndex = 0;
        const cKeyMap = Object.keys(stages)[initIndex];
        adHelperWrapperId = stages[cKeyMap].wrapperId;
        cMessageContainerId = stages[cKeyMap].messageContainer;
        callFunctionButtonId = stages[cKeyMap].callFunctionButtonId;
        const helperWrapper = document.getElementById(`${adHelperWrapperId}`);
        const formHelperMessage = document.getElementById(`${cMessageContainerId}`);
        const callFunctionElement = document.getElementById(`${callFunctionButtonId}`);
        dialogContainer.style.display = (dialogContainer.style.display === 'none' && helperWrapper.style.display === 'flex') ? (helperWrapper.style.display = 'none', formHelperMessage.style.display = 'none', 'block') : (helperWrapper.style.display = 'flex', formHelperMessage.style.display = 'block', 'flex');

        window.initIndex += 1;
        const nextKeyMap = Object.keys(stages)[initIndex];
        const nextFormMessageId = stages[nextKeyMap].messageContainer;
        console.log(nextFormMessageId);
        listenerCallNameAdForm = (evt) => callNameAdForm(evt, callFunctionElement, formHelperMessage, nextFormMessageId)
        stages[cKeyMap].done = true;
        callFunctionElement.addEventListener('click', listenerCallNameAdForm);
        console.log(initIndex, Object.keys(stages)[initIndex], 'next form to call, implemented in helperAdCretor', Object.keys(stages)[initIndex + 1]);

        return;

    } else if (!cStage && initIndex !== undefined && initIndex >= 1) {
        // when this stage calles means prev form complete, so initIndex has to be increated by 1;
        const prevKeyMap = Object.keys(stages)[initIndex];
        const prevFormMessagId = stages[prevKeyMap].messageContainer;
        const prevFormWrapperElt = document.getElementById(prevFormMessagId);
        prevFormWrapperElt.removeEventListener('click', listenerCallNameAdForm);
        initIndex += 1;
        const cKeyMap = Object.keys(stages)[initIndex];
        const nextFormMessageId = stages[cKeyMap].messageContainer;
        const nextFormMessageWrapperElt = document.getElementById(nextFormMessageId);
        listenerCallNameAdForm = (evt) => callNameAdForm(evt,)
        console.log('cStage message id', nextFormMessageId);


    } else if (cStage) {

    }
}


// setTimeout(()=>{
//     dialogContainer.style.display = 'none';
//     formBuildHelper.style.display = 'flex';
//     initialInvitationHelper.style.display = 'block';

// }, 1000);

