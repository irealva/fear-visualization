/*
* Sketch.js Main script for viewing a text and processing visualization
* It's actually comprised of TWO mini-sketches createdin instance mode
* Instance mode keeps all your variables out of the global scope of your page
* One sketch (s1) creates the text boxes. The other (s2) creates the line 
* visualization. 
*/



/*
* Shuffle function
* @return an re-shuffled array
* Took this algorithm from http://bost.ocks.org/mike/shuffle/
* It is an implementation of a fisher-yates shuffle algorithm
*/
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
* S1 sketch
* A visualization of text elements that generate and disappear over time
*/
var s1 = function(sketch){
  var boxes = [];
  var boxsize = 400; //size of the box holding the text

  var responses ; // array that will hld the loaded list of texts
  var textNum ; //total number of boxes to be created

  var i = 0 ; //tally for the number of boxes created

  var frameRateTally = 9 ;
  var frameRateNum = 0.25 ;

  sketch.preload = function() {
    responses = sketch.loadStrings('data/data.txt') ; //load texts from a file onto an array
  }

  sketch.setup= function() {
    sketch.frameRate(frameRateNum) ;
    textNum = responses.length ;
    shuffle(responses); //reshuffle the text array in case user refreshes page
  }

  sketch.draw = function() {

    if(i == frameRateTally) { //increment the frame rate over time
      //console.log("Tally " + frameRateTally + "Rate " + frameRateNum) ;
      sketch.frameRate(frameRateNum) ;
      frameRateTally = frameRateTally + 10 ;
      frameRateNum = frameRateNum + 0.05 ;
    }
    
    var createBox = function() {
      return new Box(sketch, boxsize, responses[i], i) ;
    };

    var created = false ; //to check if we were able to fit the text box

    if (i > (textNum-1)) {
      created = true ;
    }
    
    while(!created) { //In case the text box doesn't fit, create another one
      if (i < textNum) {
        var b = createBox() ;
        if(b.fits(boxes, i)) {
          boxes.push(b) ;
          //console.log(boxes) ;
          //console.log(boxes.length) ;
          created = true ;
          i++ ;
        }
        else {
          b.kill() ;
        }
      }
    }
  }
};

/*
* S2 sketch
* A visualization of text lines created on a canvas and based on a perlin noise system
* I modified some base code here: http://www.openprocessing.org/sketch/10475
* Modifications included getting rid of the click functionality, adapting it for p5.js, 
* and transferring it to instance mode. 
*/
var s2 = function(sketch){
  var elapsedFrames = 0;
  var points = [] ;
  var drawing = true;

  sketch.setup = function() {
    canvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
    //canvas.parent('points');

    sketch.smooth();
  }

  function Point(_pos, _vel, _lifeTime) {
    this.pos = _pos ;
    this.vel = _vel ;
    this.noiseVec = new p5.Vector() ;

    this.lifeTime = _lifeTime ; 
    this.age = 0 ;
    this.isDead = false ;
     

    this.update = function() {
      this.noiseFloat = sketch.noise(this.pos.x * 0.0025, this.pos.y * 0.0025, elapsedFrames * 0.001);
      this.noiseVec.x = sketch.cos(((this.noiseFloat -0.3) * sketch.TWO_PI) * 10);
      this.noiseVec.y = sketch.sin(((this.noiseFloat - 0.3) * sketch.TWO_PI) * 10);
       
      this.vel.add(this.noiseVec);
      this.vel.div(2);
      this.pos.add(this.vel);
       
      if(1.0-(this.age/this.lifeTime) == 0){
       this.isDead = true;
      }
       
      if(this.pos.x < 0 || this.pos.x > sketch.width || this.pos.y < 0 || this.pos.y > sketch.height){
       this.isDead = true;
      }
       
      this.age++;   
    }
     
    this.draw = function() {  
      sketch.fill(0,20);
      sketch.noStroke();
      sketch.ellipse(this.pos.x, this.pos.y, 1-(this.age/this.lifeTime), 1-(this.age/this.lifeTime));
    }
    
  };

  sketch.draw = function() {
    if(drawing == true){
      var pos = new p5.Vector() ;
      pos.x = sketch.random(window.innerWidth);
      pos.y = sketch.random(window.innerHeight);
   
      var vel = new p5.Vector() ;
      vel.x = (0);
      vel.y = (0);
     
      var punt = new Point(pos, vel, 250); 
      points.push(punt); 
    }
     
    for(var k = 0; k < points.length; k++){
     var localPoint = points[k];
     if(localPoint.isDead == true){
      points.splice(k, 1);
     }
     localPoint.update();
     localPoint.draw();
    }
     
    elapsedFrames++;
  };
};

var p51 = new p5(s1, 'texts'); //Text boxes
var p52 = new p5(s2, 'points'); //Canvas painting









