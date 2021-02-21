let error = false;
let errorEmptyStack = false;
let errorStackNotCreated = false;
let COLOR_POP;
let font;

let BACKGROUND_COLOR;
let DRAW_COLOR;
let ERROR_COLOR;


let PROGX = 200;
let POPX = 200;

let s;
let program;
let popB;
let pushB;
let reset;

let clear;
let switchMode;
let run;


let popDragging = null;
let pushDragging = null;
let resetDragging = null;
let pushValue;
let pushSpot;

let isStack = true;


function preload() {
	font = loadFont('assets/Typori-Regular.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	textFont(font);

	BACKGROUND_COLOR = color(20);
	DRAW_COLOR = color(220);
	ERROR_COLOR = color(255, 50, 50)

	COLOR_POP = color(120, 120, 120);
	COLOR_POP_HOVER = color(65, 252, 246);

	pushB = new PushTile((width - PROGX) * 0.5, 0.95 * height);
	popB = new PopTile(pushB.x + pushB.w + 10, pushB.y);
	reset = new ResetTile(pushB.x - pushB.w - 10, pushB.y);

	clear = new Tile(-85 + width - PROGX, 25, "Réinitialiser");
	switchMode = new Tile(clear.x - 120, 25, "File");
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
	background(BACKGROUND_COLOR);


	popB.show();
	pushB.show();
	reset.show();
	clear.show();
	switchMode.show();
	//run.show();


	s.show();



	if (s.isEmpty()) {
		popB.c = color(255, 0, 0);
	} else {
		popB.c = null;
	}
	textSize(50);
	// stroke(0);
	textAlign(CENTER, CENTER);
	noStroke();
	fill(DRAW_COLOR);

	if (!program.isStackCreated()) {
		pushB.c = color(255, 0, 0);
	} else {
		pushB.c = null;
		if (isStack) {
			text("P", 0.5 * (width - PROGX), 0.8 * height);
		} else {
			text("F", 0.5 * (width - PROGX), 0.8 * height);
		}
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

	stroke(DRAW_COLOR);
	strokeWeight(3);
	line(width - PROGX, 0, width - PROGX, height);

	program.show();


	let dataName = "pile";
	if (!isStack)
		dataName = "file";
	if (error) {
		showError(`Impossible d'accéder à un autre élément que le sommet de la ${dataName} !`);
	} else if (errorEmptyStack) {
		showError(`Impossible, la ${dataName} est vide !`);
	} else if (errorStackNotCreated) {
		showError(`Impossible, la ${dataName} n'est pas définie !`);
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
			x = s.x + (s.values.length + 1) * s.hItem;
		}

		pushSpot = new ValueTile(x, y, "", true, color(0, 246, 255, 100));
	}

	if (switchMode.isOn(mouseX, mouseY)) {
		switchBetweenModes();
	}


}


function mouseReleased() {

	if (s.dragging != null && !error && mouseX < 0.25 * width) {
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
	let bbox = font.textBounds(e, 0, 0, 35);
	//let w = bbox.w + 20;
	let w = width;
	let h = bbox.h + 20;

	// fill(220);

	fill(ERROR_COLOR);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(30);
	rect(0.5 * width - w / 2, 0.25 * height - h / 2, w, h);

	fill(20);
	text(e, 0.5 * width, 0.25 * height);
}


function displayPopArea(c) {

	noStroke();

	setGradient(map(mouseX, 0.5 * width, 0, -0.7 * width, -0.3 * width), 0, width / 2, height, lerpColor(COLOR_POP, color(50, 250, 90), map(mouseX, 0.8 * width, 0, 0, 100) / 100), BACKGROUND_COLOR, 2);


	fill(DRAW_COLOR);
	textAlign(CENTER);
	strokeWeight(1);
	textSize(30);
	if (isStack) {
		text("dépiler(P)", 0.15 * width, 0.5 * height);
	} else {
		text("défiler(F)", 0.1 * width, 0.5 * height);
	}
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

	if (mouseX > width - PROGX) {
		if (event.delta > 0) {
			// program.y += -45;
			program.updateY(-45);
		} else {
			// program.y += 45;
			program.updateY(45);

		}
	}
}

function switchBetweenModes() {
	isStack = !isStack;
	program = new Program(isStack);
	pushB = new PushTile((width - PROGX) * 0.5, 0.95 * height);
	popB = new PopTile(pushB.x + pushB.w + 10, pushB.y);
	reset = new ResetTile(pushB.x - pushB.w - 10, pushB.y);

	let tmp = BACKGROUND_COLOR;
	BACKGROUND_COLOR = DRAW_COLOR;
	DRAW_COLOR = tmp;

	if (isStack) {
		switchMode = new Tile(clear.x - 120, 25, "File");
	} else {
		switchMode = new Tile(clear.x - 120, 25, "Pile");
	}
}

function keyPressed() {
	if (key == ' ') {
		switchBetweenModes();
	}
}