// Data structure for the spinner items
const spinnerData = [
  {
    imageSrc: 'images/letter_a/a_alligator.webp',
    word: 'alligator',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_amulet.webp',
    word: 'amulet',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_anchor.webp',
    word: 'anchor',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_ant.webp',
    word: 'ant',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_apple.webp',
    word: 'apple',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_arrow.webp',
    word: 'arrow',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_astronaut.webp',
    word: 'astronaut',
    initialSound: '/a/'
  },
  {
    imageSrc: 'images/letter_a/a_ax.webp',
    word: 'ax',
    initialSound: '/a/'
  }
];

// Initialize variables
let selectedItem = null;

// Check for browser support of Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
const synth = window.speechSynthesis;

// Function to start the application
function startApplication() {
  // Hide start container
  document.getElementById('start-container').style.display = 'none';
  // Begin the first spin
  spinWheel();
}

// Function to spin the wheel (simulated)
function spinWheel() {
  // Simulate spinning and selecting an item
  selectedItem = spinnerData[Math.floor(Math.random() * spinnerData.length)];
  displayQuestion();
}

// Function to display the question
function displayQuestion() {
  // Show question container
  document.getElementById('question-container').style.display = 'block';

  // Set image
  document.getElementById('selected-image').src = selectedItem.imageSrc;
  document.getElementById('selected-image').alt = selectedItem.word;

  // Reset feedback text
  document.getElementById('feedback-text').textContent = '';

  // Speak the question
  speakText(`What is the first sound of the word ${selectedItem.word}? Please say your answer after the beep.`)
    .then(() => {
      // Beep sound to indicate the child can speak
      playBeep();
      // Start speech recognition
      startListening();
    });
}

// Function to start listening to the user's response
function startListening() {
  console.log('Starting speech recognition...');

  recognition.lang = 'en-US';

  // Ensure recognition is stopped before starting
  recognition.abort();

  recognition.start();

  recognition.onstart = function() {
    console.log('Speech recognition started.');
    // Show listening indicator
    document.getElementById('listening-indicator').style.display = 'block';
  };

  recognition.onspeechstart = function() {
    console.log('User started speaking.');
  };

  recognition.onspeechend = function() {
    console.log('User stopped speaking.');
    // Optionally stop recognition if speech has ended
    recognition.stop();
  };

  recognition.onresult = function(event) {
    console.log('Speech recognition result received.');
    // Hide listening indicator
    document.getElementById('listening-indicator').style.display = 'none';

    const spokenWords = event.results[0][0].transcript;
    console.log('User said:', spokenWords);
    checkAnswer(spokenWords);
  };

  recognition.onerror = function(event) {
    // Hide listening indicator
    document.getElementById('listening-indicator').style.display = 'none';

    console.error('Speech recognition error detected:', event.error);
    speakText('Sorry, I did not catch that. Please try again.')
      .then(() => {
        playBeep();
        startListening();
      });
  };

  recognition.onend = function() {
    console.log('Speech recognition ended.');
  };
}

// Function to check the answer
function checkAnswer(userResponse) {
  const normalizedResponse = userResponse.trim().toLowerCase();

  // Map user's spoken words to phonemes
  const phonemeMap = {
    'a': '/a/',
    'ay': '/a/',
    'ah': '/a/',
    // Add more mappings as needed
  };

  // Attempt to match the response to a phoneme
  let matchedPhoneme = null;
  for (const [key, value] of Object.entries(phonemeMap)) {
    if (normalizedResponse === key || normalizedResponse === value.replace(/\//g, '')) {
      matchedPhoneme = value;
      break;
    }
  }

  if (matchedPhoneme === selectedItem.initialSound) {
    document.getElementById('feedback-text').textContent = 'Correct! Great job!';
    speakText('Correct! Great job!')
      .then(() => {
        // Proceed to next item after a short delay
        setTimeout(() => {
          spinWheel();
        }, 2000);
      });
  } else {
    document.getElementById('feedback-text').textContent =
      `Oops! The correct sound is ${selectedItem.initialSound}`;
    speakText(`Oops! The correct sound is ${selectedItem.initialSound}. Let's try another one.`)
      .then(() => {
        // Proceed to next item after a short delay
        setTimeout(() => {
          spinWheel();
        }, 2000);
      });
  }
}

// Function to speak text using speech synthesis
function speakText(text) {
  return new Promise((resolve, reject) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'en-US';
    utterThis.rate = 0.9; // Slower speech rate for clarity
    utterThis.pitch = 1.0; // Default pitch

    utterThis.onend = function() {
      resolve();
    };

    utterThis.onerror = function(event) {
      console.error('Speech synthesis error:', event.error);
      reject(event.error);
    };

    synth.speak(utterThis);
  });
}

// Function to play a beep sound
function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1000, context.currentTime); // Frequency in hertz
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.2); // Beep lasts 0.2 seconds
}

// Initialize the application after user interaction
window.onload = function() {
  if (!SpeechRecognition || !synth) {
    alert('Your browser does not support speech recognition or speech synthesis. Please try this application in a supported browser like Google Chrome.');
  } else {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Wait for user interaction before starting the application
    document.getElementById('start-button').addEventListener('click', () => {
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          // Microphone access granted
          startApplication();
        })
        .catch(function(err) {
          console.error('Microphone access denied:', err);
          alert('Microphone access is required for this application to work.');
        });
    });
  }
};
