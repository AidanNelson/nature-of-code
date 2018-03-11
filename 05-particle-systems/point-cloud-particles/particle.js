class Particle {
	constructor(position, lifespan){
		this.pos = position.copy();
		this.vel = createVector(0,0,0);
		this.acc = createVector(0,0,0);
		this.isImmortal = lifespan < 0;
		this.lifespan = lifespan;
		this.groundplane = 100; // level of ground below object at 0,0
		this.size = 2;
	}

	run(){
		this.update();
		this.display();
	}

	update(){
		let drag = 0.99;
		this.vel.add(this.acc);
		this.vel.mult(drag);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.lifespan --;
	}


	display(){
		push();
		stroke(255);
		normalMaterial();
		translate(this.pos.x,this.pos.y,this.pos.z);
		sphere(this.size);
		pop();
	}

	isDead(){
		return (this.lifespan <= 0 && !this.isImmortal);
	}

	applyForce(force){
		this.acc.add(force);
	}
}


class PointCloudParticle extends Particle {
	constructor(position){
		super(position, -1);
		this.home = position.copy();
		this.maxSpeed = random(5,15);
		this.maxForce = random(1,6);
		this.goingHome = false;
		this.img = img;

	}

	update(){
		super.update();
		this.checkEdges();

		if (this.goingHome){
			this.steerHome();
		}
	}

	steerHome(){
		// from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_59_Steering_Text_Paths/vehicle.js
		let desired = p5.Vector.sub(this.home, this.pos);

		let d = desired.mag();
		if (d < 0.1){ // if we're close enough to home, stop going there
			this.goingHome = false;
		}
		let speed = this.maxSpeed;
		if (d < 100) {
			speed = map(d, 0, 100, 0, this.maxSpeed);
		}
		desired.setMag(speed);
		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);
		this.applyForce(steer);
	}

	checkEdges(){
		if (this.pos.y >= this.groundplane){
			this.pos.y = this.groundplane;
			this.vel.mult(-0.7);
		}
	}

	display(){
		push();
		// stroke(255);
		// normalMaterial();
		translate(this.pos.x,this.pos.y,this.pos.z);
		// sphere(this.size);

		// https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/blob/master/chp04_systems/NOC_4_08_ParticleSystemSmoke_WEBGL/particle.js
		// This is needed for the texture to use transparency
    fill(0, 0, 0, 0);
    texture(this.img);
    //ambientMaterial(255, 0, 0);
    plane(20, 20);

		pop();
	}

}
