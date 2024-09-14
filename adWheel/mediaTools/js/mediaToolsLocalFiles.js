let files = [];

document.getElementById('addImgBtn').addEventListener('click', function() {
  const newInput = document.createElement('input');
  newInput.type = 'file';
  newInput.name = 'image';
  newInput.style.display = 'none';
  document.body.appendChild(newInput);
  newInput.click();

  newInput.addEventListener('change', function(event) {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file, index) => {
        const fileObject = {
          index: files.length + index,
          value: file
        };
        files.push(fileObject);
        addImagePreview(fileObject);
      });
    }

    newInput.remove();
  });
});

function addImagePreview(fileObject) {
  const previewContainer = document.getElementById('imagePreviewContainer');
  const imageContainer = document.createElement('div');
  imageContainer.className = 'show-form-contaner-div';
  imageContainer.id = `image-container-${fileObject.index}`;

  const img = document.createElement('img');
  img.src = URL.createObjectURL(fileObject.value);
  img.className = 'imgs-showcase';
  img.alt = `preview-${fileObject.index}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = 'X';
  deleteBtn.title = 'видалити';
  deleteBtn.addEventListener('click', function() {
    removeImage(fileObject.index);
  });

  imageContainer.appendChild(img);
  imageContainer.appendChild(deleteBtn);
  previewContainer.appendChild(imageContainer);
}

function removeImage(indexToRemove) {
  files = files.filter(fileObject => fileObject.index !== indexToRemove);
  const containerToRemove = document.getElementById(`image-container-${indexToRemove}`);
  if (containerToRemove) {
    containerToRemove.remove();
  }
}

document.getElementById('uploadLocalImg').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData();

  files.forEach((fileObject) => {
    formData.append(`file-${fileObject.index}`, fileObject.value);
  });

  // Log the FormData to the console
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  window.datasetLocalImg = formData;
  const formDataEvent = new CustomEvent('formDataReady', {detail: window.datasetLocalImg});
  window.dispatchEvent(formDataEvent);

  // Submit logic here should be implemented in async mode to prevent server-side err for files-upload 
  // best approach use putches to upload data as videofiles, img-files, on server-side 
  // requirements parsing files and by send use enc mode, with one-time key encr pairs
  // as to avoide malicious files, promary set the avaluate file-meta, 
  // if file- resolution and file-weight do not corresponds, prevent these files to upload with raise 
  // validation-error user-side before fetch!!! (send FormData to the server)
  
});