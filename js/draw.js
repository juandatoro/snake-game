const canvas = document.getElementById('snake');
const score = document.getElementById('score');

const ctx = canvas.getContext('2d');

const scale = 16;

let rows = canvas.height / scale;
let columns = canvas.width / scale;
let speed = 200;
let turbo = false;
let ongame = true

const food = new Food(rows, columns, scale);
const specialFood = new SpecialFood(rows, columns, scale);
const snake = new Snake(rows, columns, scale, ctx);

var interval
const draw = () => {
  snake.move();

  // if(snake.wallCollition()){
  //   console.log(snake.getDir(), snake.body)
  //   snake.draw(ctx);

  //   return 
  // }

  if(snake.selfCollition()){
    clearInterval(interval);
    ongame = false
    return
  }

  if(snake.head.x == food.x && snake.head.y == food.y) {
    snake.eat(food, 'normal');
  }
  if(specialFood.covered.find(el => el.x === snake.head.x && el.y === snake.head.y)) {
    snake.eat(specialFood, 'special');
  }

  ctx.clearRect(0,0, canvas.width, canvas.height);
  food.draw(ctx);
  specialFood.draw(ctx);
  snake.draw(ctx);

  score.innerHTML = snake.getScore();


  // clearInterval(interval);

  // clearTimeout(interval)
  // interval = setTimeout(draw,turbo ? 50 : 500)
}

document.addEventListener('keydown', function(evt){
  const dir = evt.key.replace('Arrow', '');
  if(!turbo && dir === ' ') {
    turbo = true;
    clearInterval(interval);
    if(ongame) interval = setInterval(draw, 50);
  }
  if((dir === 'Left') || (dir === 'Right') || (dir === 'Down') || (dir === 'Up')) {
    snake.changeDir(dir);
    snake.move();
  }
})

document.addEventListener('keyup', (evt => {
  if(turbo && evt.key === ' ') {
    clearInterval(interval);
    if(ongame) interval = setInterval(draw, 500);
    turbo = false;
  }
}))

const runProgram = (function () {
  interval = setInterval(draw, 500);
})()





