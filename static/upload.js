
function uploadFile() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);
    const fileInput = document.getElementById('fileInput');
    
    // if (!fileInput.files.length) {
    //     document.getElementById('message').innerText = 'No file selected';
    //     return;
    // }

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        sendImgMessage("/uploads/" + data.filename);
        // const messageDiv = document.getElementById('message');
        // if (data.error) {
        //     messageDiv.innerText = 'Error: ' + data.error;
        // } else {
        //     messageDiv.innerText = 'Success: ' + data.message + '\nFilename: ' + data.filename;
        // }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred. Please try again.');
    });
}