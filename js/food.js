const Food = function(rows, columns, scale) {
  let points = 0;
  
  this.rows = rows;
  this.columns = columns;
  this.scale = scale;
  this.isOnBoard = false;
  this.timer = 0;
  this.x = this.getRandom(rows);
  this.y = this.getRandom(columns);
  
  this.addPoint = function() {
    points++;
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

Food.prototype.getRandom = function(el) {
  return Math.floor(Math.random() * (el-1)) * this.scale
}

Food.prototype.setNewLocation = function(snakeBody) {
  let isOverSnake = false;
  let x, y;
  do {
    x = this.getRandom(this.rows);
    y = this.getRandom(this.columns);
    isOverSnake = snakeBody.find(el => el.x === x && el.y === y)
  } while (isOverSnake)
  this.x = x;
  this.y = y
}

Food.prototype.draw = function(ctx) {
  ctx.fillStyle = 'blue';
  ctx.fillRect(this.x, this.y, this.scale, this.scale);
}

Food.prototype.clearTimer = function() {
  clearTimeout(this.timer);
}
