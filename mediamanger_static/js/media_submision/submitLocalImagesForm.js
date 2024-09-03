document.addEventListener('DOMContentLoaded', function(){
    const submissionForm = (event) => {
        const formData = event.detail;
        console.log('here form Data', formData);
    };
    window.addEventListener('formDataReady', submissionForm);
})

