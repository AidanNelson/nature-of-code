// Nature of Code 2011
// Daniel Shiffman
// Chapter 3: Oscillation

// Class to describe an anchor point that can connect to "Bob" objects via a spring
// Thank you: http://www.myphysicslab.com/spring2d.html

class Spring { 

  // position
  PVector anchor;

  // Rest length and spring constant
  float len;
  float k = 0.2;

  Bob a;
  Bob b;

  // Constructor
  Spring(Bob a_, Bob b_, int l) {
    a = a_;
    b = b_;
    len = l;
  } 

  // Calculate spring force
  void update() {
    // Vector pointing from anchor to bob position
    PVector force = PVector.sub(a.position, b.position);
    // What is distance
    float d = force.mag();
    // Stretch is difference between current distance and rest length
    float stretch = d - len;

    // Calculate force according to Hooke's Law
    // F = k * stretch
    force.normalize();
    force.mult(-1 * k * stretch);
    a.applyForce(force);
    force.mult(-1);
    b.applyForce(force);
  }


  void display() {
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }

  boolean checkCollision(PVector pos) {
    return linePoint(a.position.x, a.position.y, b.position.x, b.position.y, pos.x, pos.y);
  }
}


// http://www.jeffreythompson.org/collision-detection/line-point.php
// LINE/POINT
boolean linePoint(float x1, float y1, float x2, float y2, float px, float py) {

  // get distance from the point to the two ends of the line
  float d1 = dist(px, py, x1, y1);
  float d2 = dist(px, py, x2, y2);

  // get the length of the line
  float lineLen = dist(x1, y1, x2, y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  float buffer = 0.1;    // higher # = less accurate

  // if the two distances are equal to the line's 
  // length, the point is on the line!
  // note we use the buffer here to give a range, 
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}