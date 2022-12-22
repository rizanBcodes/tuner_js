// const audioElement = document.getElementById("#audioElement")
import { REFERENCE_PITCH } from './constants.js'

let showPitchArea = document.getElementById("showPitchArea");
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);

        // Set the analyser's parameters
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Perform frequency analysis and get the pitch
        function getPitch() {
            analyser.getByteTimeDomainData(dataArray);

            // Find the peak in the frequency spectrum
            let maxVal = 0;
            let maxIndex = 0;
            for (let i = 0; i < bufferLength; i++) {
                if (dataArray[i] > maxVal) {
                    maxVal = dataArray[i];
                    maxIndex = i;
                }
            }

            // Calculate the pitch
            let c_pitch = maxIndex * audioContext.sampleRate / analyser.fftSize;

            function pitchToNote(pitch) {
                const note = 12 * Math.log2(pitch / REFERENCE_PITCH) + 69;
                const index = Math.round(note) % 12;
                return notes[index];
            }
            if (c_pitch) {
                showPitchArea.textContent = pitchToNote(c_pitch)
                console.log(pitchToNote(c_pitch))
            }
        }

        // Call the getPitch function 5 times per second- every 200ms
        setInterval(getPitch, 200);
    })
    .catch(err => {
        console.error(err);
    });





