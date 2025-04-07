const board = document.getElementById("board")

let boardSize = 0;
while (boardSize < 9) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
    boardSize++;
}