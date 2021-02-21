//// TODO: textes alternatifs, bouton switch pile/file, bandeau erreur a replacer, fleche sommet pour file

let error = false;
let errorEmptyStack = false;
let errorStackNotCreated = false;
let COLOR_POP;
let font;

let PROGX = 200;

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

let isStack = false;


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


	program = new Program(isStack);

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

		pushSpot.show(isStack);
		pushDragging.show(isStack);


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

		let y;
		let x;

		if (isStack) {
			x = s.x;
			y = s.y - (s.values.length + 1) * s.hItem;
		} else {
			y = s.y;
			x = s.x - (s.values.length + 1) * s.hItem;
		}

		pushSpot = new ValueTile(x, y, "", true, color(0, 246, 255, 100));
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