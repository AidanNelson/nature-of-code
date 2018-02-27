// wrapper for Mover and Spring class to make the construction of a string object easier


class SpringString {
  ArrayList<Bob> bobs = new ArrayList<Bob>();
  ArrayList<Spring> springs = new ArrayList<Spring>();


  SpringString(float x,float y) {
  }

  void update() {
    for (Spring s : springs) {
      s.update();
    }

    for (Bob b : bobs) {
      b.update();
    }
  }

  void display() {
    for (Spring s : springs) {
      s.display();
    }

    for (Bob b : bobs) {
      b.display();
    }
  }

  void addPoint(float x,float y) {
    Bob bob = new Bob(x,y);
    bobs.add(bob);
    if (bobs.size() > 1){
       Bob pBob = bobs.get(bobs.size()-2); // get previous bob
       int d = round(dist(bob.position.x,bob.position.y,pBob.position.x,pBob.position.y));
       springs.add(new Spring(bob,pBob,d)); 
    }
  }
}