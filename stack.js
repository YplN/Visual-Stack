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


		for (let i = 0; i < this.values.length; i++) {
			if (i == this.dragging) {
				this.values[i].showAt(mouseX, mouseY);
			} else {
				this.values[i].show();
			}
		}

		stroke(255);
		line(this.x - this.w, this.y - this.hItem / 2, this.x + this.w, this.y - this.hItem / 2);



	}


	isEmpty() {
		return this.values.length == 0;
	}


	showHead() {
		stroke(255);
		line(this.access.x + this.w / 2, this.access.y, this.access.x + this.w, this.access.y);

		fill(255);
		noStroke();
		textAlign(LEFT, CENTER);
		text("Sommet", this.access.x + this.w + 15, this.access.y);
	}


	isOn(x, y) {
		for (let i = 0; i < this.values.length; i++) {
			if (this.values[i].isOn(x, y)) {
				return i;
			}
		}
		return null;
	}

	showStackWithBars(n, max) {
		for (let i = 0; i < this.values.length; i++) {
			if (n != null && i < n) {
				this.values[i].showWithBars(color(252, 213, 113));
			} else {
				this.values[i].showWithBars();
			}
			if (max != null && i == max) {
				this.values[i].showWithBars(color(255, 213, 213));
			}
		}
	}

	rotateInterval(a, b, p, n, max) {
		for (let i = 0; i < a; i++) {
			if (i < n) {
				this.values[i].showWithBars(color(252, 213, 113));
			} else {
				this.values[i].showWithBars();
			}
		}

		let angle = map(p, 0, 100, 0, PI);
		let m = floor((a + b) / 2);

		push();
		translate(this.values[a].x, (this.values[a].y + this.values[b].y) / 2);
		let shift;
		if ((b - a) % 2 == 0) {
			shift = 0;
		} else {
			shift = this.hItem / 2;
		}
		rotate(angle);

		for (let i = a; i <= b; i++) {
			this.values[i].showAtWithBars(0, (i - m) * this.hItem - shift);
		}
		pop();

		for (let i = b + 1; i < this.values.length; i++) {
			this.values[i].showWithBars();
		}

	}



	flip(k) {
		let left = this.values.length - 1
		while (left > k) {
			[this.values[k].t, this.values[left].t] = [this.values[left].t, this.values[k].t];
			k++;
			left--;
		}
	}


	// swapPosition(i, j) {
	// 	[this.values[i].x, this.values[j].x] = [this.values[i].x, this.values[j].x]
	// 	[this.values[i].y, this.values[j].y] = [this.values[i].y, this.values[j].y]
	// 	[this.values[i], this.values[j]]  = [this.values[i], this.values[j]]
	//
	// }


	maxIndex(k) {
		let index = k;
		for (let i = k; i < this.values.length; i++) {
			if (this.values[i].t > this.values[index].t)
				index = i;
		}
		return index;
	}

	pancake_sort() {
		let n = 0;
		while (n < this.values.length) {
			var maxdex = this.maxIndex(n);
			this.flip(maxdex);
			this.flip(n);
			n++;
		}
	}

}