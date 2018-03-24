class PointCloudParticleSystem {
	// ES6 syntax to have scale parameter be optional as per...
	// https://stackoverflow.com/questions/12797118/how-can-i-declare-optional-function-parameters-in-javascript
	constructor(cloud,reductionFactor,scale = 1){
		this.scale = scale;
		this.particles = [];
		for (let i = 0; i < cloud.getRowCount(); i+= reductionFactor){
			let position = createVector(cloud.get(i,0),cloud.get(i,1),cloud.get(i,2)).mult(this.scale);
			this.particles.push(new PointCloudParticle(position));
		}
		console.log('point cloud size:', cloud.getRowCount());
		console.log('particle system size:',this.particles.length);

		// this.homeCounter = 0;
	}

	run(){
		for (let particle of this.particles) {
			particle.run();
		}
	}

	applyForce(force){
		for (let particle of this.particles){
			particle.goingHome = false;
			particle.applyForce(force);
		}
	}

	// https://stackoverflow.com/questions/8670877/this-value-in-javascript-anonymous-function
	bringThemHome(){
		// shiffman pseudo Code
		// if (homeCounter < this.particles.length) {
		// let current = this.particles[homeCounter];
		// current.goingHome = true;
		// homeCounter++;
		//
		// }

		// let steer = (function (i) { this.particles[i].goingHome = true; }).bind(this);
		// for (let i = 0; i < this.particles.length; i++){
		// 	setTimeout(()=>{this.paristeer(i);},i);
		// }
		 for (let i = 0; i < this.particles.length; i++){
			this.particles[i].goingHome = true;
		}
	}
}




























class ParticleSystem {
	constructor(origin, size){
		this.particles = [];
		this.origin = origin.copy();
		this.size = size;
		for (let i = 0; i < this.size; i++){
			this.addParticle();
		}
	}

	addParticle(){
		this.particles.push(new Particle(this.origin,floor(random(10,100))));
	}

	run(){
		this.update();
		for (let particle of this.particles) {
			particle.run();
		}
	}

	applyForce(force){
		for (let particle of this.particles){
			particle.applyForce(force);
		}
	}

	update(){
		// cull old particles
		this.particles = this.particles.filter(particle => !particle.isDead());
		// add new up to size
		for (let i = 0; i < (this.size - this.particles.length); i++){
			this.addParticle();
		}
	}
}
