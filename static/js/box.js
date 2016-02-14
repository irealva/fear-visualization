/*
* Box.js A class to create boxes to hold text answers
* I took some base code from Daniel Shiffman's examples online
* Please find them here: https://github.com/shiffman/Programming-from-A-to-Z-F14/
* He had an algorithm for fitting DIVs on a DOM using a randomized greedy algorithm
* I modifiedthe code extensively to add animations and check for only 
* particular DIVs on a screen
*/

function Box(sketch, size, text, id) {
  // Using the browser page width and height
  this.x = sketch.random(window.innerWidth); // or try screen.height;
  this.y = sketch.random(window.innerHeight);
  this.fontSize = sketch.floor(sketch.random(24,56));
  
  this.div = sketch.createDiv(text);
  //console.log("created div" + id) ;
  this.div.parent('fearViz'); //Adding it to the right element
  this.div.id(id) ;
  $("#"+id).css({display:'none'}).fadeIn(2500).delay(3000).fadeOut(2500, function() { $("#"+id).remove(); }); 
  
  //this.div.setAttribute("id", "div1");
  this.div.style('font-size',this.fontSize+'px');
  this.div.style('width', '16em') ;
  this.div.position(this.x,this.y);
  
  this.rotated = false;
  this.w = this.div.elt.offsetWidth;
  this.h = this.div.elt.offsetHeight;

  this.kill = function() {
    //console.log("killed div" + id) ;
    this.div.remove();
  }

  // Is this box off the screen?
  this.offscreen = function() {
    var buffer = 2;
    if (this.x + this.w + buffer  > sketch.windowWidth)  return true;
    if (this.y + this.h + buffer  > sketch.windowHeight) return true;
    return false;
  }

  // Does this box overlap another box?
  this.overlaps = function(other) {
    var buffer = 2;
    
    // If it's to the right it does not
    if (this.x                   > other.x + other.w + buffer) return false;
    // If it's to the left it does not
    if (this.x + this.w + buffer < other.x)                    return false;
    // If it's below it does not
    if (this.y                   > other.y + other.h + buffer) return false;
    // If it's above it does not
    if (this.y + this.h + buffer < other.y)                    return false;
    // Well if none of these are true then it overlaps
    return true; 
  }
  
  // Check if this box fits on the screen and does not overlap with previous DIVs
  this.fits = function(boxes, indexBox) {
    // If it's off the screen return false
    if (this.offscreen()) {
      return false;
    }

    //if there is only 1 other text box on the screen
    if (indexBox == 1) {
      if(this.overlaps(boxes[indexBox-1])) {
        return false ;
      }
    }

    //if more than two text boxes have already showed up on the screen
    //If its close to the prevoius DIV then return false
    if (indexBox > 1) {
      //console.log("trying to fix box: " + indexBox + " and checking for " + (indexBox-1)) ;
      if(this.overlaps(boxes[indexBox-1]) || this.overlaps(boxes[indexBox-2])) {
        return false ;
      }
    }

    return true;
  }
}