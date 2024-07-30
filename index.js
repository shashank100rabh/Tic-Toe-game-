const gameboardContainer = document.querySelector("#gameboard");
const emptyArray = new Array(9).fill("");
const turn = document.querySelector(".turn");
const button = document.querySelector(".button");
const moveHistory = document.querySelector(".move-history");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const startButton = document.getElementById("startButton");

const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");

let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Score = 0;
let player2Score = 0;
let usedVal = "cross";
let count = 0;
let winflag = false;
const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startButton.addEventListener("click", () => {
  player1Name = player1Input.value || "Player 1";
  player2Name = player2Input.value || "Player 2";
  buildGame();
});

function startGame() {
  let currentPlayer = usedVal === "cross" ? player1Name : player2Name;
  let currentSymbol = usedVal === "cross" ? "❌" : "⭕";
  turn.innerText = `${currentPlayer}'s (${currentSymbol}) turn!`;
}

function buildGame() {
  gameboardContainer.innerHTML = "";
  moveHistory.innerHTML = "";
  emptyArray.forEach((_el, idx) => {
    const div = document.createElement("div");
    div.classList.add("gameboard-cell");
    gameboardContainer.appendChild(div);
    div.setAttribute("id", idx);
    div.addEventListener("click", addChoice);
  });
  startGame();
  button.style.display = "none";
  count = 0;
  winflag = false;
}

function addChoice(event) {
  count++;
  const circle = document.createElement("div");
  const cross = document.createElement("div");

  circle.classList.add("gameboard-circle");
  cross.classList.add("gameboard-cross");

  const currentId = event.target.id;
  usedVal = usedVal === "circle" ? "cross" : "circle";
  usedVal === "circle"
    ? event.target.append(circle)
    : event.target.append(cross);

  let currentPlayer = usedVal === "cross" ? player1Name : player2Name;
  let currentSymbol = usedVal === "cross" ? "❌" : "⭕";
  moveHistory.innerHTML += `<li>${currentPlayer} placed ${currentSymbol} at cell ${currentId}</li>`;

  startGame();
  event.target.removeEventListener("click", addChoice);
  winningPrediction();
}

function winningPrediction() {
  const squares = document.querySelectorAll(".gameboard-cell");

  winningCombination.forEach((combination) => {
    const circleFlag = combination.every((el) =>
      squares[el]?.firstChild?.classList.contains("gameboard-circle")
    );

    if (circleFlag) {
      turn.innerText = `${player2Name} (⭕) won!`;
      combination.forEach((el) => {
        squares[el]?.firstChild.classList.add("win");
      });
      squares.forEach((square) => square.replaceWith(square.cloneNode(true)));
      winflag = true;
      player2Score++;
      updateScore();
      button.style.display = "block";
      return;
    }

    const crossFlag = combination.every((el) =>
      squares[el]?.firstChild?.classList.contains("gameboard-cross")
    );

    if (crossFlag) {
      turn.innerText = `${player1Name} (❌) won!`;
      combination.forEach((el) => {
        squares[el]?.firstChild.classList.add("win");
      });
      squares.forEach((square) => square.replaceWith(square.cloneNode(true)));
      winflag = true;
      player1Score++;
      updateScore();
      button.style.display = "block";
      return;
    }
  });

  if (!winflag && count === 9) {
    turn.innerText = "Game Over! It's a draw!";
    button.style.display = "block";
  }
}

function updateScore() {
  player1ScoreElement.innerText = player1Score;
  player2ScoreElement.innerText = player2Score;
}

function reset(e) {
  e.preventDefault();
  buildGame();
}

button.addEventListener("click", reset);
