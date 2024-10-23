const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    
    // Clear previous result and sound
    result.innerHTML = `<h3>Loading...</h3>`;
    sound.setAttribute("src", "");

    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            result.innerHTML = `
            <div class="word">
                <h3>${inpWord}</h3>
                <button id="play-btn" ${data[0].phonetics.length > 0 ? '' : 'disabled'}>
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="details">
                <p>${data[0].meanings[0].partOfSpeech}</p>
                <p>/${data[0].phonetic || ''}/</p>
            </div>
            <p class="word-meaning">
               ${data[0].meanings[0].definitions[0].definition}
            </p>
            <p class="word-example">
                ${data[0].meanings[0].definitions[0].example || ""}
            </p>`;

            // Loop through the phonetics array to find the first valid audio URL
            let audioSrc = "";
            for (let phonetic of data[0].phonetics) {
                if (phonetic.audio) {
                    audioSrc = phonetic.audio.startsWith("http") ? phonetic.audio : `https:${phonetic.audio}`;
                    console.log("Audio URL:", audioSrc);  // Log the URL for debugging
                    break;
                }
            }

            // Check if a valid audio source is found and if it is playable by the browser
            if (audioSrc) {
                // Test if the browser can play this audio type
                let canPlay = sound.canPlayType('audio/mpeg'); // Assuming .mp3 is the file type
                if (canPlay) {
                    sound.setAttribute("src", audioSrc);
                } else {
                    console.error("Browser cannot play this audio format.");
                }
            } else {
                console.error("No audio available for this word.");
            }
        })
        .catch((error) => {
            console.error("Error fetching word data:", error);
            result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        });
});

// Play sound function
function playSound() {
    if (sound.src) {
        sound.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    } else {
        alert("No audio available for this word.");
    }
}

// Event listener for play button
document.addEventListener("click", function (event) {
    if (event.target && event.target.id === 'play-btn') {
        playSound();
    }
});
