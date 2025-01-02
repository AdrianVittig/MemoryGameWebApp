const clicksCounter = document.getElementById("total-clicks");
const cardsElementHTML = document.querySelectorAll(".card-element");
const cardsContainer = document.querySelector(".cards-container");
const restartButtonStopwatch = document.getElementById("restart-stop-watch");
const fruitThemeBtn = document.getElementById("switch-theme");
const modal = document.getElementById("level-modal");

let score = 0;

let currentLevel = "easy";

let intervalId = null;

let firstCard = null;
let secondCard = null;

let lockBoard = true;

let clicks = 0;

const levels = {
  easy: { pairs: 8, timeLimit: 120, scoreMultiplier: 1 },
  medium: { pairs: 12, timeLimit: 120, scoreMultiplier: 2 },
  hard: { pairs: 16, timeLimit: 120, scoreMultiplier: 5 }
};

const cardImages = [
  "imgs/cards/Jack_of_clubs.svg.png",
  "imgs/cards/Jack_of_diamonds.svg.png",
  "imgs/cards/Jack_of_hearts.svg.png",
  "imgs/cards/Jack_of_spades.svg.png",
  "imgs/cards/Queen_of_clubs.svg.png",
  "imgs/cards/Queen_of_diamonds.svg.png",
  "imgs/cards/Queen_of_hearts.svg.png",
  "imgs/cards/Queen_of_spades.svg.png",
  "imgs/cards/King_of_clubs.svg.png",
  "imgs/cards/King_of_diamonds.svg.png",
  "imgs/cards/Ace_of_hearts.svg.png",
  "imgs/cards/Ace_of_spades.svg.png"
];

const cardImagesFruits = [
  "imgs/cards/printable-flash-card-of-fruits-apple-1.png",
  "imgs/cards/printable-flash-card-of-fruits-grapes-1.png",
  "imgs/cards/printable-flash-card-of-fruits-kiwifruit-1.png",
  "imgs/cards/printable-flash-card-of-fruits-lemon-1.png",
  "imgs/cards/printable-flash-card-of-fruits-banana-1.png",
  "imgs/cards/printable-flash-card-of-fruits-orange-1-2-1024x1024.png",
  "imgs/cards/printable-flash-card-of-fruits-peach-1.png",
  "imgs/cards/printable-flash-card-of-fruits-pineapple-1.png",
  "imgs/cards/printable-flash-card-of-fruits-strawberry-1.png",
  "imgs/cards/printable-flash-card-of-fruits-watermelon-1.png",
  "imgs/cards/printable-flash-card-of-fruits-pomegranate-1.png"
];

let currentTheme = "regular";
let timerId = null;
function getShuffledCards(level) {
  const pairs = levels[level].pairs;
  const cards = currentTheme === "fruits" ? cardImagesFruits : cardImages;
  return [...cards.slice(0, pairs), ...cards.slice(0, pairs)].sort(
    () => Math.random() - 0.5
  );
}

window.addEventListener("load", () => {
  modal.style.display = "flex";
});

document.querySelectorAll(".level-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const level = e.target.id.replace("-level", "");
    startGame(level);
    document.getElementById("level-modal").style.display = "none";
  });
});

function startGame(level) {
  restartGame();
}

function startTimer(level) {
  let timeLeft = levels[level].timeLimit;
  const timerDisplay = document.getElementById("timer");

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time left: ${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

    if (timeLeft === 0) {
      clearInterval(timerId);
      calculateScore(timeLeft);
      alert("You have no time left.");
    } else {
      timeLeft--;
    }
  }
  clearInterval(timerId);
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

//Размешване на карти
// const shuffledCards = [...cardImages, ...cardImages].sort(
//   () => Math.random() - 0.5
// );

// const shuffleFruitCards = [...cardImagesFruits, ...cardImagesFruits].sort(
//   () => Math.random() - 0.5
// );

restartButtonStopwatch.addEventListener("click", function () {
  restartGame();
});

cardsContainer.addEventListener("click", (e) => {
  const clickedCard = e.target.closest(".card");
  if (!clickedCard || lockBoard || clickedCard.classList.contains("flipped")) {
    return;
  } else {
    clicks++;
    clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  }

  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;

  checkMatch();
});

function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard = null;
    secondCard = null;
    checkForWin();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 350);
  }
}
calculateScore();
function checkForWin() {
  const allMatched = [...cardsContainer.children].every((card) =>
    card.classList.contains("flipped")
  );

  if (allMatched) {
    clearInterval(timerId);

    setTimeout(() => {
      alert(`Your score is ${score}🥳🎉`);
    }, 500);
  }
}

function updateCardBack() {
  const backImage =
    currentTheme === "fruits"
      ? "imgs/cards/printable-flash-card-of-fruits-avocado-1.png"
      : "imgs/cards/backOfCards.png";

  const cardBacks = document.querySelectorAll(".card-back");
  cardBacks.forEach((cardBack) => {
    cardBack.src = backImage;
  });
}

function createCards(level) {
  const shuffledArray = getShuffledCards(level);
  const backImage =
    currentTheme === "fruits"
      ? "imgs/cards/printable-flash-card-of-fruits-avocado-1.png"
      : "imgs/cards/backOfCards.png";
  cardsContainer.innerHTML = "";

  shuffledArray.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.value = card;

    cardElement.innerHTML = `
      <img class="card-front" src="${card}" alt="card front"/>
      <img class="card-back" src="${backImage}" alt="card back"/>
    `;

    cardsContainer.appendChild(cardElement);
  });
}

createCards(currentLevel);

if (lockBoard) {
  alert(`You have to press "Start" to play`);
}

function calculateScore(timeLeft) {
  const shuffledArray = getShuffledCards(currentLevel);
  if (shuffledArray.length === levels[currentLevel].pairs * 2) {
    const totalSeconds = levels[currentLevel].timeLimit - timeLeft;

    if (clicks <= 25) {
      score = 30;
    } else if (clicks > 25 && clicks <= 35) {
      score = 22;
    } else if (clicks > 35 && clicks <= 45) {
      score = 15;
    } else if (clicks > 45 && clicks <= 55) {
      score = 7;
    } else {
      score = 0;
    }
  }
}

fruitThemeBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "regular" ? "fruits" : "regular";

  fruitThemeBtn.innerHTML = currentTheme === "fruits" ? "♠️" : "🍑";
  updateCardBack();

  document.body.style.backgroundColor =
    currentTheme === "fruits" ? "#f7e6a2" : "#2b5329da";

  createCards(currentLevel);
  updateButtonStyles(currentTheme);
});

function updateButtonStyles(theme) {
  const buttons = [restartButtonStopwatch];
  buttons.forEach((button) => {
    button.classList.remove("regular", "fruits");
    button.classList.add(theme);
  });
}

function restartGame(level = currentLevel) {
  clearInterval(timerId);

  clicks = 0;
  lockBoard = false;
  score = 0;
  firstCard = null;
  secondCard = null;

  clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  cardsContainer.innerHTML = "";
  createCards(level);
  startTimer(level);
}
