// class to manage Sheep

class Herd {
  constructor(n, col, shepherd) {
    this.sheep = [];
    this.col = col;
    this.shepherd = shepherd;

    let positionX = random(50, width - 50);
    let positionY = random(50, height - 50);

    for (let i = 0; i < n; i++) {
      this.sheep.push(new Sheep(positionX, positionY, this.col));
    }
  }

  copy(newShepherd) {
    return new Herd(this.sheep.length, this.col, newShepherd);
  }

  run() {
    for (let i = this.sheep.length - 1; i >= 0; i--) {
      this.sheep[i].behaviors(this.sheep, this.shepherd);
      this.sheep[i].update();
      if (this.sheep[i].isDead()) {
        this.sheep.splice(i, 1);
      }
    }
  }

  show() {
    for (let i in this.sheep) {
      this.sheep[i].display();
    }
  }

  isDead() {
    return this.sheep.length <= 0;
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