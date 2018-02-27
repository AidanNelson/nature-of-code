
// declare pendulum parameters
float r1 = 80;
float r2 = 80;
float m1 = 150;
float m2 = 135;

// starting angles
float a1 = PI/2;
float a2 = PI/2;

// starting pendulum angular velocity
float a1_v = 0;
float a2_v = 0;

// 'gravity' for use in pendulum equations
float g = 1;

// previous bottom of pendulum points
float px2 = 0;
float py2 = 0;

// offset of drawing from top dead center
int vertOffset = 100;

// string to be produced by pendulum
SpringString myString = new SpringString();

ArrayList<PVector> barriers = new ArrayList<PVector>();

// 'gravity' force for spring 
PVector grav = new PVector(0,1);

void setup() {
  size(800, 600);
}



void draw() {
  background(255);
  translate(width/2, vertOffset); // move (0,0) to middle top of canvas

  // pendulum calculations
  float a1_a = calculateTopAngularAcc(g, m1, m2, a1, a2, a1_v, a2_v, r1, r2);
  float a2_a = calculateBottomAngularAcc(g, m1, m2, a1, a2, a1_v, a2_v, r1, r2);
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;
  
  // pendulum middle point
  float x1 = r1 * sin(a1);
  float y1 = r1 * cos(a1);

  // pendulum bottom point
  float x2 = x1 + r2 * sin(a2); // include x1 as x-offset
  float y2 = y1 + r2 * cos(a2); // include y1 as y-offset

  // approximate the acceleration force of bottom of the pendulum
  float dx = x2-px2;
  float dy = y2-py2;
  PVector f = new PVector(dx,dy).mult(3);
  
  // add a string point at bottom point with above force
  stroke(0);
  strokeWeight(1);
  myString.addPoint(x2,y2,f);
  myString.update();
  myString.display();
  myString.applyForce(grav);
  
   //not yet working barriers
  //for (PVector b : barriers){
  //  noStroke();
  //  ellipse(b.x,b.y,10,10); 
  //  //myString.clicked(round(b.x),round(b.y));
  //  myString.checkCollisions(b);
  //}

  // draw pendulum
  fill(0);
  stroke(0);
  line(0, 0, x1, y1);
  line(x1, y1, x2, y2);
  ellipse(x1, y1, 10, 10); // draw size as mass
  ellipse(x2, y2, 10, 10); // draw size as mass
  
  // update previous locations for bottom point
  px2 = x2;
  py2 = y2;
  
  //m1 += sin(frameCount);
  //m2 += cos(frameCount);
}

float calculateTopAngularAcc(float g, float m1, float m2, float a1, float a2, float a1_v, float a2_v, float r1, float r2) {
  float num = -g * (2*m1 + m2) * sin(a1) - m2 * g * sin(a1 - 2 * a2) - 2 * sin(a1 - a2) * m2 * (a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1-a2));
  float denom = r1 * (2*m1+m2-m2*cos(2*a1-2*a2));
  return num/denom;
}

float calculateBottomAngularAcc(float g, float m1, float m2, float a1, float a2, float a1_v, float a2_v, float r1, float r2) {
  float num = 2*sin(a1-a2)*(a1_v*a1_v*r1*(m1+m2)+g*(m1+m2)*cos(a1)+(a2_v*a2_v)*r2*m2*cos(a1-a2));
  float denom = r2 * (2*m1+m2 - m2*cos(2*a1-2*a2));
  return num/denom;
}

void mousePressed() {
  //myString.clicked(mouseX- width/2,mouseY-vertOffset );
  //barriers.add(new PVector(mouseX- width/2,mouseY-vertOffset));
}

void mouseReleased() {
  myString.stopDragging();
}