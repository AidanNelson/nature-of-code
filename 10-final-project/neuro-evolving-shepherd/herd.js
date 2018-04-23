// class to manage Sheep

class Herd {
  constructor(n, col, shepherd) {
    this.sheep = [];
    this.col = col;
    this.shepherd = shepherd;
    for (let i = 0; i < n; i++) {
      this.sheep.push(new Sheep(random(width), random(height), this.col));
    }
  }

  copy(newShepherd) {
    return new Herd(this.sheep.length, width / 2, height / 2, this.col, newShepherd);
  }

  run() {
    for (let i in this.sheep) {
      this.sheep[i].behaviors(this.sheep, this.shepherd);
      this.sheep[i].update();
      // this.sheep[i].display();
    }
  }

  show() {
    for (let i in this.sheep) {
      this.sheep[i].display();
    }
  }
  addSheep(x, y) {
    this.sheep.push(new Sheep(x, y));
  }

  getGCM() {
    let gcm = createVector(0, 0);
    for (let i = 0; i < this.sheep.length; i++) {
      gcm.add(this.sheep[i].pos);
    }
    return gcm.div(this.sheep.length);
  }

  resetColors() {
    for (let i in this.sheep) {
      this.sheep[i].currentColor = this.sheep[i].originalColor;
    }
  }
}