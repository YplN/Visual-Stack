class Program {
	constructor(stackMode) {
		if (stackMode) {
			this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
			this.isStack = true;
		} else {
			this.stack = new Queue(PROGX, 0.5 * height);
			this.isStack = false;
		}
		this.instructions = [];
		this.x = width - PROGX / 2;
		this.initialY = 0.03 * height + 10;
		this.y = this.initialY;
	}

	pushTile(t) {
		if (this.isValid(t)) {
			if (t instanceof ResetTile) {
				if (this.isStack) {
					this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
				} else {
					this.stack = new Queue(PROGX, 0.5 * height);
				}
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
		if (this.isStack) {
			this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
		} else {
			this.stack = new Queue(PROGX, 0.5 * height);
		}
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