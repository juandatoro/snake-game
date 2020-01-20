function Snake(ctx, scale) {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];


  this.draw = function() {
    ctx.fillStyle = "#FFFFFF";
    for(let i=0; i<this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
      ctx.strokeStyle = 'red'
      ctx.strokeRect(this.tail[i].x, this.tail[i].y, scale, scale)
    }
    ctx.fillRect(this.x, this.y, scale, scale);
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(this.x, this.y, scale, scale);
  }

  this.update = function(width, height) {
    for(let i=0; i<this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i+1]
    }

    this.tail[this.total - 1] = {x: this.x, y: this.y}

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if(this.x > width) {
      this.x = 0;
    }
    if(this.y > height) {
      this.y = 0;
    }
    if(this.x < 0) {
      this.x = width;
    }
    if(this.y < 0) {
      this.y = height;
    }
  }

  this.changeDirection = function(direction) {
    switch(direction){
      case 'Up': 
        this.xSpeed = 0;
        this.ySpeed = -scale;
        break;
      case 'Down': 
        this.xSpeed = 0;
        this.ySpeed = scale;
        break;
      case 'Left': 
        this.xSpeed = -scale;
        this.ySpeed = 0;
        break;
      case 'Right': 
        this.xSpeed = scale;
        this.ySpeed = 0;
        break;
    }
  }

  this.eat = function(food) {
    if(this.x === food.x && this.y === food.y) {
      this.total++;
      return true
    }
    return false
  }
}