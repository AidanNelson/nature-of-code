// following along with.... https://www.youtube.com/watch?v=OJxEcs0w_kE

let qt;

function setup(){


  createCanvas(windowWidth,windowHeight);
  background(0);
  let boundary = new Rectangle(width/2,height/2,width,height);
  qt = new QuadTree(boundary, 4);
  console.log(qt);

  // for (let i = 0; i < 50; i++){
  //   let p = new Point(random(width),random(height));
  //   ellipse(p.x,p.y,5,5);
  //   qt.insert(p);
  // }

  // qt.display();
}

function draw(){

  if (mouseIsPressed){
    let p = new Point(mouseX,mouseY);
    ellipse(p.x,p.y,2,2);
    qt.insert(p);
  }
  qt.display();
}
