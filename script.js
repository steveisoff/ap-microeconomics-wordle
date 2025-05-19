const words = [
  'supply',
  'demand',
  'trade',
  'price',
  'curve',
  'costs',
  'goods',
  'firms',
  'labor',
  'quota'
];

// Only use 5-letter words for the game board, filter if needed
const wordBank = words.filter(word => word.length === 5);

const targetWord = wordBank[Math.floor(Math.random() * wordBank.length)];
const maxAttempts = 6;

let currentAttempt = 0;
let currentGuess = '';

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');

// Initialize the game board
for (let i = 0; i < maxAttempts * 5; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  board.appendChild(cell);
}

// Initialize the keyboard
const letters = 'abcdefghijklmnopqrstuvwxyz';
for (const letter of letters) {
  const key = document.createElement('button');
  key.classList.add('key');
  key.innerText = letter;
  key.addEventListener('click', () => handleKeyPress(letter));
  keyboard.appendChild(key);
}

function handleKeyPress(letter) {
  if (currentGuess.length < 5) {
    currentGuess += letter;
    updateBoard();
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  const start = currentAttempt * 5;
  for (let i = 0; i < 5; i++) {
    cells[start + i].innerText = currentGuess[i] || '';
  }
}

document.addEventListener('keydown', (event) => {
  const letter = event.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) {
    handleKeyPress(letter);
  } else if (event.key === 'Enter') {
    submitGuess();
  } else if (event.key === 'Backspace') {
    handleBackspace();
  }
});

function handleBackspace() {
  currentGuess = currentGuess.slice(0, -1);
  updateBoard();
}

function submitGuess() {
  if (currentGuess.length !== 5) return;
  if (!wordBank.includes(currentGuess)) {
    alert('Not in word list!');
    return;
  }

  const cells = document.querySelectorAll('.cell');
  const start = currentAttempt * 5;

  // Copy so we don't mutate the original
  let targetArr = targetWord.split('');
  let guessArr = currentGuess.split('');

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    const cell = cells[start + i];
    if (guessArr[i] === targetArr[i]) {
      cell.classList.add('correct');
      updateKey(guessArr[i], 'correct');
      targetArr[i] = null; // Mark as matched
      guessArr[i] = null;
    }
  }
  // Second pass: present letters
  for (let i = 0; i < 5; i++) {
    const cell = cells[start + i];
    if (guessArr[i] && targetArr.includes(guessArr[i])) {
      cell.classList.add('present');
      updateKey(guessArr[i], 'present');
      targetArr[targetArr.indexOf(guessArr[i])] = null;
    } else if (guessArr[i]) {
      cell.classList.add('absent');
      updateKey(guessArr[i], 'absent');
    }
  }

  if (currentGuess === targetWord) {
    setTimeout(() => alert('You Win!'), 100);
    return;
  }

  currentAttempt++;
  currentGuess = '';

  if (currentAttempt === maxAttempts) {
    setTimeout(() => alert(`You Lose! The word was ${targetWord}`), 100);
  }
}

function updateKey(letter, status) {
  const keys = document.querySelectorAll('.key');
  for (const key of keys) {
    if (key.innerText === letter) {
      key.classList.add(status);
    }
  }
}
