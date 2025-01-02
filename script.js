const clicksCounter = document.getElementById("total-clicks");

const stopwatchDisplay = document.getElementById("stopwatch");

const cardsElementHTML = document.querySelectorAll(".card-element");
const cardsContainer = document.querySelector(".cards-container");
const startButtonStopwatch = document.getElementById("start-stop-watch");
const stopButtonStopwatch = document.getElementById("stop-stop-watch");
const restartButtonStopwatch = document.getElementById("restart-stop-watch");
const fruitThemeBtn = document.getElementById("switch-theme");

let score = 0;

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

function getShuffledCards() {
  return currentTheme === "regular"
    ? [...cardImages, ...cardImages].sort(() => Math.random() - 0.5)
    : [...cardImagesFruits, ...cardImagesFruits].sort(
        () => Math.random() - 0.5
      );
}

//Размешване на карти
// const shuffledCards = [...cardImages, ...cardImages].sort(
//   () => Math.random() - 0.5
// );

// const shuffleFruitCards = [...cardImagesFruits, ...cardImagesFruits].sort(
//   () => Math.random() - 0.5
// );

let firstCard = null;
let secondCard = null;

let lockBoard = true;

let clicks = 0;

let hours = 0;
let minutes = 0;
let seconds = 0;
let intervalId = null;

function updateStopwatch() {
  seconds++;
  if (seconds == 60) {
    seconds = 0;
    minutes++;
  }
  if (minutes == 60) {
    minutes = 0;
    hours++;
  }
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  stopwatchDisplay.textContent = formattedTime;
}

startButtonStopwatch.addEventListener("click", function () {
  intervalId = setInterval(updateStopwatch, 10);
  lockBoard = false;
  toggleButtons();
});

stopButtonStopwatch.addEventListener("click", function () {
  clearInterval(intervalId);
  lockBoard = true;
  toggleButtons();
});

restartButtonStopwatch.addEventListener("click", function () {
  clearInterval(intervalId);
  seconds = 0;
  minutes = 0;
  hours = 0;
  clicks = 0;
  lockBoard = true;
  score = 0;
  stopwatchDisplay.textContent = "00:00:00";
  clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  if (stopButtonStopwatch.style.display === "inline-block") {
    toggleButtons();
  }
  cardsContainer.innerHTML = "";
  createCards();
});

function toggleButtons() {
  if (startButtonStopwatch.style.display === "none") {
    startButtonStopwatch.style.display = "inline-block";
    stopButtonStopwatch.style.display = "none";
  } else {
    startButtonStopwatch.style.display = "none";
    stopButtonStopwatch.style.display = "inline-block";
  }
}

cardsContainer.addEventListener("click", (e) => {
  const clickedCard = e.target.closest(".card");
  if (!lockBoard) {
    clicks++;
    clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  }
  if (!clickedCard || lockBoard || clickedCard.classList.contains("flipped")) {
    return;
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
    clearInterval(intervalId);

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
function createCards() {
  const shuffledArray = getShuffledCards();
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

createCards();

if (lockBoard) {
  alert(`You have to press "Start" to play`);
}

function calculateScore() {
  const shuffledArray = getShuffledCards();
  if (shuffledArray.length === 24) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 70) {
      score = 30;
    } else if (totalSeconds > 70 && totalSeconds <= 85) {
      score = 22;
    } else if (totalSeconds > 85 && totalSeconds <= 100) {
      score = 15;
    } else if (totalSeconds > 100 && totalSeconds <= 180) {
      score = 7;
    } else {
      score = 0;
    }
    if (clicks < 70) {
      score += 20;
    }
  }
}

fruitThemeBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "regular" ? "fruits" : "regular";

  fruitThemeBtn.innerHTML = currentTheme === "fruits" ? "♠️" : "🍑";
  updateCardBack();

  document.body.style.backgroundColor =
    currentTheme === "fruits" ? "#f7e6a2" : "#2b5329da";

  createCards();
  updateButtonStyles(currentTheme);
});

function updateButtonStyles(theme) {
  const buttons = document.querySelectorAll(
    "#start-stop-watch, #stop-stop-watch, #restart-stop-watch"
  );
  buttons.forEach((button) => {
    button.classList.remove("regular", "fruits");
    button.classList.add(theme);
  });
}
