class Tile {
	constructor(
		x,
		y,
		value,
		TILE_SIZE,
		LINE_WIDTH,
		SELECT_COLOUR,
		TEXT_COLOUR,
		ERROR_COLOUR
	) {
		this.value = value;
		this.notes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.tileSize = TILE_SIZE;
		this.noteSize = floor(TILE_SIZE / 3);
		this.offset = LINE_WIDTH;
		this.textSize = floor(TILE_SIZE * 0.8);
		this.selectedColour = SELECT_COLOUR;
		this.textColour = TEXT_COLOUR;
		this.errorColour = ERROR_COLOUR;
		this.selected = false;
		this.fixed = false;
		this.error = false;

		this.pos = { x: x, y: y };
		this.screenPos = {
			x: this.pos.x * this.tileSize + this.pos.x * this.offset,
			y: this.pos.y * this.tileSize + this.pos.y * this.offset,
		};
	}

	show() {
		if (this.selected) {
			fill(this.selectedColour);
			rect(this.screenPos.x, this.screenPos.y, this.tileSize, this.tileSize);
		}
		textAlign(CENTER, CENTER);
		if (this.value != 0) {
			if (this.error) {
				fill(this.errorColour);
			} else {
				fill(this.textColour);
			}

			textSize(this.textSize);
			var xValue = this.screenPos.x + this.tileSize / 2 + this.offset / 2;
			var yValue = this.screenPos.y + this.tileSize / 2 + this.offset;
			text(this.value, xValue, yValue);
		} else {
			var xNote;
			var yNote;
			textSize(floor(this.textSize / 3));
			fill(this.textColour);
			for (var y = 0; y < 3; y++) {
				for (var x = 0; x < 3; x++) {
					var index = 3 * y + x;
					if (this.notes[index] != 0) {
						xNote = this.screenPos.x + this.noteSize / 2 + this.noteSize * x;
						yNote = this.screenPos.y + this.noteSize / 2 + this.noteSize * y;
						text(this.notes[index], xNote, yNote);
					}
				}
			}
		}
	}

	notesReset() {
		this.notes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}
}
