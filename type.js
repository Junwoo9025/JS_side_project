const TIME = 5;
let game_score = 0;
let time = TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");
const message = document.querySelector(".message");

init();

async function init() {
  buttonChange("loading...");
  try {
    await getWords();
    buttonChange("start game");
    wordInput.addEventListener("input", checkMatch);
    document.addEventListener("keyup", handleRestart);
  } catch (error) {
    console.log(error);
    buttonChange("error");
  }
}

// start the typing game
function run() {
  if (isPlaying) {
    return;
  }
  isPlaying = true;
  time = TIME;
  wordInput.focus();
  game_score = 0;
  scoreDisplay.innerText = game_score;
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkStatus, 50);
  buttonChange("in game");
  wordDisplay.innerText = getNewWord();
}

function getNewWord() {
  const filteredWords = words.filter((word) => word.length < 10);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

// get random words from "https://random-word-api.herokuapp.com/word?number=100"(random words API)
// every time a word will be changed when u play the game.
async function getWords() {
  const response = await axios.get(
    "https://random-word-api.herokuapp.com/word?number=100"
  );
  words = response.data;
}

// check text is matching or not
function checkMatch() {
  if (
    wordInput.value.trim().toLowerCase() ===
    wordDisplay.innerText.trim().toLowerCase()
  ) {
    wordInput.value = "";
    if (!isPlaying) {
      return;
    }
    game_score++;
    scoreDisplay.innerText = game_score;
    time = TIME;
    wordDisplay.innerText = getNewWord();
  }
}

function countDown() {
  time--;
  timeDisplay.innerText = time >= 0 ? time : 0;
  if (time === 0) {
    isPlaying = false;
    message.innerText = "Game over! You lost.";
  }
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    buttonChange("start game");
    clearInterval(timeInterval);
    clearInterval(checkInterval);
  }
}

function buttonChange(text) {
  button.innerText = text;
  if (text === "start game") {
    button.classList.remove("loading");
    button.disabled = false;
  } else {
    button.classList.add("loading");
    button.disabled = true;
  }
}

function handleRestart(event) {
  if (event.code === "Enter") {
    location.reload();
  }
}
