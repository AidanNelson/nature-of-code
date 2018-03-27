class Point {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point){
    return (point.x >= this.x - this.w/2 &&
      point.x <= this.x + this.w/2 &&
      point.y >= this.y - this.h/2 &&
      point.y <= this.y + this.h/2)
    }
  }

  class QuadTree {
    constructor(boundary, n) {
      this.boundary = boundary;
      this.capacity = n;
      this.points = [];
      this.divided = false;
    }

    insert(point){
      if (!this.boundary.contains(point)){ return false; }
      if (this.points.length < this.capacity){
        this.points.push(point);
        return true;
      } else{
        if (!this.divided){
          this.subdivide();

        }

        if (this.northeast.insert(point)){
          return true;
        } else if (this.northwest.insert(point){
          return true;
        } else if (this.southeast.insert(point){
          return true;
        } else if (this.southwest.insert(point){
          return true;
        }
      }
    }

    display(){
      stroke(255);
      strokeWeight(2);
      noFill();
      rectMode(CENTER);
      rect(this.boundary.x,this.boundary.y,this.boundary.w,this.boundary.h);
      if (this.divided){
        this.northeast.display();
        this.northwest.display();
        this.southeast.display();
        this.southwest.display();

      }
    }


    subdivide(){
      let nw = new Rectangle(this.boundary.x - this.boundary.w / 4,this.boundary.y - this.boundary.h / 4, this.boundary.w/2, this.boundary.h/2);
      let ne = new Rectangle(this.boundary.x + this.boundary.w / 4,this.boundary.y - this.boundary.h / 4, this.boundary.w/2, this.boundary.h/2);
      let sw = new Rectangle(this.boundary.x - this.boundary.w / 4,this.boundary.y + this.boundary.h / 4, this.boundary.w/2, this.boundary.h/2);
      let se = new Rectangle(this.boundary.x + this.boundary.w / 4,this.boundary.y + this.boundary.h / 4, this.boundary.w/2, this.boundary.h/2);

      this.northwest = new QuadTree(nw, this.capacity);
      this.northeast = new QuadTree(ne, this.capacity);
      this.southwest = new QuadTree(sw, this.capacity);
      this.southeast = new QuadTree(se, this.capacity);

      this.divided = true;
    }
  }
