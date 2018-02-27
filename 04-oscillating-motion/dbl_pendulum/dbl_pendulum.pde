float r1 = 150;
float r2 = 180;
float m1 = 100;
float m2 = 105;

float a1 = PI/4;
float a2 = PI/2;

float a1_v = 0;
float a2_v = 0;

float g = 1;

float px2 = 0;
float py2 = 0;

int vertOffset = 50;
int scrollingOffset = 0;


// tuple implementation from stack overflow
// https://stackoverflow.com/questions/2670982/using-pairs-or-2-tuples-in-java
public class Tuple<X,Y>{
  public final float x; 
  public final float y; 
  public Tuple(float x, float y) { 
    this.x = x; 
    this.y = y; 
  }
}

ArrayList<Tuple> pPoints = new ArrayList<Tuple>();


PGraphics traces;

void setup(){
  size(800,600);
  traces = createGraphics(width,height);
  traces.beginDraw();
  traces.background(255);
  traces.stroke(0);
  traces.endDraw();
}



void draw() {
  background(255);
  image(traces,0,scrollingOffset);
  stroke(0);
  strokeWeight(2);
  
  translate(width/2,vertOffset); // move (0,0) to middle top of canvas
 
  float a1_a = calculateTopAngularAcc(g,m1,m2,a1,a2,a1_v,a2_v,r1,r2);
  float a2_a = calculateBottomAngularAcc(g,m1,m2,a1,a2,a1_v,a2_v,r1,r2);
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;
  
  float x1 = r1 * sin(a1);
  float y1 = r1 * cos(a1);
  
  float x2 = x1 + r2 * sin(a2); // include x1 as x-offset
  float y2 = y1 + r2 * cos(a2); // include y1 as y-offset
  
  
  fill(0);
  line(0,0,x1,y1);
  line(x1,y1,x2,y2);
  ellipse(x1,y1,10,10); // draw size as mass
  ellipse(x2,y2,10,10); // draw size as mass
  
  
  
  // draw traces on graphics
  traces.beginDraw();
  traces.background(255);
  traces.translate(width/2,vertOffset+scrollingOffset);
  traces.strokeWeight(0.5);
  traces.stroke(0);
  // avoid drawing until we have accurate px,py
  if (frameCount > 2) { 
  
    //traces.line(x2,y2,px2,py2);
    for (int i = pPoints.size()-1; i>1 ; i--) {
      traces.translate(0,1);
      traces.line(pPoints.get(i-1).x,pPoints.get(i-1).y,pPoints.get(i).x,pPoints.get(i).y);
    }
  }
  traces.endDraw();
  
  px2 = x2;
  py2 = y2;
  
  //scrollingOffset += 1;
  pPoints.add(new Tuple(x2,y2));
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