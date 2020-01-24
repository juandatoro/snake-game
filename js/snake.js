const Snake = function(rows, columns, scale) {
  this.body = [
    {
      x: rows / 2 * scale,
      y: columns / 2 * scale
    }
  ];
  this.rows = rows;
  this.columns = columns;
  this.scale = scale;
  this.head = this.body[0];
  this.lastDeleted = []

  let direction = ['Right'];
  let score = 0;
  let grow = 0;

  this.seeDir = function() {
    return direction;
  }

  this.getDir = function() {
    if(direction.length > 1) {
      return direction.shift()
    } else {
      return direction[0];
    }
  }

  this.overideDir = function(newDir) {
    direction = [newDir] 
  }

  this.changeDir = function(newDir) {
    const currDir = direction[direction.length - 1];
    const goFromXToY = ((currDir === 'Left' || currDir === 'Right') && (newDir !== 'Right' && newDir !== 'Left'));
    const goFromYtoX = ((currDir === 'Down' || currDir === 'Up') && (newDir !== 'Down' && newDir !== 'Up'));

    if(this.body.length > 1){
      (goFromXToY || goFromYtoX) && direction.push(newDir)
    } else {
      direction.push(newDir)
    }
  }

  this.addScore = function(points) {
    score += points;
  }

  this.getScore = function() {
    return score
  }

  this.resetScore = () => {
    score = 0;
  }

  this.growSize = function(blocks) {
    grow = blocks;
  }

  this.checkGrow = function() {
    if(grow > 0){
      grow--;
      return false;
    }
    return true;
  }
}

Snake.prototype.eat = function(food, type) {
  this.addScore(type === 'normal' ? 1 : 9);
  this.growSize(type === 'normal' ? 1 : 2);
  food.setNewLocation(this.body);
}

Snake.prototype.draw = function(ctx) {
  this.body.forEach(el => {
    ctx.fillStyle = 'white';
    ctx.fillRect(el.x, el.y, this.scale, this.scale);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(el.x, el.y, this.scale, this.scale);
  })
  ctx.fillStyle = 'green';
  ctx.fillRect(this.body[0].x, this.body[0].y, this.scale, this.scale);
  ctx.fillStyle = 'blue';
  ctx.fillRect(this.body[this.body.length -1].x, this.body[this.body.length -1].y, this.scale, this.scale);
}

Snake.prototype.move = function() {
  const dir = this.getDir();
  const newHead = this.getNewHead(dir);

  if(this.checkGrow()){
    this.lastDeleted = this.body.pop();
  }
  this.body.unshift(newHead);
  this.head = this.body[0];
}

Snake.prototype.selfCollition = function(head = this.body[0]) {
  return this.body.find((el,idx,arr) => (idx !== 0 && idx !== arr.length - 1) && (el.x === head.x && el.y === head.y));
}

Snake.prototype.checkNewHead = function(newHead) {
  if(this.wallCollition(newHead)){
    this.body.reverse();
    const lastHead = this.body[0];
    newHead = this.lastDeleted;
    if(newHead.y > lastHead.y) this.overideDir('Down');
    if(newHead.y < lastHead.y) this.overideDir('Up');
    if(newHead.x < lastHead.x) this.overideDir('Left');
    if(newHead.x > lastHead.x) this.overideDir('Right');
  }
  return newHead
}

Snake.prototype.getNewHead = function(dir) {
  let x = this.body[0].x
  let y = this.body[0].y
  switch(dir) {
    case 'Left':
      return this.checkNewHead({x: x - this.scale,y})
    case 'Right': 
      return this.checkNewHead({x: x + this.scale,y})
    case 'Up':
      return this.checkNewHead({x, y: y - this.scale})
    case 'Down':
      return this.checkNewHead({x, y: y + this.scale})
  }
}

Snake.prototype.wallCollition = function(head) {
  const hitTop = head.y < 0;
  const hitLeft = head.x < 0;
  const hitBottom = head.y > (this.rows - 1) * this.scale;
  const hitRight = head.x > (this.columns - 1) * this.scale;
  
  return hitTop || hitLeft || hitBottom || hitRight
}
