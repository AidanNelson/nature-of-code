// wrapper for Mover and Spring class to make the construction of a springy string object easier

class SpringString {
  ArrayList<Bob> bobs = new ArrayList<Bob>();
  ArrayList<Spring> springs = new ArrayList<Spring>();

  SpringString() {
  }

  void update() {
    for (Spring s : springs) {
      s.update();
    }

    for (Bob b : bobs) {
      b.update();
      b.drag(mouseX, mouseY);
    }
  }

  void display() {
    for (Spring s : springs) {
      s.display();
    }

    for (Bob b : bobs) {
      //b.display();
    }
  }

  void applyForce(PVector f) {
    for (Bob b : bobs) {
      b.applyForce(f);
    }
  }

  void addPoint(float x, float y, PVector f) {
    Bob bob = new Bob(x, y);
    bobs.add(bob);
    if (bobs.size() > 1) {
      Bob pBob = bobs.get(bobs.size()-2); // get previous bob
      int d = round(dist(bob.position.x, bob.position.y, pBob.position.x, pBob.position.y));
      d = 8;
      springs.add(new Spring(bob, pBob, d));
    }
    bobs.get(bobs.size()-1).applyForce(f);
    if (bobs.size() > 300) {
      bobs.remove(0);
    }
    if (springs.size() > 300) {
      springs.remove(0);
    }
  }

  void checkCollisions(PVector pos) {
    // every time a spring intersects a barrier...
    for (int i = 0; i< springs.size(); i++) {
      boolean isHit = springs.get(i).checkCollision(pos);
      if (isHit) {
        split(i);
      }
    }
  }

  void clicked(int mx, int my) {
    for (Bob b : bobs) {
      b.clicked(mx, my);
    }
  }

  void stopDragging() {
    for (Bob b : bobs) {
      b.stopDragging();
    }
  }

  // split the string at index i
  void split(int cutToThisIndex) {
    SpringString cutTail = new SpringString();
    for (int i = 0; i< cutToThisIndex; i++) {
      cutTail.addPoint(bobs.get(i).position.x, bobs.get(i).position.y, new PVector(0, 0));
    }
  }
}