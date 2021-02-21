class Queue {

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
		v.x = this.x - (this.values.length + 1) * this.hItem;
		v.y = this.y;
		// if (this.access != null) {
		// 	this.access.access = false;
		// 	this.access.c = null;
		// }
		// this.access = v;
		// v.access = true;

		if (this.access == null) {
			this.access = v;
			v.access = true;
		}

		this.values.push(v);

		if (this.values.length > 0) {
			this.access = this.values[0];
			this.values[0].access = true;
			this.values[0].c = color(50, 250, 90);
		} else
			this.access = null;


	}

	pop() {
		console.log(this);
		console.log("Hey");
		if (this.values.length > 0)
			this.popped = this.values.shift();

		for (let v of this.values) {
			v.x += this.hItem;
		}
		if (this.values.length > 0) {
			this.access = this.values[0];
			this.values[0].access = true;
			this.values[0].c = color(50, 250, 90);
		} else
			this.access = null;


	}


	show() {

		for (let i = 0; i < this.values.length; i++) {
			if (i == this.dragging) {
				this.values[i].showAt(mouseX, mouseY, false);
			} else {
				this.values[i].show(false);
			}
		}

		// stroke(255);
		// line(this.x - this.w, this.y - this.hItem / 2, this.x + this.w, this.y - this.hItem / 2);



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


	isOn(x, y) {
		for (let i = 0; i < this.values.length; i++) {
			if (this.values[i].isOn(x, y, false)) {
				return i;
			}
		}
		return null;
	}


}