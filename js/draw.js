const canvas = document.getElementById('snake');
const score = document.getElementById('score');

const ctx = canvas.getContext('2d');

const scale = 16;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;

(function setup(){
  snake = new Snake(ctx, scale);
  food = new Food(ctx, scale);

  food.pickLocation(rows, columns, scale);
  
  window.setInterval(()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    snake.update(800, 800);
    food.draw();
    snake.draw();

    if(snake.eat(food)) {
      food.pickLocation(rows, columns)
    }
  }, 250)
}())

window.addEventListener('keydown', (evt => {
  const direction = evt.key.replace('Arrow', '');
  snake.changeDirection(direction);
}))