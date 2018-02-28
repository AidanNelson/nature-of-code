class Shepherd {
  constructor(x,y,herd,ms,mf){
    this.pos = createVector(x,y);
    this.vel = createVector(random(-0.5,0.5),random(-0.5,0.5));
    this.acc = createVector(0,0);

    this.maxspeed = ms || 8;
    this.maxforce = mf || 0.8;

    this.herd = herd;
    this.straySheep = [];
    this.target = createVector(300,300);

    this.strayDistance = shc.strayDistance;
    this.crouchDistance = shc.crouchDistance;
    this.driveDistance = shc.driveDistance;
    this.collectDistance = shc.collectDistance;
  }

  run(){
    // update from controls
    this.strayDistance = shc.strayDistance;
    this.crouchDistance = shc.crouchDistance;
    this.driveDistance = shc.driveDistance;
    this.collectDistance = shc.collectDistance;

    // first, check if we should crouch
    let tooClose = false;

    for (let i = 0; i < sheep.length; i++){
      if (p5.Vector.dist(this.pos,sheep[i].pos) < this.crouchDistance){
        tooClose = true;
        break;
      }
    }

    if (tooClose) {
      this.crouch();
    } else {
      this.findStraySheep();

      if (this.straySheep.length > 0){
        this.collect(this.straySheep[0]);
      } else {
        this.drive(this.herd,this.target);
      }

      // loop and find the sheep straying the farthest
      // finding current sheep could be some combination of farthest from herd and closest to me

      //
      //   // currentSheep = that sheep;
      //   // curentSheep = this.findSheep();
      // } else {
      //   // if too close to currentSheep
      //   // this.crouch()
      //   // else
      //   // this.collect(currentSheep);
      //
      //   // if currentSheep is close enough to center/herd/whatever
      //   // find a new currentSheep
      //
      // }
      // // OBSTACLE AVOIDANCE OF THE GCM OF THE flock
      //







      let sheep = this.herd.sheep;
      let driveSheep = true;

      for (let i = 0; i < sheep.length; i++){
        if (p5.Vector.dist(this.pos,sheep[i].pos) < this.crouchDistance){
          // console.log("crouching");
          this.crouch();
          break;
        } else if (p5.Vector.dist(sheep[i].pos,gcm) > this.strayDistance){
          // console.log("collecting stray sheep");
          this.collect(sheep[i]);
          driveSheep = false;
          break;
        }
      }

      if (driveSheep) {
        // console.log("driving this.herd to target");
        this.drive(this.herd,this.target);
      }


      this.update();
      this.display();
    }

    // finds all stray sheep and puts them in this.straySheep (if they aren't in
    // it already), then sorts this.straySheep by distance from this.pos
    findStraySheep(){
      let gcm = herd.getGCM();
      let sheep = this.herd.sheep;
      let strays = [];

      for (let i = 0; i < sheep.length; i++){
        let isStray = this.straySheep.includes(sheep[i]);
        let d = p5.Vector.dist(sheep[i].pos,gcm);
        if (d > this.strayDistance && !isStray){
          this.straySheep.push(sheep[i]);
        }
      }

      this.straySheep.sort((a,b) => {
        let d1 = p5.Vector.dist(a.pos,gcm);
        let d2 = p5.Vector.dist(b.pos,gcm);
        if (d1 < d2) {
          return -1;
        } else {
          return 1;
        }
      });
    }


    collect(straySheep){
      let gcm = this.herd.getGCM();
      let dir = p5.Vector.sub(straySheep.pos,gcm);
      dir.normalize(); // make a unit vector
      dir.setMag(this.collectionDistance); // set distance of unit vector
      let target = p5.Vector.add(straySheep.pos,dir);
      this.seek(target);
    }

    drive(herd,target){
      let gcm = this.herd.getGCM();
      let dir = p5.Vector.sub(gcm,target); // dir from target to GCM
      dir.normalize();
      dir.setMag(this.driveDistance);
      let t = p5.Vector.add(gcm,dir);
      this.seek(t);
    }

    seek(target){
      let desired = p5.Vector.sub(target,this.pos);
      // we would like to go as fast as possible toward the target
      desired.setMag(this.maxspeed);
      let steer = p5.Vector.sub(desired,this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }

    crouch(){
      this.vel.mult(0);
    }

    applyForce(f){
      this.acc.add(f);
    }

    update(){
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      // this.wrapAround();
    }

    wrapAround() {
      if (this.pos.x < 0) this.pos.x = width;
      if (this.pos.y < 0) this.pos.y = height;
      if (this.pos.x > width) this.pos.x = 0;
      if (this.pos.y > height) this.pos.y = 0;
    }

    display(){
      // Draw a triangle rotated in the direction of velocity
      // copied from example 01
      let theta = this.vel.heading() + PI / 2;
      let size = 10;
      push();
      fill(255);
      stroke(0);
      strokeWeight(1);
      translate(this.pos.x, this.pos.y);
      rotate(theta);
      beginShape();
      vertex(0, -size * 2);
      vertex(-size, size * 2);
      vertex(size, size * 2);
      endShape(CLOSE);
      pop();
    }
  }
