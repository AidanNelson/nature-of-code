// class to manage Sheep

class Herd {
  constructor(n, field, col) {
    this.sheep = [];
    this.col = col;
    console.log(field);
    for (let i = 0; i < n; i++) {
      this.sheep.push(new Sheep(field, col));
    }
  }

  addDog(dog) {
    this.dog = dog;
  }

  run() {
    for (let i in this.sheep) {
      this.sheep[i].behaviors(this.sheep, this.dog);
      this.sheep[i].update();
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