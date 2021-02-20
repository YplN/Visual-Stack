let error = false;
let errorEmptyStack = false;
let errorStackNotCreated = false;
let COLOR_POP;
let font;

let PROGX = 200;


class Stack {

	constructor(x, y) {
		this.values = [];
		this.x = x;
		this.y = y;
		this.popped = null;
		this.w = 150;
		this.hItem = 50;
		this.access = null;

		this.dragging = null;

	}

	push(v) {
		v.x = this.x;
		v.y = this.y - (this.values.length + 1) * this.hItem;
		if (this.access != null) {
			this.access.access = false;
			this.access.c = null;
		}
		this.access = v;
		v.access = true;

		this.values.push(v);

	}

	pop() {
		if (this.values.length > 0)
			this.popped = this.values.pop();

		if (this.values.length > 0) {
			this.access = this.values[this.values.length - 1];
			this.values[this.values.length - 1].access = true;
			this.values[this.values.length - 1].c = color(50, 250, 90);
		} else
			this.acess = null;
	}


	show() {

		for (let i = 0; i < this.values.length; i++) {
			if (i == this.dragging) {
				this.values[i].showAt(mouseX, mouseY);
			} else {
				this.values[i].show();
			}
			// pop();
		}

		stroke(255);
		line(this.x - this.w, this.y - this.hItem / 2, this.x + this.w, this.y - this.hItem / 2);



		if (this.dragging != null) {
			if (this.values[this.dragging].access) {

				let c = COLOR_POP;
				if (isOnPopArea()) {
					c = COLOR_POP_HOVER;
				}
				displayPopArea(c);
			} else {
				error = true;
				this.showHead();
			}
		}
	}


	isEmpty() {
		return this.values.length == 0;
	}


	showHead() {
		stroke(255);
		line(this.access.x + this.w / 2, this.access.y, this.access.x + this.w, this.access.y);

		fill(255);
		stroke(0);
		textAlign(LEFT, CENTER);
		text("Sommet", this.access.x + this.w + 15, this.access.y);


	}

	/*
	  print() {
	    console.log("Start Stack ---- ")
	    for (let i = this.values.length - 1; i >= 0; i--) {
	      console.log(this.values[i]);
	    }

	    console.log("End Stack ---- ")
	  }



	  showItem(i, v) {
	    fill(250, 88, 88)
	    if (i == 0) { //this.values.length - 1) {
	      fill(50, 250, 90);
	    }

	    strokeWeight(3);
	    stroke(0);
	    rect(this.x - this.w / 2, this.y - (i + 1) * this.hItem, this.w, this.hItem, 10);
	    textAlign(CENTER, CENTER);
	    textSize(30);
	    fill(0);
	    noStroke();
	    text(v, this.x, this.y - (i + 1) * this.hItem + this.hItem / 2);
	  }

	  showItemDragging(i, v, x, y) {

	    fill(250, 88, 88)
	    if (i == 0) { //this.values.length - 1) {
	      let c = COLOR_POP;
	      if (isOnPopArea()) {
	        c = COLOR_POP_HOVER;
	      }
	      displayPopArea(c);
	      stroke(0);
	      strokeWeight(1);
	      textSize(50);
	      fill(220);
	      textAlign(CENTER);
	      text("dépiler(P)", 0.85 * width, 0.5 * height);
	      fill(50, 250, 90);
	    } else {
	      error = true;
	    }


	    strokeWeight(3);
	    stroke(0);
	    rect(x - this.w / 2, y - this.hItem / 2, this.w, this.hItem, 10);
	    textAlign(CENTER, CENTER);
	    textSize(30);
	    fill(0);
	    noStroke();
	    text(v, x, y);
	  }


	  show() {
	    strokeWeight(3);
	    for (let i = this.values.length - 1; i >= 0; i--) {
	      if (i == this.dragging) {
	        this.showItemDragging(i, this.values[i], mouseX, mouseY);
	      } else {
	        this.showItem(i, this.values[i]);
	      }
	    }
	    stroke(255);
	    line(this.x - this.w, this.y, this.x + this.w, this.y);

	    if (error == true)
	      this.showHead();

	  }




	  */

	// isOnItem(i, x, y) {
	//   return (abs(x - this.x) <= this.w / 2 && y <= (this.y - (i + 0.5) * this.hItem ) && (this.y - (i + 1.5) * this.hItem) <= y);
	// }

	isOn(x, y) {
		for (let i = 0; i < this.values.length; i++) {
			if (this.values[i].isOn(x, y)) {
				return i;
			}
		}
		return null;
	}


}

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

	show() {
		this.showAt(this.x, this.y);
	}

	showAt(x, y) {
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
		rect(x - this.w / 2, y - this.hItem / 2, this.w, this.hItem, 10);
		textAlign(CENTER, CENTER);
		textSize(30);
		fill(0);
		noStroke();
		text(this.t, x, y);
	}

	isOn(x, y) {
		return (abs(x - this.x) <= this.w / 2 && abs(y - this.y) <= this.hItem / 2);
	}

}

class Program {
	constructor() {
		this.stack = new Stack((width + PROGX) / 2, 0.8 * height);
		this.instructions = [];
		this.x = PROGX / 2;
		this.initialY = 0.03 * height + 10;
		this.y = this.initialY;
	}

	pushTile(t) {
		if (this.isValid(t)) {
			if (t instanceof ResetTile) {
				this.stack = new Stack((width + PROGX) / 2, 0.8 * height);
			}
			if (t instanceof PopTile) {
				this.stack.pop();
			}
			if (t instanceof PushTile) {
				this.stack.push(new ValueTile(0, 0, t.v));
			}
			this.instructions.push(t);

			if (this.y + this.instructions.length * 45 > height) {
				this.y = height - this.instructions.length * 45;
			}
		}
	}

	show() {
		let x = this.x;
		let y = this.y;
		for (let i = 0; i < this.instructions.length; i++) {
			this.instructions[i].x = x;
			this.instructions[i].y = y + i * 45;

			this.instructions[i].show();
		}
	}

	isValid(t) {
		return true;
	}

	clear() {
		this.stack = new Stack((width + PROGX) / 2, 0.8 * height);
		this.instructions = [];
		this.y = this.initialY;
	}

	isStackCreated() {
		for (let p of this.instructions) {
			if (p instanceof ResetTile)
				return true;
		}
		return false;
	}


	updateY(s) {
		if (this.instructions.length * 45 > height) {
			this.y += s;
			this.y = min(this.y, this.initialY);
		}
	}
}


let s;
let program;
let popB;
let pushB;
let reset;

let clear;
let run;


let popDragging = null;
let pushDragging = null;
let resetDragging = null;
let pushValue;
let pushSpot;


function preload() {
	font = loadFont('assets/Typori-Regular.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textFont(font);

	COLOR_POP = color(120, 120, 120);
	COLOR_POP_HOVER = color(65, 252, 246);

	pushB = new PushTile((width + PROGX) * 0.5, 0.95 * height);
	popB = new PopTile(pushB.x + pushB.w + 10, pushB.y);
	reset = new ResetTile(pushB.x - pushB.w - 10, pushB.y);

	clear = new Tile(85 + PROGX, 25, "Réinitialiser");
	// clear = new Tile(50, 25, "Reset");
	//run = new Tile(clear.x + clear.w + 15 , clear.y, "Lancer");


	program = new Program(s);

	program.pushTile(new ResetTile(0, 0));
	program.pushTile(new PushTile(0, 0, 1));
	program.pushTile(new PushTile(0, 0, 2));
	program.pushTile(new PushTile(0, 0, 3));


}

function draw() {

	s = program.stack;
	background(20);


	popB.show();
	pushB.show();
	reset.show();
	clear.show();
	//run.show();


	s.show();

	textSize(50);
	stroke(0);
	textAlign(CENTER, CENTER);
	fill(220);

	if (s.isEmpty()) {
		popB.c = color(255, 0, 0);
	} else {
		popB.c = null;
	}


	if (!program.isStackCreated()) {
		pushB.c = color(255, 0, 0);
	} else {
		pushB.c = null;
		text("P", 0.5 * (width + PROGX), 0.8 * height);
	}


	if (popB.isOn(mouseX, mouseY) && s.isEmpty()) {
		errorEmptyStack = true;
	} else {
		errorEmptyStack = false;
	}


	if (pushB.isOn(mouseX, mouseY) && !program.isStackCreated()) {
		errorStackNotCreated = true;
	} else {
		errorStackNotCreated = false;
	}


	if (pushDragging != null && !pushB.isOn(mouseX, mouseY) && program.isStackCreated()) {
		pushDragging.x = mouseX;
		pushDragging.y = mouseY;

		pushSpot.show();
		pushDragging.show();


	}

	stroke(220);
	strokeWeight(3);
	line(PROGX, 0, PROGX, height);

	program.show();



	if (error) {
		showError("Impossible d'accéder à un autre élément que le sommet de la pile !");
	} else if (errorEmptyStack) {
		showError("Impossible, la pile est vide !");
	} else if (errorStackNotCreated) {
		showError("Impossible, la pile n'est pas définie !");
	}


}


function mousePressed() {
	i = s.isOn(mouseX, mouseY);
	if (i != null) {
		//console.log(s.values[i], i);
		s.dragging = i;
	}

	if (pushB.isOn(mouseX, mouseY) && program.isStackCreated()) {
		pushValue = floor(random(10));
		pushDragging = new ValueTile(mouseX, mouseY, pushValue, true);

		let y = s.y - (s.values.length + 1) * s.hItem;

		pushSpot = new ValueTile(s.x, y, "", true, color(0, 246, 255, 100));
	}

}


function mouseReleased() {

	if (s.dragging != null && !error && mouseX > 0.75 * width) {
		//s.pop();
		program.pushTile(new PopTile(0, 0));
	}

	if (popB.isOn(mouseX, mouseY)) {
		if (!s.isEmpty()) {
			// s.pop();
			program.pushTile(new PopTile(0, 0));
		}
	}

	if (pushB.isOn(mouseX, mouseY)) {
		// s.push(floor(random(10)));
		if (program.isStackCreated()) {
			program.pushTile(new PushTile(0, 0, floor(random(10))));
		}
	}

	if (reset.isOn(mouseX, mouseY)) {
		//s = new Stack(width / 2, 0.8 * height);
		program.pushTile(new ResetTile(0, 0));
	}


	if (clear.isOn(mouseX, mouseY)) {
		program.clear();
	}

	if (pushDragging != null && pushSpot.isOn(mouseX, mouseY)) {
		program.pushTile(new PushTile(0, 0, pushDragging.t));
	}

	pushDragging = null;
	pushSpot = null;

	s.dragging = null;
	error = false;
}



function showError(e) {

	textSize(40);
	let bbox = font.textBounds(e, 0, 0, 40);
	//let w = bbox.w + 20;
	let w = width;
	let h = bbox.h + 20;

	// fill(220);

	fill(255, 50, 50);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(30);
	rect(0.5 * width - w / 2, 0.5 * height - h / 2, w, h);

	fill(20);
	text(e, 0.5 * width, 0.5 * height);
}


function displayPopArea(c) {

	noStroke();

	setGradient(map(mouseX, 0.5 * width, width, 0.9 * width, 0.7 * width), 0, width / 2, height, color(20, 20, 20, 0), lerpColor(COLOR_POP, color(50, 250, 90), map(mouseX, 0.2 * width, width, 0, 100) / 100), 2);


	fill(220);
	textAlign(CENTER);
	strokeWeight(1);
	text("dépiler(P)", 0.85 * width, 0.5 * height);
	fill(50, 250, 90);
}


function setGradient(x, y, w, h, c1, c2, axis) {
	noFill();

	if (axis === 1) {
		// Top to bottom gradient
		for (let i = y; i <= y + h; i++) {
			let inter = map(i, y, y + h, 0, 1);
			let c = lerpColor(c1, c2, inter);
			stroke(c);
			line(x, i, x + w, i);
		}
	} else if (axis === 2) {
		// Left to right gradient
		for (let i = x; i <= x + w; i++) {
			let inter = map(i, x, x + w, 0, 1);
			let c = lerpColor(c1, c2, inter);
			stroke(c);
			line(i, y, i, y + h);
		}
	}
}



function isOnPopArea() {
	return (mouseX > 0.75 * width);
}


function mouseWheel(event) {

	if (mouseX < PROGX) {
		if (event.delta > 0) {
			// program.y += -45;
			program.updateY(-45);
		} else {
			// program.y += 45;
			program.updateY(45);

		}
	}
}