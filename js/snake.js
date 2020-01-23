const Snake = function(rows, columns, scale, ctx) {
  let direction = ['Right'];
  let score = 0;
  let grow = 0;
  let tailDirection = 'Right'

  
  this.rows = rows;
  this.columns = columns;
  this.scale = scale;
  this.ctx = ctx

  this.body = [
    {
      x: rows / 2 * scale,
      y: columns / 2 * scale
    }
  ];

  this.seeDir = function() {
    return direction;
  }
  
  this.head = this.body[0];
  this.lastDeleted = []

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
  this.willGrow(type === 'normal' ? 1 : 20);
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
  // if(this.body[0]){
  //   this.body[0].rol = 'cabeza'
  //   ctx.fillStyle = 'green';
  //   ctx.fillRect(this.body[0].x, this.body[0].y, this.scale, this.scale);
  // }
  // if(this.body[1]) {
  //   this.body[1].rol = ''
  //   ctx.fillStyle = 'yellow';
  //   ctx.fillRect(this.body[1].x, this.body[1].y, this.scale, this.scale);
  // }
  // if(this.body[2]) {
  //   this.body[2].rol = ''
  //   ctx.fillStyle = 'blue';
  //   ctx.fillRect(this.body[2].x, this.body[2].y, this.scale, this.scale);
  // }
  // if(this.body[3]) {
  //   this.body[3].rol = 'cola'
  //   ctx.fillStyle = 'red';
  //   ctx.fillRect(this.body[3].x, this.body[3].y, this.scale, this.scale);
  // }
}

Snake.prototype.move = function() {
  const dir = this.getDir();
  const newHead = this.getNewHead(dir);

  if(this.needToGrow()){
    this.lastDeleted = this.body.pop();
  }
  // this.draw(this.ctx)
  this.body.unshift(newHead);
  // this.draw(this.ctx)
  this.head = this.body[0];
  // this.draw(this.ctx)
}

Snake.prototype.selfCollition = function(head = this.body[0]) {
  return this.body.find((el,idx,arr) => (idx !== 0 && idx !== arr.length - 1) && (el.x === head.x && el.y === head.y));
}

Snake.prototype.getNewHead = function(dir) {
  let hola = []
  let x = this.body[0].x
  let y = this.body[0].y
  let collition = false;
  let newHead = {}
  let lastHead = {}
  // Check if next step will collide wit a wall
  switch(dir) {
    case 'Left':
      newHead = {x: x - this.scale,y}
      collition = this.wallCollition(newHead)
      if(collition){
        // debugger
        this.draw(this.ctx)
        this.body.reverse()
        this.draw(this.ctx)
        newHead = this.lastDeleted
        lastHead = this.body[0]
        this.ctx.strokeStyle = 'yellow';
        this.ctx.strokeRect(newHead.x, newHead.y, this.scale, this.scale);
        if(newHead.y > lastHead.y) this.overideDir('Down')
        if(newHead.y < lastHead.y) this.overideDir('Up')
        if(newHead.x < lastHead.x) this.overideDir('Left')
        if(newHead.x > lastHead.x) this.overideDir('Right')

        hola = this.seeDir()
        // clearInterval(interval);
        // ongame = false
        // return {x,y}
      }
      
      return newHead
    case 'Right': 
      newHead = {x: x + this.scale,y}
      collition = this.wallCollition(newHead)
      // if(collition){
      //   debugger
      // }
      if(collition){
        console.log('Entrando aca')
        this.draw(this.ctx)
        this.body.reverse()
        this.draw(this.ctx)
        newHead = {x: this.body[0].x - this.scale, y: this.body[0].y}
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(newHead.x, newHead.y, this.scale, this.scale);
        
        // debugger
        if(this.selfCollition(newHead)) {
          x = this.body[0].x
          y = this.body[0].y
          newHead = {x: x + this.scale,y}
          this.ctx.strokeStyle = 'yellow';
          this.ctx.strokeRect(newHead.x, newHead.y, this.scale, this.scale);
          // head = {x: this.body[0].x - this.scale, y: this.body[0].y}
          // this.overideDir('Left')
        } else {
          this.overideDir('Left')
        }

      }
      return newHead
    case 'Up':
      newHead = {x, y: y - this.scale}
      collition = this.wallCollition(newHead)
      return newHead
    case 'Down':
      newHead = {x, y: y + this.scale}
      collition = this.wallCollition(newHead)
      return newHead
  }
}

Snake.prototype.wallCollition = function(head) {
  const hitTop = head.y < 0;
  const hitLeft = head.x < 0;
  const hitBottom = head.y > (this.rows - 1) * this.scale;
  const hitRight = head.x > (this.columns - 1) * this.scale;
  
  return hitTop || hitLeft || hitBottom || hitRight
}


// if(dir === 'Left') {
//   if(newHead.x - scale < 0){
//     console.log('choco izquierda')
//   }
//   newHead.x -= scale;
// }
// if(dir === 'Right') {
//   if(newHead.x + scale > (this.columns - 1) * this.scale){
//     console.log('choco derecha')
//   }
//   newHead.x += scale;
// }
// if(dir === 'Up') {
//   if(newHead.y - scale < 0){
//     console.log('choco top')
//     this.body.reverse()
//     this.overideDir(['Down'])
//     newHead.y += scale;
//   } else {
//     newHead.y -= scale;
//   }
// }
// if(dir === "Down") {
//   if(newHead.y + scale > (this.rows - 1) * this.scale){
//     console.log('choco down')
//   }
//   newHead.y += scale;
// }

// if(hitRight = newHead.x > (this.columns - 1) * this.scale){
//   console.log('colision antes de mover')
// }

