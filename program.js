class Program {
  constructor(stackMode) {
    if (stackMode) {
      this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
      this.isStack = true;
    } else {
      this.stack = new Queue((width - PROGX) / 2 - 50, 0.5 * height);
      this.isStack = false;
    }
    this.instructions = [];
    this.x = width - PROGX + 10;
    this.initialY = 0.03 * height + 10;
    this.y = this.initialY;
  }

  pushTile(t) {
    if (this.isValid(t)) {
      if (t instanceof ResetTile) {
        if (this.isStack) {
          this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
        } else {
          this.stack = new Queue((width / 2 - PROGX) / 2 - 50, 0.5 * height);
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
      this.instructions[i].x = x + this.instructions[i].w / 2;
      this.instructions[i].y = y + i * 45;

      this.instructions[i].show();

      if (this.instructions[i] instanceof PopTile) {
        textSize(25);
        textAlign(LEFT, CENTER);
        fill(DRAW_COLOR);
        text(": " + this.instructions[i].v, this.instructions[i].x + this.instructions[i].w / 2 + 10, y + i * 45);
      }
    }
  }

  isValid(t) {
    return true;
  }

  clear() {
    if (this.isStack) {
      this.stack = new Stack((width - PROGX) / 2, 0.8 * height);
    } else {
      this.stack = new Queue(1.5 * PROGX, 0.5 * height);
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

  // updateFromStack(s) {
  // 	this.stack = s;
  // 	this.instructions = [new ResetTile(0, 0)];
  // 	for (let i = 0; i < this.stack.length; i++) {
  // 		this.instructions.push(new PushTile(0, 0, this.stack.values[i].t));
  // 	}
  // }
}