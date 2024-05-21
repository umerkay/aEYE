if (!('webkitSpeechRecognition' in window)) {
    alert("Sorry, your browser doesn't support the Web Speech API. Please try Chrome.");
} else {
    // Initialize the Web Speech API
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show interim results
    recognition.lang = 'en-US'; // Set the language

    // Elements
    const toggleButton = document.getElementById('toggle');
    const transcriptElement = document.getElementById('messageInput');

    let isListening = false;

    // Event listener for toggle button
    toggleButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            console.log("stopped")
            // toggleButton.textContent = 'Start Listening';
            toggleButton.innerHTML = "<i class='fas fa-microphone'></i>"
            // transcriptElement.textContent = 'Stopped listening.';
        } else {
            recognition.start();
            toggleButton.innerHTML = "<i class='fas fa-stop'></i>"
            // transcriptElement.textContent = 'Listening...';
        }
        isListening = !isListening;
        console.log(isListening)
    });

    recognition.onstart = e => {
        console.log(e);
    }

    // Event handler for when speech is recognized
    recognition.onresult = (event) => {
        console.log(event)
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        transcriptElement.value = `${finalTranscript} ${interimTranscript}`;
    };

    // Event handler for errors
    recognition.onerror = (event) => {
        console.error(event.error);
        transcriptElement.textContent = `Error occurred: ${event.error}`;
    };

    // Ensure proper state management when recognition ends
    recognition.onend = (e) => {
        // if (isListening) {
            // toggleButton.textContent = 'Start Listening';
            // transcriptElement.textContent = 'Stopped listening.';
            isListening = false;
            // console.log("stopped")
            sendMessage();
        // }
    };

//start and stop the speech recognition when j is pressed and released
// document.addEventListener('keydown', function(e){
//     if(e.key === "j" && !isListening){
//         recognition.start();
//         isListening = true;
//         //set toggle button to hover state
//         document.getElementById('toggle').classList.add('hover');
//     toggleButton.innerHTML = "<i class='fas fa-stop'></i>"
//     }
// });

// document.addEventListener('keyup', function(e){
//     if(e.key === "j" && isListening){
//         recognition.stop();
//         isListening = false;
//         //set toggle button to normal state
//         document.getElementById('toggle').classList.remove('hover');
//     toggleButton.innerHTML = "<i class='fas fa-microphone'></i>"

//     }
// });
}