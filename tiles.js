class Tile {
	constructor(x, y, t) {
		this.x = x;
		this.y = y;
		this.t = t;
		this.dragging = false;
		this.c = null;

		let bbox = font.textBounds(t, 0, 0, 20);
		this.w = bbox.w + 20;
		this.h = bbox.h + 20;
	}

	show() {
		this.showAt(this.x, this.y);
	}

	isOn(x, y) {
		return (abs(x - this.x) <= this.w / 2 && abs(y - this.y) <= this.h / 2);
	}


	showAt(x, y) {
		rectMode(CORNER);
		strokeWeight(2);

		let textColor = color(220);
		let buttonColor = color(20);
		let textColorHover = color(20);
		let buttonColorHover = color(220);

		if (this.c != null) {

			textColor = this.c;
			buttonColor = color(20);
			textColorHover = color(20);
			buttonColorHover = this.c;
		}


		if (!this.isOn(mouseX, mouseY)) {
			stroke(textColor);
			fill(buttonColor);
		} else {
			stroke(textColorHover);
			fill(buttonColorHover);
		}
		rect(x - this.w / 2, y - this.h / 2, this.w, this.h, 10);

		textAlign(CENTER, BASELINE);
		textFont(font);
		textSize(20);
		noStroke();

		if (!this.isOn(mouseX, mouseY)) {
			fill(textColor);
		} else {
			fill(textColorHover);
		}

		text(this.t, x, y + 10);
	}

}


class PopTile extends Tile {
	constructor(x, y) {
		super(x, y, "dépiler(P)");
	}
}


class PushTile extends Tile {
	constructor(x, y, t) {
		if (t != null) {

			super(x, y, "empiler(P, " + t + ")");
			this.v = t;
		} else {

			super(x, y, "empiler(P, x)");
		}
	}
}


class ResetTile extends Tile {
	constructor(x, y, t) {
		super(x, y, "P = pile()");
	}
}


class ValueTile extends Tile {

	constructor(x, y, t, access, c) {
		super(x, y, t);
		if (access != null) {
			this.access = access;
		} else {
			this.access = false;
		}



		if (c != null) {
			this.c = c;
		}

		this.w = 150;
		this.hItem = 50;
	}

	show(isStack) {
		this.showAt(this.x, this.y, isStack);
	}

	showAt(x, y, isStack) {
		if (this.c == null) {
			if (this.access) {
				this.c = color(50, 250, 90);
			} else {
				this.c = color(250, 88, 88);
			}
		}

		fill(this.c);
		strokeWeight(3);
		stroke(0);

		if (isStack != false) {
			rect(x - this.w / 2, y - this.hItem / 2, this.w, this.hItem, 10);
		} else {
			rect(x - this.hItem / 2, y - this.w / 2, this.hItem, this.w, 10);
		}



		textAlign(CENTER, CENTER);
		textSize(30);
		fill(0);
		noStroke();
		text(this.t, x, y);
	}

	isOn(x, y, isStack) {
		if (isStack != false) {
			return (abs(x - this.x) <= this.w / 2 && abs(y - this.y) <= this.hItem / 2);
		} else {
			return (abs(x - this.x) <= this.hItem / 2 && abs(y - this.y) <= this.w / 2);
		}
	}

}