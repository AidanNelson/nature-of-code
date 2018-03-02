
avoidObstacles(obstacles){
  let visionScale = 100;
  // until start is the same as ahead...
  // increase it a bit in that Direction
  // check whether the point intersects the circle

  let threats = [];
  let a = this.vel.copy();
  a.normalize();

  // trace a ray out from boid and check for collisions at each step
  for (let i = 0; i < 100; i++) {
    a.mult(1.05); // increase by 5% each time through loop
    let ac = a.copy();
    ac.add(this.pos);
    fill(255,0,0);
    ellipse(ac.x,ac.y,2,2);

    for (let j in obstacles){
      let d = p5.Vector.dist(ac,obstacles[j].pos);
      if (d < obstacles[j].radius) {
        threats.push({
          threat: obstacles[j],
          dist: d,
          intersection: ac
        })
        console.log('found first point of contact');
        break;
      }
    }
  }

  threats.sort((a,b) => {
    if (a.dist < b.dist){
      return -1;
    } else {
      return 1;
    }
  });

  let avoid = p5.Vector.sub(threats[0].intersection,threats[0].threat.pos);
  avoid.normalize();
  avoid.setMag(this.maxavoidforce);
  this.applyForce(avoid);
}

//
//
// this.ahead = ahead.copy();
//

// check for collision
// let threats = [];
// for (let i in obstacles){
//   let d = p5.Vector.dist(ahead,obstacles[i].pos);
//   let d2 = p5.Vector.dist(ahead2,obstacles[i].pos);
//
//   let oRadius = obstacles[i].radius;
//   // console.log("d: ",d,"/ orad:",oRadius);
//   if (d < oRadius || d2 < oRadius){
//     // console.log("d: ",d,"/ orad:",oRadius);
//     let dist = Math.min(d,d2);
//     threats.push({
//       dist: dist,
//       obstacle: obstacles[i]
//     });
//   }
// }
//
// threats.sort((a,b) => {
//   if (a.dist < b.dist){
//     return -1;
//   } else {
//     return 1;
//   }
// });
//
// if (threats.length > 0) {
//   // calculate avoidance force
//   // avoidance_force = ahead - obstacle_center
//   // avoidance_force = normalize(avoidance_force) * MAX_AVOID_FORCE
//
//   // let maxavoid(this.maxforce);
//   let threat = threats[0].obstacle;
//
//   // console.log(threat);
//   // basically hoping this code will find point at which ray from boid
//   // first makes contact with obstacle
//   let a = this.vel.copy();
//   a.normalize();
//
//   for (let i = 0; i < 100; i++) {
//     a.mult(1.05); // increase by 5% each time through loop
//     let ac = a.copy();
//     ac.add(this.pos);
//     fill(255,0,0);
//     ellipse(ac.x,ac.y,2,2);
//     let d = p5.Vector.dist(ac,threat.pos);
//     if (d < threat.radius) {
//       console.log('found first point of contact');
//       break;
//     }
//   }
//
//
//   a.add(this.pos);
//   let avoid = p5.Vector.sub(a,threat.pos);
//   avoid.normalize();
//   avoid.setMag(this.maxavoidforce);
//   this.applyForce(avoid);
//
// avoid obstacles
}













// Taking
// E is the starting point of the ray,
// L is the end point of the ray,
// C is the center of sphere you're testing against
// r is the radius of that sphere
// Compute:
// d = L - E ( Direction vector of ray, from start to end )
// f = E - C ( Vector from center sphere to ray start )
//
// Then the intersection is found by..
// Plugging:
// P = E + t * d
// This is a parametric equation:
// Px = Ex + tdx
// Py = Ey + tdy
// into
// (x - h)2 + (y - k)2 = r2
// (h,k) = center of circle.
//
// Note: We've simplified the problem to 2D here, the solution we get applies also in 3D
//
// to get:
//
// Expand
// x2 - 2xh + h2 + y2 - 2yk + k2 - r2 = 0
// Plug
// x = ex + tdx
// y = ey + tdy
// ( ex + tdx )2 - 2( ex + tdx )h + h2 + ( ey + tdy )2 - 2( ey + tdy )k + k2 - r2 = 0
// Explode
// ex2 + 2extdx + t2dx2 - 2exh - 2tdxh + h2 + ey2 + 2eytdy + t2dy2 - 2eyk - 2tdyk + k2 - r2 = 0
// Group
// t2( dx2 + dy2 ) + 2t( exdx + eydy - dxh - dyk ) + ex2 + ey2 - 2exh - 2eyk + h2 + k2 - r2 = 0
// Finally,
// t2( _d * _d ) + 2t( _e * _d - _d * _c ) + _e * _e - 2( _e*_c ) + _c * _c - r2 = 0
// *Where _d is the vector d and * is the dot product.*
// And then,
// t2( _d * _d ) + 2t( _d * ( _e - _c ) ) + ( _e - _c ) * ( _e - _c ) - r2 = 0
// Letting _f = _e - _c
// t2( _d * _d ) + 2t( _d * _f ) + _f * _f - r2 = 0
// So we get:
// t2 * (d DOT d) + 2t*( f DOT d ) + ( f DOT f - r2 ) = 0
// So solving the quadratic equation:
//
// float a = d.Dot( d ) ;
// float b = 2*f.Dot( d ) ;
// float c = f.Dot( f ) - r*r ;
//
// float discriminant = b*b-4*a*c;
// if( discriminant < 0 )
// {
//   // no intersection
// }
// else
// {
//   // ray didn't totally miss sphere,
//   // so there is a solution to
//   // the equation.
//
//   discriminant = sqrt( discriminant );
//
//   // either solution may be on or off the ray so need to test both
//   // t1 is always the smaller value, because BOTH discriminant and
//   // a are nonnegative.
//   float t1 = (-b - discriminant)/(2*a);
//   float t2 = (-b + discriminant)/(2*a);
//
//   // 3x HIT cases:
//   //          -o->             --|-->  |            |  --|->
//   // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit),
//
//   // 3x MISS cases:
//   //       ->  o                     o ->              | -> |
//   // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)
//
//   if( t1 >= 0 && t1 <= 1 )
//   {
//     // t1 is the intersection, and it's closer than t2
//     // (since t1 uses -b - discriminant)
//     // Impale, Poke
//     return true ;
//   }
//
//   // here t1 didn't intersect so we are either started
//   // inside the sphere or completely past it
//   if( t2 >= 0 && t2 <= 1 )
//   {
//     // ExitWound
//     return true ;
//   }
//
//   // no intn: FallShort, Past, CompletelyInside
//   return false ;
// }
