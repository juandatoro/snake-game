const canvas = document.getElementById('snake');
const score = document.getElementById('score');

window.originalSetInterval = window.setInterval;
window.originalClearInterval = window.clearInterval;
window.originalSetTimeout = window.setTimeout;
window.originalClearTimeout = window.clearTimeout;
window.activeTimers = 0;
window.time = 0

window.setInterval = function(func, delay) {
    window.activeTimers++;
    return window.originalSetInterval(func, delay);
};

window.clearInterval = function(timerID) {
    window.activeTimers--;
    window.originalClearInterval(timerID);
};

window.setTimeout = function(func, delay) {
  window.activeTimers++;
  return window.originalSetTimeout(func, delay);
};

window.clearTimeout = function(timerID) {
  window.activeTimers--;
  window.originalClearTimeout(timerID);
};

const ctx = canvas.getContext('2d');

const scale = 16;

let rows = canvas.height / scale;
let columns = canvas.width / scale;
let speed = 200;
let turbo = false;
let ongame = true
let moveInterval, foodInterval, specialFoodInterval;

const food = new Food(rows, columns, scale);
const specialFood = new SpecialFood(rows, columns, scale);
const snake = new Snake(rows, columns, scale);

const setFoodInterval = (type) => {
  if(type === 'normal') {
    return setInterval(()=>food.setNewLocation(snake.body), Math.floor(Math.random()*6000 + 4000))
  } else {
    return setInterval(()=>specialFood.setNewLocation(snake.body), Math.floor(Math.random()*4000 + 1000))
  }
}

const draw = () => {
  snake.move();
  
  if(snake.selfCollition()){
    clearInterval(moveInterval);
    clearInterval(foodInterval);
    clearInterval(specialFoodInterval);
    ongame = false
    return
  }

  if(snake.head.x == food.x && snake.head.y == food.y) {
    clearInterval(foodInterval);
    snake.eat(food, 'normal');
    if(ongame) foodInterval = setFoodInterval('normal');
  }
  if(specialFood.covered.find(el => el.x === snake.head.x && el.y === snake.head.y)) {
    clearInterval(specialFoodInterval);
    snake.eat(specialFood, 'special');
    if(ongame) specialFoodInterval = setFoodInterval('special');
  }

  score.innerHTML = snake.getScore();

  ctx.clearRect(0,0, canvas.width, canvas.height);
  snake.draw(ctx);
  food.draw(ctx);
  specialFood.draw(ctx);
}

document.addEventListener('keydown', function(evt){
  const dir = evt.key.replace('Arrow', '');
  if(!turbo && dir === ' ') {
    turbo = true;
    clearInterval(moveInterval);
    if(ongame) moveInterval = setInterval(draw, 50);
  }

  if((dir === 'Left') || (dir === 'Right') || (dir === 'Down') || (dir === 'Up')) {
    snake.changeDir(dir);
  }
})

document.addEventListener('keyup', (evt => {
  if(turbo && evt.key === ' ') {
    clearInterval(moveInterval);
    if(ongame) moveInterval = setInterval(draw, 300);
    turbo = false;
  }
}))

let test

saludar = (test) => {
  + new Date()
  console.log(Math.floor(Date.now() / 1000))
  clearTimeout(' soy yo',test)
  test = saludar(test, Math.floor(Math.random()*4000 + 1000))
}

const Init = (function () {
  draw();
  moveInterval = setInterval(draw, 300);
  foodInterval = setFoodInterval('normal');
  specialFoodInterval = setFoodInterval('special');
})()



