// TODO: translate vers le haut puis vers le bas animation?

let error = false;
let errorEmptyStack = false;
let errorStackNotCreated = false;


let COLOR_POP;
let font;

let BACKGROUND_COLOR;
let DRAW_COLOR;
let ERROR_COLOR;


let PROGX = 210;
let POPX = 200;

let s;
let program;
let popB;
let pushB;
let pancakeB;
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

let isSorting = false;
let isRotating = false;
let n;
let firstFlipDone = false;
let secondFlipDone = false;
let firstFlipDoing = false;
let secondFlipDoing = false;
let flipValue;
let speed = 3;
let detailCode = true;
let showingCode = false;


let PANCAKE_CODE = ["n = taille(P)", "Tant que n > O", "      maxI = plus_grand(P,n)", "      flip(P, maxI)", "      flip(P, n)", "      n = n - 1"];
let lineCode = 0;

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
	switchMode = new Tile(clear.x - 110, 25, "File");
	pancakeB = new PancakeTile((width - PROGX) * 0.5, pushB.y - 55);
	//run = new Tile(clear.x + clear.w + 15 , clear.y, "Lancer");


	program = new Program(isStack);

	// program.pushTile(new ResetTile(0, 0));
	// program.pushTile(new PushTile(0, 0, 1));
	// program.pushTile(new PushTile(0, 0, 2));
	// program.pushTile(new PushTile(0, 0, 3));


	program.pushTile(new ResetTile(0, 0));
	program.pushTile(new PushTile(0, 0, 15));
	program.pushTile(new PushTile(0, 0, 18));
	program.pushTile(new PushTile(0, 0, 8));
	program.pushTile(new PushTile(0, 0, 10));
	program.pushTile(new PushTile(0, 0, 1));
	program.pushTile(new PushTile(0, 0, 4));



	s = program.stack;

	// for (let V of s.values) {
	// 	console.log(V.t);
	// }
	// console.log(s.maxIndex(0));
	//s.flip(3);
	// console.log(s.maxIndex(5));
	//s.flip(3);
	//s.flip(0);
	// for (let V of s.values) {
	// 	console.log(V.t);
	// }

	//isSorting = false;
	// s.pancake_sort();
	n = 0;
}

let p = 0;
let maxdex;

function draw() {

	s = program.stack;
	background(BACKGROUND_COLOR);

	showButtons();

	if (isSorting) {
		pancakeSortAnimation();
		if (showingCode)
			showCode(lineCode);

	} else {



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





}


function mousePressed() {
	if (!isSorting) {
		i = s.isOn(mouseX, mouseY);
		if (i != null) {
			//console.log(s.values[i], i);
			s.dragging = i;
		}

		if (pushB.isOn(mouseX, mouseY) && program.isStackCreated()) {
			pushValue = floor(random(20));
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

		if (isStack && program.isStackCreated() && pancakeB.isOn(mouseX, mouseY)) {
			isSorting = true;
			lineCode = 0;
		}


		if (switchMode.isOn(mouseX, mouseY)) {
			switchBetweenModes();
		}

	} else {
		loop();
	}

}


function mouseReleased() {

	if (!isSorting) {

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
				program.pushTile(new PushTile(0, 0, floor(random(20))));
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
}



function showError(e) {

	textSize(40);
	let bbox = font.textBounds(e, 0, 0, 35);
	//let w = bbox.w + 20;
	let w = (width - PROGX);
	let h = bbox.h + 20;

	// fill(220);

	fill(ERROR_COLOR);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(30);
	rect(0.5 * (width - PROGX - 4) - w / 2, 0.25 * height - h / 2, w, h);

	fill(20);
	text(e, 0.5 * (width - PROGX), 0.25 * height);
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
	if (!isSorting && key == ' ') {
		switchBetweenModes();
	}

	if (isStack && (key == 's' || key == 'S' || key == 'p' || key == 'P')) {
		isSorting = true;
		lineCode = 0;
	}

	if (key == 'd' || key == 'D') {
		detailCode = !detailCode;
	}

	if (key == 'c' || key == 'C') {
		showingCode = !showingCode;
	}
}


function showButtons() {
	if (!isSorting) {
		popB.show();
		pushB.show();
		reset.show();
		clear.show();
		switchMode.show();
		if (isStack) {
			pancakeB.show();
		}
	}
}


function pancakeSortAnimation() {

	if (lineCode < 1) {
		s.showStackWithBars();
		lineCode++;
		if (detailCode)
			noLoop();
	} else {

		if (isRotating) {
			p = min(100, (p + speed));
			s.rotateInterval(flipValue, s.values.length - 1, p, n, maxdex);
			if (p >= 100) {
				isRotating = false;
				p = 0;
				if (firstFlipDoing) {
					firstFlipDone = true;
					firstFlipDoing = false;
					//lineCode = 4;
				}
				if (secondFlipDoing) {
					secondFlipDone = true;
					secondFlipDoing = false;
					//lineCode = 5;
				}
				if (detailCode)
					noLoop();
				lineCode++;
				// lineCode = (lineCode + 1) % PANCAKE_CODE.length;
				//s.flip(flipValue);
			}
		} else {
			if (n < s.values.length) {
				if (!firstFlipDone) {
					lineCode = 1;
					maxdex = s.maxIndex(n);
					s.showStackWithBars(n, maxdex);
					if (detailCode)
						noLoop();
					// console.log("max à position ", maxdex);
				}
				if (!firstFlipDone) {
					lineCode = 2;
					s.flip(maxdex);
					flipValue = maxdex;
					isRotating = true;
					firstFlipDoing = true;
					// console.log("1er flip à la position", flipValue);
				}
				if (firstFlipDone && !secondFlipDone) {
					s.flip(n);
					flipValue = n;
					isRotating = true;
					secondFlipDoing = true;
					// console.log("2eme flip à la position", flipValue);
				}
				if (firstFlipDone && secondFlipDone) {
					// console.log("next ");
					lineCode = 1;
					n++;
					firstFlipDone = false;
					secondFlipDone = false;
					firstFlipDoing = false;
					secondFlipDoing = false;
					if (detailCode)
						noLoop();
					s.showStackWithBars(n);
				}
				// console.log(n, s.values[maxdex].t, firstFlipDone, secondFlipDone);
			} else {
				s.show();
				isSorting = false;
				n = 0;
				lineCode = 0;
				//program.updateFromStack(s);
				program.pushTile(new PancakeTile(0, 0));
			}
		}
	}
}

function showCode(i) {
	fill(DRAW_COLOR);
	noStroke();
	textAlign(LEFT);
	textSize(25);

	let bbox = font.textBounds(PANCAKE_CODE[2], 0, 0, 25);
	let x = 0.85 * width - bbox.w;
	let y = 0.5 * height - 30 * PANCAKE_CODE.length / 2;

	for (let j = 0; j < PANCAKE_CODE.length; j++) {
		text(PANCAKE_CODE[j], x, y + j * 30);
	}

	if (i != null) {
		let bbox = font.textBounds(PANCAKE_CODE[i], 0, 0, 25);
		let w = bbox.w + 15;
		let h = bbox.h + 10;

		fill(DRAW_COLOR);
		rect(x, y + (i - 1) * 30, w, h);
		fill(BACKGROUND_COLOR);
		noStroke();
		text(PANCAKE_CODE[i], x, y + i * 30);
	}
	// text("n = 0\nTant que n < taille(P)\n\t\tmaxI = indiceValeurMax(n)\n\t\tflip(s,maxI)\n\t\tflip(s,n)\n\t\tn = n + 1\n", width / 2, height / 2);
}