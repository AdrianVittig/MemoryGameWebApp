const clicksCounter = document.getElementById("total-clicks");

const stopwatchDisplay = document.getElementById("stopwatch");

const cardsElementHTML = document.querySelectorAll(".card-element");

const startButtonStopwatch = document.getElementById("start-stop-watch");
const stopButtonStopwatch = document.getElementById("stop-stop-watch");
const restartButtonStopwatch = document.getElementById("restart-stop-watch");

let clicks = 0;

cardsElementHTML.forEach(function (card) {
  card.addEventListener("click", function () {
    if (!card.classList.add("flipped")) {
      card.classList.add("flipped");
      console.log(`Картата е обърната`);
    }
    clicks++;
    clicksCounter.textContent = `Total Clicks 👆: ${clicks}`;
  });
});

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
