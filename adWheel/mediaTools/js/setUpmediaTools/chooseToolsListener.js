async function setUpdatapicker(callback, formData, actionType, ...triggersIds) {
    document.addEventListener('isrotatingTools', async (event) => {
        const { isrotating } = event.detail;

        // Call the callback function, passing the necessary arguments
        await callback(isrotating, formData, actionType, ...triggersIds);
    });
}

async function itiateToolsListener(isrotating, formData, actionType, targetWrapper, ...triggersIds) {
    const raiseFormToUpply = async (event, initiatorElt, targetWrapper) => {
        console.log('Processing form update...');
        initiatorElt.parentNode.style.display = 'none'; // Hide initiator element
        targetWrapper.style.display = 'block'; // Show target wrapper

        // Remove event listeners from all tracked elements
        Array.from(triggersIds).forEach((elt) => {
            const eltEl = document.getElementById(elt);
            if (eltEl) {
                eltEl.removeEventListener(actionType, funWrapper); // Ensure the same function reference
            }
        });
    }

    // This wrapper function ensures the `raiseFormToUpply` is properly called with necessary arguments
    let funWrapper = async (event) => {
        const initiatorElt = event.target;
        await raiseFormToUpply(event, initiatorElt, targetWrapper);
    };

    if (isrotating === false) {
        // Add event listeners to each element
        Array.from(triggersIds).forEach((elt) => {
            const cElement = document.getElementById(elt);
            if (cElement) {
                cElement.addEventListener(actionType, funWrapper); // Add event listener to each element
            }
        });
    } else {
        // Optionally, you can remove listeners here if needed when isrotating is true
        Array.from(triggersIds).forEach((elt) => {
            const cElement = document.getElementById(elt);
            if (cElement) {
                cElement.removeEventListener(actionType, funWrapper); // Clean up if necessary
            }
        });
    }
}


