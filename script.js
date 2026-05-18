const ROWS = 6;
const COLS = 7;
const TURN_TIME = 15;

let grid;
let currentPlayer;
let gameOver;

let timer;
let timeLeft = TURN_TIME;

let scores = [0,0];

let previousWinner = "None";

const board = document.getElementById("board");

const statusText = document.getElementById("status");

const timerText = document.getElementById("time");

const popup = document.getElementById("popup");

const popupText = document.getElementById("popupText");

const previousWinnerText =
document.getElementById("previousWinner");

const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");

function getPlayerName(player){

  if(player === 1){

    return document.getElementById("player1").value
    || "Player 1";
  }

  return document.getElementById("player2").value
  || "Player 2";
}

function init(){

  board.innerHTML = "";

  grid = Array.from(
    {length:ROWS},
    () => Array(COLS).fill(0)
  );

  currentPlayer = 1;

  gameOver = false;

  document.getElementById("name1").textContent =
  getPlayerName(1);

  document.getElementById("name2").textContent =
  getPlayerName(2);

  updateStatus();

  updateCards();

  createBoard();

  startTimer();
}

function createBoard(){

  for(let r=0;r<ROWS;r++){

    for(let c=0;c<COLS;c++){

      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener("click",() => {
        dropPiece(c);
      });

      cell.addEventListener("mouseenter",() => {
        showPreview(c);
      });

      board.appendChild(cell);
    }
  }

  board.addEventListener(
    "mouseleave",
    clearPreview
  );
}

function getCell(r,c){

  return document.querySelector(
    `.cell[data-row="${r}"][data-col="${c}"]`
  );
}

function showPreview(col){

  clearPreview();

  if(gameOver) return;

  for(let r=ROWS-1;r>=0;r--){

    if(grid[r][col] === 0){

      const cell = getCell(r,col);

      cell.classList.add(
        currentPlayer === 1
        ? "preview-p1"
        : "preview-p2"
      );

      break;
    }
  }
}

function clearPreview(){

  document.querySelectorAll(".cell")
  .forEach(cell => {

    cell.classList.remove(
      "preview-p1",
      "preview-p2"
    );
  });
}

function dropPiece(col){

  if(gameOver) return;

  let row = -1;

  for(let r=ROWS-1;r>=0;r--){

    if(grid[r][col] === 0){

      row = r;

      break;
    }
  }

  if(row === -1) return;

  grid[row][col] = currentPlayer;

  renderBoard();

  const placedCell = getCell(row,col);

  placedCell.classList.add("drop");

  setTimeout(() => {
    placedCell.classList.remove("drop");
  },300);

  const winningCells =
  checkWin(row,col,currentPlayer);

  if(winningCells){

    winningCells.forEach(([r,c]) => {

      getCell(r,c).classList.add("win");
    });

    endGame(currentPlayer);

    return;
  }

  if(grid[0].every(cell => cell !== 0)){

    gameOver = true;

    clearInterval(timer);

    popupText.textContent =
    "🤝 It's a Draw!";

    popup.classList.remove("hidden");

    return;
  }

  switchPlayer();
}

function renderBoard(){

  document.querySelectorAll(".cell")
  .forEach(cell => {

    const r = cell.dataset.row;
    const c = cell.dataset.col;

    cell.classList.remove("p1","p2");

    if(grid[r][c] === 1){

      cell.classList.add("p1");
    }

    if(grid[r][c] === 2){

      cell.classList.add("p2");
    }
  });
}

function switchPlayer(){

  currentPlayer =
  currentPlayer === 1 ? 2 : 1;

  updateStatus();

  updateCards();

  startTimer();
}

function updateStatus(){

  statusText.textContent =
  `${getPlayerName(currentPlayer)}'s Turn`;
}

function updateCards(){

  card1.classList.toggle(
    "active",
    currentPlayer === 1
  );

  card2.classList.toggle(
    "active",
    currentPlayer === 2
  );
}

function startTimer(){

  clearInterval(timer);

  timeLeft = TURN_TIME;

  timerText.textContent = timeLeft;

  timer = setInterval(() => {

    timeLeft--;

    timerText.textContent = timeLeft;

    if(timeLeft <= 0){

      switchPlayer();
    }

  },1000);
}

function checkWin(r,c,player){

  const directions = [

    [0,1],
    [1,0],
    [1,1],
    [1,-1]
  ];

  for(const [dr,dc] of directions){

    let cells = [[r,c]];

    cells.push(
      ...collectCells(r,c,dr,dc,player)
    );

    cells.push(
      ...collectCells(r,c,-dr,-dc,player)
    );

    if(cells.length >= 4){

      return cells.slice(0,4);
    }
  }

  return null;
}

function collectCells(r,c,dr,dc,player){

  let cells = [];

  let nr = r + dr;
  let nc = c + dc;

  while(

    nr >= 0 &&
    nr < ROWS &&
    nc >= 0 &&
    nc < COLS &&
    grid[nr][nc] === player

  ){

    cells.push([nr,nc]);

    nr += dr;
    nc += dc;
  }

  return cells;
}

function endGame(player){

  gameOver = true;

  clearInterval(timer);

  scores[player - 1]++;

  document.getElementById(
    `score${player}`
  ).textContent = scores[player - 1];

  const winner =
  getPlayerName(player);

  previousWinner = winner;

  previousWinnerText.textContent =
  `Previous Winner: ${winner}`;

  popupText.textContent =
  `🎉 ${winner} Wins!`;

  popup.classList.remove("hidden");
}

function closePopup(){

  popup.classList.add("hidden");

  init();
}

document.getElementById("newGame")
.addEventListener("click",init);

init();