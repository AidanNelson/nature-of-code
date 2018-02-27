// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// as WRAPPER for matter.js object
class Mover {
  constructor(x,y,w,h) {
    let params ={
      friction: 0.6,
      restitution: 0.7
    }
    this.body = Bodies.rectangle(x,y,w,h,params);
    this.w = w;
    this.h = h;
    World.add(engine.world,[this.body]);
  }

  display() {
    let pos = this.body.position;
    stroke(0);
    strokeWeight(2);
    fill(255, 127);
    rectMode(CENTER);
    rect(pos.x, pos.y, this.w,this.h);
  }

  applyForce(f){
    Matter.Body.applyForce(this.body,this.body.position,f);
  }

}
