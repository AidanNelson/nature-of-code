// class to manage Sheep

class Herd {
  constructor(n) {
    this.sheep = [];
    for (let i = 0; i < n; i++) {
      this.sheep.push(new Sheep(width / 2, height / 2));
    }
  }

  run() {
    for (let i in this.sheep) {
      this.sheep[i].behaviors(this.sheep, dog);
      this.sheep[i].update();
      // this.sheep[i].display();
    }
  }

  display() {
    for (let i in this.sheep) {
      // this.sheep[i].behaviors(this.sheep, dog);
      // this.sheep[i].update();
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