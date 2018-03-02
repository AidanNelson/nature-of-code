// Floyd-Steinberg Dithering implementation from:
// https://www.youtube.com/watch?v=0L2n8Tg2FwI

// questions:
// why does fsDither function work w/o returning img? is img copied or referenced?
// why lines in dithered image?
// best practices for scope of variables?
// using resize p5image method?
// does this dithering work with very small images?
// start w plain



let myImg;
let orig;

function preload(){
  orig = loadImage("turtle2.jpg");
  myImg = loadImage("turtle2.jpg");
}

function setup(){
  createCanvas(1200,400);
  //myImg.resize(200,150);
  fsDither(myImg,1);


  image(orig,0,0);
  image(myImg,400,0);
}


function draw(){
}




function fsDither(myImg, factor){
  myImg.loadPixels();
  for (let y = 0; y < myImg.height; y++){
    for (let x = 0; x < myImg.width; x++){

      // for index x,y, round according to quantize factor
      let index = getIndex(myImg,x,y);

      let oldR = myImg.pixels[index  ];
      let oldG = myImg.pixels[index+1];
      let oldB = myImg.pixels[index+2];

      let newR = round(factor * oldR/255) * (255/factor);
      let newG = round(factor * oldG/255) * (255/factor);
      let newB = round(factor * oldB/255) * (255/factor);

      let errR = oldR - newR;
      let errG = oldG - newG;
      let errB = oldB - newB;

      myImg.pixels[index  ] = newR;
      myImg.pixels[index+1] = newG;
      myImg.pixels[index+2] = newB;

      let quantError = {
        r: errR,
        g: errG,
        b: errB
      };

      // pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error * 7 / 16
      index = getIndex(myImg,x+1,y);
      passErrorAlong(myImg, index, quantError, 7/16);
      // pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error * 3 / 16
      index = getIndex(myImg,x-1,y+1);
      passErrorAlong(myImg, index, quantError, 3/16);
      // pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error * 5 / 16
      index = getIndex(myImg,x,y+1);
      passErrorAlong(myImg, index, quantError, 5/16);
      // pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error * 1 / 16
      index = getIndex(myImg,x+1,y+1);
      passErrorAlong(myImg, index, quantError, 1/16);
    }
  }

  myImg.updatePixels();
}

function passErrorAlong(myImg, index, quantError, factor){
  // console.log("passing error along");
  myImg.pixels[index  ] = myImg.pixels[index  ] + (quantError.r * factor);
  myImg.pixels[index+1] = myImg.pixels[index+1] + (quantError.g * factor);
  myImg.pixels[index+2] = myImg.pixels[index+2] + (quantError.b * factor);
}

function getIndex(img,x,y){
  return (x + y * width) * 4;
}
