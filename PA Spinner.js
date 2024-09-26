// Data structure for the spinner items
const spinnerData = [
  { imageSrc: 'images/apple.png', word: 'apple', initialSound: '/a/' },
  { imageSrc: 'images/alligator.png', word: 'alligator', initialSound: '/a/' },
  { imageSrc: 'images/anchor.png', word: 'anchor', initialSound: '/a/' },
  { imageSrc: 'images/ball.png', word: 'ball', initialSound: '/b/' },
  { imageSrc: 'images/banana.png', word: 'banana', initialSound: '/b/' },
  { imageSrc: 'images/butterfly.png', word: 'butterfly', initialSound: '/b/' },
  { imageSrc: 'images/cat.png', word: 'cat', initialSound: '/c/' },
  { imageSrc: 'images/car.png', word: 'car', initialSound: '/c/' },
  { imageSrc: 'images/cupcake.png', word: 'cupcake', initialSound: '/c/' },
];

// Initialize variables
let selectedItem = null;

// Function to initialize the spinner
function initSpinner() {
  // Implement spinner initialization using a library or custom code
  // For the prototype, this can be a simplified version
}

// Event handler for the spin button
document.getElementById('spin-button').addEventListener('click', () => {
  // Simulate spinning and selecting an item
  selectedItem = spinnerData[Math.floor(Math.random() * spinnerData.length)];
  displayQuestion();
});

// Function to display the question
function displayQuestion() {
  // Hide spinner and show question container
  document.getElementById('spinner-container').style.display = 'none';
  document.getElementById('question-container').style.display = 'block';
  
  // Set image and question text
  document.getElementById('selected-image').src = selectedItem.imageSrc;
  document.getElementById('selected-image').alt = selectedItem.word;
  document.getElementById('question-text').textContent = `What is the first sound of "${selectedItem.word}"?`;
  
  // Reset feedback text
  document.getElementById('feedback-text').textContent = '';
  
  // Shuffle answer options
  shuffleAnswers();
}

// Function to shuffle and display answer options
function shuffleAnswers() {
  const sounds = ['/a/', '/b/', '/c/'];
  const buttons = document.querySelectorAll('.answer-button');
  
  // Shuffle sounds array
  sounds.sort(() => 0.5 - Math.random());
  
  // Assign sounds to buttons
  buttons.forEach((button, index) => {
    button.textContent = sounds[index];
    button.dataset.sound = sounds[index];
  });
}

// Event handler for answer buttons
document.querySelectorAll('.answer-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedSound = e.target.dataset.sound;
    checkAnswer(selectedSound);
  });
});

// Function to check the answer
function checkAnswer(selectedSound) {
  if (selectedSound === selectedItem.initialSound) {
    document.getElementById('feedback-text').textContent = 'Correct! Great job!';
  } else {
    document.getElementById('feedback-text').textContent = `Oops! The correct sound is ${selectedItem.initialSound}`;
  }
  
  // Show next button
  document.getElementById('next-button').style.display = 'inline-block';
});

// Event handler for the next button
document.getElementById('next-button').addEventListener('click', () => {
  // Reset and show spinner
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('spinner-container').style.display = 'block';
  document.getElementById('next-button').style.display = 'none';
});
