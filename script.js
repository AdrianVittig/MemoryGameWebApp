const clicksCounter = document.getElementById("total-clicks");

const stopwatchDisplay = document.getElementById("stopwatch");

const cardsElementHTML = document.querySelectorAll(".card-element");
const cardsContainer = document.querySelector(".cards-container");
const startButtonStopwatch = document.getElementById("start-stop-watch");
const stopButtonStopwatch = document.getElementById("stop-stop-watch");
const restartButtonStopwatch = document.getElementById("restart-stop-watch");

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

//Размешване на карти
const shuffledCards = [...cardImages, ...cardImages].sort(
  () => Math.random() - 0.5
);

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
  toggleButtons();
});

restartButtonStopwatch.addEventListener("click", function () {
  clearInterval(intervalId);
  seconds = 0;
  minutes = 0;
  hours = 0;
  clicks = 0;
  stopwatchDisplay.textContent = "00:00:00";
  clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  if (stopButtonStopwatch.style.display === "inline-block") {
    toggleButtons();
  }
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

function createCards() {
  shuffledCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.value = card;
    cardElement.innerHTML = `<img class = "card-front" src="${card}" alt="card front"/>
    <img class = "card-back" src="imgs/cards/backOfCards.png" alt="card back"/> `;

    cardsContainer.appendChild(cardElement);
  });
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
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

createCards();

if (lockBoard) {
  alert(`You have to press "Start" to play`);
}
