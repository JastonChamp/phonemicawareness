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
const recognition = new SpeechRecognition();
const synth = window.speechSynthesis;

// Function to start the application
function startApplication() {
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
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function(event) {
    const spokenWords = event.results[0][0].transcript;
    checkAnswer(spokenWords);
  };

  recognition.onerror = function(event) {
    console.error('Speech recognition error detected: ' + event.error);
    speakText('Sorry, I did not catch that. Please try again.')
      .then(() => {
        playBeep();
        startListening();
      });
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

// Start the application
window.onload = function() {
  if (!SpeechRecognition || !synth) {
    alert('Your browser does not support speech recognition or speech synthesis. Please try this application in a supported browser like Google Chrome.');
  } else {
    startApplication();
  }
};
