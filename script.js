// Word groups categorized by vowel sounds and word types
const wordGroups = {
    cvc: {
        a: [
            'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'fat', 'lap', 'tap',
            'pan', 'can', 'man', 'ran', 'fan', 'bad', 'mad', 'sad', 'dad', 'bag',
            'tag', 'lag', 'rag', 'jam', 'ram', 'dam', 'ham', 'cap', 'nap', 'sap',
        ],
        e: [
            'bet', 'met', 'let', 'pet', 'net', 'set', 'wet', 'pen', 'den', 'men',
            'red', 'led', 'fed', 'bed', 'beg', 'peg', 'leg', 'ten', 'hen', 'ben',
            'jet', 'vet', 'get',
        ],
        i: [
            'bit', 'fit', 'kit', 'sit', 'lit', 'hit', 'pit', 'tip', 'rip', 'zip',
            'win', 'bin', 'pin', 'sin', 'tin', 'fin', 'kid', 'lid', 'rid', 'mid',
            'big', 'dig', 'pig', 'wig', 'jig', 'fig', 'mix', 'fix', 'six', 'nix',
        ],
        o: [
            'hot', 'cot', 'dot', 'lot', 'pot', 'not', 'got', 'rot', 'log', 'dog',
            'bog', 'fog', 'hog', 'jog', 'mom', 'pop', 'mop', 'top', 'hop', 'cop',
            'bob', 'rob', 'sob', 'job', 'nod', 'pod', 'rod', 'cod', 'fox', 'box',
        ],
        u: [
            'but', 'cut', 'hut', 'nut', 'rug', 'bug', 'jug', 'mug', 'hug', 'bun',
            'fun', 'run', 'sun', 'gun', 'pun', 'cub', 'tub', 'sub', 'rub',
            'mud', 'bud', 'dug', 'lug', 'pug', 'gum',
        ],
    },
    ccvc: {
        a: [
            'blab', 'brag', 'clad', 'clam', 'clap', 'crab', 'flag', 'flap', 'grab', 'plan', 'slab', 'slap', 'snap', 'trap',
        ],
        e: [
            'bled', 'bred', 'fled', 'sled', 'step',
        ],
        i: [
            'blip', 'brim', 'clip', 'drip', 'flip', 'flit', 'grip', 'slim', 'slip', 'slit', 'spin', 'trip', 'twig', 'twit', 'grit', 'skim',
        ],
        o: [
            'bloc', 'blob', 'clod', 'clog', 'clop', 'crop', 'drop', 'flog', 'flop', 'frog', 'plot', 'prod', 'slot', 'trot',
        ],
        u: [
            'blub', 'drub', 'drum', 'drug', 'glum', 'plug', 'slug', 'slum', 'smug', 'snug',
        ],
    },
};

// Merge all words into one array for 'all' selection
const allCvcWords = Object.values(wordGroups.cvc).flat();
const allCcvcWords = Object.values(wordGroups.ccvc).flat();

const audioPath = './'; // Audio files are in the main directory

let revealedWords = 0;
let usedWords = [];
let score = 0;

const spinButton = document.getElementById('spinButton');
const wordBox = document.getElementById('wordBox');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const complimentBox = document.getElementById('complimentBox');
const vowelSelector = document.getElementById('vowelSelector');
const vowelSelection = document.getElementById('vowelSelection'); // Reference to the vowel selection div
const wordTypeSelector = document.getElementById('wordTypeSelector');
const scoreText = document.getElementById('scoreText');

// Preload letter sounds
const letterSounds = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
    const audio = new Audio(`${audioPath}${letter}.mp3`);
    letterSounds[letter] = audio;
});

// Preload compliments
const compliments = ['Great job!', 'Fantastic!', 'Well done!', 'You did it!', 'Awesome!'];

// Voice selection for word pronunciation
let selectedVoice = null;

function loadVoices() {
    return new Promise((resolve) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        let voicesChanged = false;
        speechSynthesis.onvoiceschanged = () => {
            if (!voicesChanged) {
                voicesChanged = true;
                voices = speechSynthesis.getVoices();
                resolve(voices);
            }
        };
        // Fallback if onvoiceschanged doesn't fire
        setTimeout(() => {
            if (!voicesChanged) {
                voices = speechSynthesis.getVoices();
                resolve(voices);
            }
        }, 1000);
    });
}

async function setVoice() {
    if ('speechSynthesis' in window) {
        let voices = await loadVoices();
        if (voices.length === 0) {
            // Retry loading voices after a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            voices = speechSynthesis.getVoices();
        }
        if (voices.length > 0) {
            // Try to find a female voice speaking English
            selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'));
            // If no female voice, use any English voice
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
            }
            // If no English voice, use the first available voice
            if (!selectedVoice) {
                selectedVoice = voices[0];
            }
        } else {
            console.warn('No speech synthesis voices available.');
        }
    } else {
        console.warn('Speech Synthesis API is not supported on this browser.');
    }
}

function speak(text) {
    return new Promise((resolve) => {
        if (selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;
            utterance.onend = resolve;
            speechSynthesis.speak(utterance);
        } else {
            // Fallback: Do nothing or log to console
            console.warn(`Speech synthesis not available. Text: ${text}`);
            resolve();
        }
    });
}

// Function to check if a letter is a vowel
function isVowel(letter) {
    return 'aeiou'.includes(letter.toLowerCase());
}

// Update the score
function updateScore() {
    score += 10; // Add points per word
    scoreText.textContent = `Score: ${score}`;
}

// Update progress indicators
function updateProgress() {
    revealedWords = usedWords.length;
    const availableWords = getAvailableWords();
    const totalWords = availableWords.length;

    // Ensure totalWords is not zero to avoid division by zero
    const progressPercentage = totalWords > 0 ? (revealedWords / totalWords) * 100 : 0;
    progressText.textContent = `${revealedWords} / ${totalWords} Words Revealed`;

    progressFill.style.width = `${progressPercentage}%`;
}

// Give a compliment
function giveCompliment() {
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    complimentBox.textContent = compliment;
    complimentBox.style.color = 'green';
    complimentBox.style.fontSize = '30px';
    complimentBox.style.opacity = '1'; // Fade in

    // Speak the compliment
    speak(compliment);

    // Fade out after a delay
    setTimeout(() => {
        complimentBox.style.opacity = '0';
    }, 2000);
}

// Play audio for a letter
function playLetterSound(letter) {
    return new Promise((resolve) => {
        const letterSound = letterSounds[letter.toLowerCase()];
        if (letterSound) {
            letterSound.currentTime = 0;
            letterSound.play().then(() => {
                letterSound.onended = resolve;
            }).catch((error) => {
                console.error(`Error playing sound for letter "${letter}":`, error);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

// Reveal the word with animations and audio
async function revealWord(word) {
    wordBox.innerHTML = ''; // Clear previous word
    const letterSpans = [];

    let delay = 500; // Initial delay

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const span = document.createElement('span');
        span.textContent = letter;
        if (isVowel(letter)) {
            span.classList.add('vowel');
        }
        wordBox.appendChild(span);
        letterSpans.push(span);

        // Set animation order for CSS
        span.style.setProperty('--animation-order', i + 1);
    }

    // Play letter sounds with delays matching the CSS animation
    for (let i = 0; i < letterSpans.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));
        await playLetterSound(letterSpans[i].textContent);
        delay = 500; // Set delay between letters
    }

    // Wait for the last letter animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Speak the whole word
    await speak(word);

    // Give a compliment
    giveCompliment();

    // Update score
    updateScore();

    // Update progress
    updateProgress();
}

// Get available words based on selected word type and vowel
function getAvailableWords() {
    const selectedWordType = wordTypeSelector.value;
    const selectedVowel = vowelSelector.value;

    if (selectedWordType === 'cvc') {
        if (selectedVowel === 'all') {
            return allCvcWords;
        }
        return wordGroups.cvc[selectedVowel] || [];
    } else if (selectedWordType === 'ccvc') {
        if (selectedVowel === 'all') {
            return allCcvcWords;
        }
        return wordGroups.ccvc[selectedVowel] || [];
    }
    return [];
}

// Get a random word from available words
function getRandomWord() {
    const availableWords = getAvailableWords();

    // Filter out used words to get the list of remaining words
    const remainingWords = availableWords.filter(word => !usedWords.includes(word));

    // If all words have been used, inform the user and reset the usedWords array
    if (remainingWords.length === 0) {
        alert('You have gone through all the words! The list will reset.');
        usedWords = [];
        revealedWords = 0;
        updateProgress();
        return getRandomWord();
    }

    // Select a random word from the remaining words
    const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    usedWords.push(word);
    return word;
}

// Spin function to start the word reveal process
async function spin() {
    spinButton.disabled = true; // Prevent multiple clicks
    wordBox.classList.add('shake');
    setTimeout(() => {
        wordBox.classList.remove('shake');
    }, 500);
    complimentBox.textContent = ''; // Clear compliment
    complimentBox.style.opacity = '0'; // Reset opacity
    const word = getRandomWord();
    try {
        await revealWord(word);
    } catch (error) {
        console.error('Error during word reveal:', error);
    }
    spinButton.disabled = false;
}

// Event listener for vowel selection change
vowelSelector.addEventListener('change', () => {
    usedWords = [];
    revealedWords = 0;
    updateProgress();
});

// Event listener for word type selection change
wordTypeSelector.addEventListener('change', () => {
    usedWords = [];
    revealedWords = 0;
    updateProgress();

    // Ensure the vowel selector is always visible
    vowelSelection.style.visibility = 'visible';
});

// Initialize
spinButton.addEventListener('click', spin);
setVoice();

// Initial progress update
updateProgress();

// Initial score update
scoreText.textContent = `Score: ${score}`;
