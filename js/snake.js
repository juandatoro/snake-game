const Snake = function(rows, columns, scale) {
  let direction = ['Right'];
  let score = 0;
  let grow = 0;
  let tailDirection = 'Right'
  
  this.rows = rows;
  this.columns = columns;
  this.scale = scale;

  this.body = [
    {
      x: rows / 2 * scale,
      y: columns / 2 * scale
    }
  ];

  this.head = this.body[0];

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

  this.willGrow = function(blocks) {
    grow = blocks;
  }

  this.needToGrow = function() {
    if(grow > 0){
      grow--;
      return false;
    }
    return true;
  }
}

Snake.prototype.eat = function(food, type) {
  this.addScore(type === 'normal' ? 1 : 9);
  this.willGrow(type === 'normal' ? 1 : 40);
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
}

Snake.prototype.move = function() {
  const dir = this.getDir();
  const newHead = {
    x: this.body[0].x,
    y: this.body[0].y
  }

  if(dir === 'Left') {
    if(newHead.x - scale < 0){
      console.log('choco izquierda')
    }
    newHead.x -= scale;
  }
  if(dir === 'Right') {
    if(newHead.x + scale > (this.columns - 1) * this.scale){
      console.log('choco derecha')
    }
    newHead.x += scale;
  }
  if(dir === 'Up') {
    if(newHead.y - scale < 0){
      console.log('choco top')
      this.body.reverse()
      this.overideDir(['Down'])
      newHead.y += scale;
    } else {
      newHead.y -= scale;
    }
  }
  if(dir === "Down") {
    if(newHead.y + scale > (this.rows - 1) * this.scale){
      console.log('choco down')
    }
    newHead.y += scale;
  }

  if(hitRight = newHead.x > (this.columns - 1) * this.scale){
    console.log('colision antes de mover')
  }

  this.needToGrow() && this.body.pop();
  this.body.unshift(newHead);
  this.head = this.body[0];
}

Snake.prototype.selfCollition = function() {
  return this.body.find((el,idx,arr) => (idx !== 0 && idx !== arr.length - 1) && (el.x === this.head.x && el.y === this.head.y));
}

Snake.prototype.wallCollition = function() {
  const hitTop = this.body[0].y < 0;
  const hitLeft = this.body[0].x < 0;
  const hitBottom = this.body[0].y > (this.rows - 1) * this.scale;
  const hitRight = this.body[0].x > (this.columns - 1) * this.scale;
  
  return hitTop || hitLeft || hitBottom || hitRight
}
