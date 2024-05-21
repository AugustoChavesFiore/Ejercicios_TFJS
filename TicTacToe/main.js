let model;

document.addEventListener("DOMContentLoaded", function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes("")) {
      return "Empate";
    }

    return null;
  }

  function makeMove(e) {
    if (e.target.innerText === "") {
      e.target.innerText = currentPlayer;
      board[e.target.id.split("-")[1]] = currentPlayer;
      let winner = checkWinner();
      if (winner) {
        alert(`El jugador ${winner} ha ganado`);
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (currentPlayer === "O") {
          makeAIMove();
        }
      }
    } else {
      alert("Esta celda ya está ocupada");
    }
  }
  async function makeAIMove() {
    // Cargar el modelo
    const model = await tf.loadLayersModel("model/ttt_model.json");
    // Convertir el tablero a un tensor para la entrada del modelo
    const input = tf
      .tensor(board.map((cell) => (cell === "X" ? 1 : cell === "O" ? -1 : 0)))
      .reshape([1, 9]);

    // Usar el modelo para predecir la mejor jugada
    const prediction = model.predict(input);

    // Convertir la predicción a un array
    const predictionArray = await prediction.array();

    // Encontrar el índice de la mejor jugada
    const bestMove = predictionArray[0].indexOf(
      Math.max(...predictionArray[0])
    );

    // Hacer la mejor jugada
    if (board[bestMove] === "") {
      board[bestMove] = "O";
      document.getElementById(`cell-${bestMove}`).innerText = "O";
    } else {
      // Si la mejor jugada ya está ocupada, hacer una jugada aleatoria
      let randomMove;
      do {
        randomMove = Math.floor(Math.random() * 9);
      } while (board[randomMove] !== "");
      board[randomMove] = "O";
      document.getElementById(`cell-${randomMove}`).innerText = "O";
    }

    // Comprobar si la IA ha ganado
    if (checkWinner()) {
      alert(`El jugador ${checkWinner()} ha ganado`);
    } else {
      currentPlayer = "X";
    }
  }

  for (let i = 0; i < 9; i++) {
    document.getElementById(`cell-${i}`).addEventListener("click", makeMove);
  }
});
