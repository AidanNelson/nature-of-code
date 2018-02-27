float r1 = 150;
float r2 = 180;
float m1 = 25;
float m2 = 10;
float a1 = PI/4;
float a2 = 0;
float a1_v = 0;
float a2_v = 0;
float a1_a = 0;
float a2_a = 0;
float g = 1;

void setup(){
  size(600,600);
}

void draw() {
  background(200);
  stroke(0);
  strokeWeight(2);
  
  
  translate(300,50); // move (0,0) to middle top of canvas
  
  float x1 = r1 * sin(a1);
  float y1 = r1 * cos(a1);
  
  float x2 = x1 + r2 * sin(a2); // include x1 as x-offset
  float y2 = y1 + r2 * cos(a2); // include y1 as y-offset
  
  
  a1_a = calculateTopAngularAcc(g,m1,m2,a1,a2,a1_v,a2_v,r1,r2);
  a2_a = calculateBottomAngularAcc(g,m1,m2,a1,a2,a1_v,a2_v,r1,r2);
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;
  

  
  fill(0);
  line(0,0,x1,y1);
  ellipse(x1,y1,m1,m1); // draw size as mass
  line(x1,y1,x2,y2);
  ellipse(x2,y2,m2,m2); // draw size as mass
}



float calculateTopAngularAcc(float g,float m1,float m2,float a1,float a2,float a1_v,float a2_v,float r1,float r2) {
  float num = -g * (2*m1 + m2) * sin(a1) - m2 * g * sin(a1 - 2 * a2) - 2 * sin(a1 - a2) * m2 * (a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1-a2));
  float denom = r1 * (2*m1+m2-m2*cos(2*a1-2*a2));
  return num/denom;
}

float calculateBottomAngularAcc(float g,float m1,float m2,float a1,float a2,float a1_v,float a2_v,float r1,float r2) {
  float num = 2*sin(a1-a2)*(a1_v*a1_v*r1*(m1+m2)+g*(m1+m2)*cos(a1)+(a2_v*a2_v)*r2*m2*cos(a1-a2));
  float denom = r2 * (2*m1+m2 - m2*cos(2*a1-2*a2));
  return num/denom;
}