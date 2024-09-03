## License and Copyright

This project includes code from React, which is licensed under the MIT License. The original React license and copyright notice are included in the respective files.

### KolivaDev Team Rights

The modifications and usage of this code by KolivaDev are under our internal team rights. All rights reserved for the content and any copies of the code are managed by the KolivaDev team.

# UploadLocalImages Component

## Overview

The `UploadLocalImages` component is designed to allow users to upload multiple images from their local device, display the selected images in a carousel format, and manage the uploaded images by allowing for their removal. The component also stores and manages the file paths for potential use in form submissions or other backend processes.

## Features

- **File Upload**: Users can upload multiple images at once.
- **Image Carousel**: Displays selected images in a horizontal carousel with the ability to remove individual images.
- **File Paths Management**: Tracks and stores the paths of selected images.

## IDs and Classes

### IDs

- **`uploadFromLocal`**:  
  - **Description**: The main container div for the entire upload section.
  - **Purpose**: Wraps the upload tool and the image carousel.

- **`chooseFileTool`**:  
  - **Description**: A container div that holds the title and upload button.
  - **Purpose**: Groups the title and button for selecting images.

- **`toolTitile`**:  
  - **Description**: A heading element for the file selection tool.
  - **Purpose**: Displays the title "Обрати зображення" (which translates to "Choose Image").

- **`hiddenFileInput`**:  
  - **Description**: A hidden file input element.
  - **Purpose**: Triggered by the custom button to open the file picker for image selection.

- **`imagesShowCase`**:  
  - **Description**: A div that serves as the container for the image carousel.
  - **Purpose**: Displays the uploaded images horizontally with the option to remove them.

- **`imgShowcaseContainer`**:  
  - **Description**: A container div for each image in the carousel.
  - **Purpose**: Wraps individual images and their associated removal button.

- **`chosen-{index}`**:  
  - **Description**: An ID for each image in the carousel.
  - **Purpose**: Uniquely identifies each image based on its index in the array.

### Classes

- **`media-source`**:  
  - **Description**: A general class applied to multiple container elements.
  - **Purpose**: Used to style sections that manage media sources like images and videos.

- **`add-img-button`**:  
  - **Description**: Class for the custom button that opens the file picker.
  - **Purpose**: Provides styling for the "Add Image" button.

- **`chosen-media`**:  
  - **Description**: Class applied to the image carousel container.
  - **Purpose**: Ensures the image showcase area is styled with overflow and padding.

- **`chosen-items`**:  
  - **Description**: Class applied to each image within the carousel.
  - **Purpose**: Styles each image with specific dimensions and object fit.

## Usage

To use the `UploadLocalImages` component, simply import it into your React application and include it in your JSX.

```javascript
import UploadLocalImages from './UploadLocalImages';

function App() {
    return (
        <div>
            <UploadLocalImages />
        </div>
    );
}
