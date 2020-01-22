const SpecialFood = function(rows, columns, scale) {
  let points = 0;
  
  this.rows = rows;
  this.columns = columns;
  this.scale = scale;
  this.x = this.getRandom(rows);
  this.y = this.getRandom(columns);
  this.covered = [
    {x: this.x, y: this.y},
    {x: this.x, y: this.y+scale},
    {x: this.x+scale, y: this.y},
    {x: this.x+scale, y: this.y+scale}
  ];

  this.addPoint = function() {
    points+=9;
    return points
  }

  this.getPoints = function() {
    return points
  }

  this.resetPoints = () => {
    points = 0;
    return points
  }
}

SpecialFood.prototype.setNewLocation = function(snakeBody) {
  let x, y, covered, isOverSnake;
  let counter = 0
  do {
    isOverSnake = false
    counter++
    x = this.getRandom(this.rows);
    y = this.getRandom(this.columns);
    covered = [{x,y}, {x,y:y+this.scale}, {x:x+this.scale,y}, {x:x+this.scale,y:y+this.scale}]

    covered.forEach((part => {
      isOverSnake = isOverSnake || snakeBody.find(el => el.x === part.x && el.y === part.y)
    }))
  } while (isOverSnake)

  console.log(counter)

  this.x = x;
  this.y = y;
  this.covered = covered;
}

SpecialFood.prototype.getRandom = function(el) {
  return Math.floor(Math.random() * (el-2)) * this.scale
}

SpecialFood.prototype.draw = function(ctx) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(this.x, this.y, 28, 28);
}
