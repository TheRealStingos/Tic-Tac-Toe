// Wait for the DOM to be fully loaded before running our code
document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");
    const startBtn = document.getElementById("start-btn");
    const player1Input = document.getElementById("player1-name");
    const player2Input = document.getElementById("player2-name");
    const gameBoard = Array(9).fill(null);
    const tiles = [];
    
    // Create turn indicator element
    const turnIndicator = document.createElement("div");
    turnIndicator.id = "turn-indicator";
    turnIndicator.classList.add("turn-indicator");
    document.querySelector(".button-container").after(turnIndicator);

    // Create the board tiles
    let boardSize = 0;
    while (boardSize < 9) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.index = boardSize; // Link each tile to its corresponding array index
        tiles.push(tile);
        board.appendChild(tile);
        boardSize++;
    }

    // Create player factory function properly
    function playerFactory(name, symbol) {
        return {
            name: name || `Player ${symbol}`,
            symbol
        };
    }

    let currentPlayer;
    let player1;
    let player2;
    let gameActive = false;

    // Add click event to start button
    startBtn.addEventListener("click", startGame);

    // Update turn indicator
    function updateTurnIndicator() {
        if (!gameActive) {
            turnIndicator.textContent = "";
            return;
        }
        turnIndicator.textContent = `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
        turnIndicator.className = "turn-indicator";
        turnIndicator.classList.add(currentPlayer.symbol.toLowerCase());
    }

    // Link the tiles to the gameBoard array by adding click events
    function setupTileEvents() {
        tiles.forEach((tile, index) => {
            tile.addEventListener("click", () => {
                if (gameActive && gameBoard[index] === null) {
                    // Update the array
                    gameBoard[index] = currentPlayer.symbol;
                    
                    // Update the visual tile
                    tile.textContent = currentPlayer.symbol;
                    tile.classList.add(currentPlayer.symbol.toLowerCase());
                    
                    // Check if there's a winner
                    if (checkWinner()) {
                        turnIndicator.textContent = `${currentPlayer.name} wins!`;
                        turnIndicator.classList.add("winner");
                        gameActive = false;
                        return;
                    }
                    
                    // Check for draw
                    if (!gameBoard.includes(null)) {
                        turnIndicator.textContent = "It's a draw!";
                        turnIndicator.classList.add("draw");
                        gameActive = false;
                        return;
                    }
                    
                    // Switch players
                    currentPlayer = currentPlayer === player1 ? player2 : player1;
                    updateTurnIndicator();
                }
            });
        });
    }

    function startGame() {
        // Get player names before clearing the input fields
        const player1Name = player1Input.value || "Player X";
        const player2Name = player2Input.value || "Player O";
        
        // Clear input fields
        player1Input.value = "";
        player2Input.value = "";
        
        // Reset the game
        gameBoard.fill(null);
        tiles.forEach(tile => {
            tile.textContent = "";
            tile.classList.remove("x", "o");
            tile.style.backgroundColor = "#3498db"; // Reset tile color
        });
        
        // Create players with the captured names
        player1 = playerFactory(player1Name, "X");
        player2 = playerFactory(player2Name, "O");
        
        // Set initial player
        currentPlayer = player1;
        
        // Activate the game
        gameActive = true;
        
        // Update turn indicator
        updateTurnIndicator();
        
        // Make sure tile events are set up
        setupTileEvents();
    }

    function checkWinner() {
        // Define winning combinations
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        // Check each winning pattern
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (
                gameBoard[a] !== null &&
                gameBoard[a] === gameBoard[b] &&
                gameBoard[a] === gameBoard[c]
            ) {
                // Highlight the winning tiles
                tiles[a].style.backgroundColor = "#27ae60";
                tiles[b].style.backgroundColor = "#27ae60";
                tiles[c].style.backgroundColor = "#27ae60";
                return true;
            }
        }
        
        return false;
    }

    // Set up tile events initially
    setupTileEvents();
});