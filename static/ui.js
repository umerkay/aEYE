function createMessage(message, isSent = true) {
    if (!IMAGE_PATH) {
        document.getElementById("welcome").style.display = "none";
    }
    const messageDiv = document.createElement('div');
    messageDiv.classList.add("message", isSent ? "sent" : "received");
    messageDiv.innerText = message;
    document.getElementById('chatMessages').appendChild(messageDiv);
}

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (!message) {
        return;
    }
    if(!IMAGE_PATH) {
        alert('Please upload an image first');
        return;
    }
    document.getElementById('messageInput').value = "";
    createMessage(message);
    receiveMessage(null)

    fetch('/prompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: message.toLowerCase(), image: IMAGE_PATH })
    }).then(response => response.json())
    .then(data => {
        receiveMessage(data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred. Please try again.');
    });
}

let IMAGE_PATH = "";

function sendImgMessage(path) {
    if (!IMAGE_PATH) {
        document.getElementById("welcome").style.display = "none";
    }
    if(!path) {
        return;
    }
    const message = document.createElement('img');
    message.src = path;
    console.log(message);
    const messageDiv = document.createElement('div');
    messageDiv.classList.add("message", "sent");
    messageDiv.appendChild(message);
    document.getElementById('chatMessages').appendChild(messageDiv);
    IMAGE_PATH = path;
}

function receiveMessage(message) {
    if(message === null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add("message", "received");
        messageDiv.id = "loading";
        messageDiv.innerText = "thinking...";
        document.getElementById('chatMessages').appendChild(messageDiv);
    } else {
        document.getElementById("loading").remove();
        createMessage(message, false);
    }
}

// Access the video element and canvas element
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');


let capturing = false;

// Function to capture the image
function captureImage() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
    });
}

// Event listener for keydown event
document.getElementById("container").addEventListener('keydown', (event) => {
    if (event.key === 'f' && !capturing) {
        video.classList.remove("hidden");

        capturing = true;
        // Request access to the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing webcam:', err);
        });
    }
});

// Event listener for keyup event
document.getElementById("container").addEventListener('keyup', async (event) => {
    if (event.key === 'f' && capturing) {
        const img = await captureImage();
        const formData = new FormData();
        formData.append('file', img, 'capture.png');
        capturing = false;
        // Stop capturing the video
        video.srcObject.getVideoTracks().forEach(track => track.stop());
        video.classList.add("hidden");

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
});