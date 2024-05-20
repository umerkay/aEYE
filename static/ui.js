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
        body: JSON.stringify({ prompt: message, image: IMAGE_PATH })
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