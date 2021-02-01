var TILE_SIZE;
var LINE_WIDTH;
var SCREEN_SIZE;

var BACKGROUND_COLOUR = "#1a1a1a";
var BIG_LINE_COLOUR = "#121212";
var S_LINE_COLOUR = "#242424";
var TEXT_COLOUR = 75;
var SELECT_COLOUR = 20;
var ERROR_COLOUR = "#824949";

BACKGROUND_COLOUR = 26;
BIG_LINE_COLOUR = 15;
S_LINE_COLOUR = 36;

var numbers = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 };
var board = [[], [], [], [], [], [], [], [], []];
var boards;
var selectedTile = 0;
var currentBoard = 0;

var mode = "write";

function preload() {
	boards = loadStrings("sudokuBoards.txt");
}

function setup() {
	for (var i = 0; i < boards.length; i++) {
		boards[i] = boards[i].split(",");
	}
	TILE_SIZE = floor((min(windowHeight, windowWidth) * 0.8) / 9);
	LINE_WIDTH = floor(TILE_SIZE / 20);
	SCREEN_SIZE = 9 * TILE_SIZE + 8 * LINE_WIDTH;
	createCanvas(SCREEN_SIZE, SCREEN_SIZE);
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			board[y].push(
				new Tile(
					x,
					y,
					0,
					TILE_SIZE,
					LINE_WIDTH,
					SELECT_COLOUR,
					TEXT_COLOUR,
					ERROR_COLOUR
				)
			);
		}
	}

	//tile = new Tile(0, 0, 1, TILE_SIZE, LINE_WIDTH, SELECT_COLOUR, TEXT_COLOUR);
}

function draw() {
	background(BACKGROUND_COLOUR);
	drawBoard();
	board.forEach((row) => {
		row.forEach((tile) => {
			tile.show();
		});
	});
	if (checkWin()) {
		console.log("WON");
	}
}

function keyPressed() {
	/* if (key == "q") {
		mode = "note";
		console.log(mode);
	} else  */
	if (key == "w") {
		mode = mode == "write" ? "note" : "write";
		console.log(mode);
	} else if (key == "e") {
		mode = "edit";
		console.log(mode);
	} else if (key == "r") {
		resetBoard();
	} else if (key == "n") {
		setBoard();
	} else if (selectedTile != 0 && mode == "write") {
		if (key in numbers) {
			setValue(selectedTile, parseInt(key), mode);
		}
	} else if (selectedTile != 0 && mode == "edit") {
		if (key in numbers) {
			setValue(selectedTile, parseInt(key), mode);
		}
	} else if (selectedTile != 0 && mode == "note") {
		if (key in numbers) {
			setValue(selectedTile, parseInt(key), mode);
		}
	}
}

function setValue(tile, value, mode) {
	if (mode == "write") {
		if (!tile.fixed) {
			if (tile.value == value) {
				tile.value = 0;
				tile.textColour = TEXT_COLOUR;
				tile.error = false;
				tile.notesReset();
			} else {
				tile.value = value;
				if (checkError(tile)) {
					tile.error = true;
				} else {
					tile.error = false;
				}
			}
		}
	} else if (mode == "edit") {
		if (tile.value == value) {
			tile.value = 0;
			tile.textColour = TEXT_COLOUR;
			tile.fixed = false;
		} else {
			tile.value = value;
			tile.fixed = true;
			var error = false;
			for (var x = 0; x < 9; x++) {
				if (x == tile.pos.x) {
					continue;
				} else if (board[tile.pos.y][x].value == tile.value) {
					error = true;
				}
			}
			for (var y = 0; y < 9; y++) {
				if (y == tile.pos.y) {
					continue;
				} else if (board[y][tile.pos.x].value == tile.value) {
					error = true;
				}
			}
			if (error) {
				tile.textColour = ERROR_COLOUR;
			} else {
				tile.textColour = TEXT_COLOUR;
			}
		}
	} else if (mode == "note") {
		tile.value = 0;
		if (tile.notes[value - 1] == 0) {
			tile.notes[value - 1] = value;
		} else {
			tile.notes[value - 1] = 0;
		}
	}
}

function mouseReleased() {
	if (
		mouseX >= 0 &&
		mouseY >= 0 &&
		mouseX <= SCREEN_SIZE &&
		mouseY <= SCREEN_SIZE
	) {
		var clickedTile = getMouseTile();
		if (selectedTile != 0) {
			if (selectedTile == clickedTile) {
				clickedTile.selected = false;
				selectedTile = 0;
			} else {
				selectedTile.selected = false;
				selectedTile = clickedTile;
				selectedTile.selected = true;
			}
		} else {
			selectedTile = clickedTile;
			selectedTile.selected = true;
		}
	}
}

function getMouseTile() {
	var x = floor(mouseX / (TILE_SIZE + LINE_WIDTH));
	var y = floor(mouseY / (TILE_SIZE + LINE_WIDTH));
	return board[y][x];
}

function drawBoard() {
	background(BACKGROUND_COLOUR);
	fill(S_LINE_COLOUR);
	noStroke();
	for (var i = 1; i < 9; i++) {
		rect(TILE_SIZE * i + LINE_WIDTH * (i - 1), 0, LINE_WIDTH, SCREEN_SIZE);
	}
	for (var i = 1; i < 9; i++) {
		rect(0, TILE_SIZE * i + LINE_WIDTH * (i - 1), SCREEN_SIZE, LINE_WIDTH);
	}
	fill(BIG_LINE_COLOUR);
	for (var i = 1; i < 3; i++) {
		rect(
			(TILE_SIZE * 3 + LINE_WIDTH * 2) * i + LINE_WIDTH * (i - 1),
			0,
			LINE_WIDTH,
			SCREEN_SIZE
		);
	}
	for (var i = 1; i < 3; i++) {
		rect(
			0,
			(TILE_SIZE * 3 + LINE_WIDTH * 2) * i + LINE_WIDTH * (i - 1),
			SCREEN_SIZE,
			LINE_WIDTH
		);
	}
}

function resetBoard() {
	console.log("RESET");
	board = [[], [], [], [], [], [], [], [], []];
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			board[y].push(
				new Tile(
					x,
					y,
					0,
					TILE_SIZE,
					LINE_WIDTH,
					SELECT_COLOUR,
					TEXT_COLOUR,
					ERROR_COLOUR
				)
			);
		}
	}
}

function setBoard() {
	resetBoard();
	currentBoard = boards[floor(random(boards.length))];
	var num = currentBoard[0];
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			setValue(board[y][x], num[y * 9 + x], "edit");
		}
	}
}

function checkError(tile) {
	var error = false;
	for (var x = 0; x < 9; x++) {
		if (x == tile.pos.x) {
			continue;
		} else if (board[tile.pos.y][x].value == tile.value) {
			error = true;
		}
	}
	for (var y = 0; y < 9; y++) {
		if (y == tile.pos.y) {
			continue;
		} else if (board[y][tile.pos.x].value == tile.value) {
			error = true;
		}
	}
	var xStart = floor(tile.pos.x / 3) * 3;
	var yStart = floor(tile.pos.y / 3) * 3;
	for (var xOff = 0; xOff < 3; xOff++) {
		for (var yOff = 0; yOff < 3; yOff++) {
			if (xStart + xOff == tile.pos.x && yStart + yOff == tile.pos.y) {
				continue;
			} else if (board[yStart + yOff][xStart + xOff].value == tile.value) {
				error = true;
			}
		}
	}
	return error;
}

function checkWin() {
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			if (board[y][x].error || board[y][x].value == 0) {
				return false;
			}
		}
	}
	return true;
}
