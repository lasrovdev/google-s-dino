const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = {
  started: false,
  gameOver: false,
  
  speed: 4.5,
  
  score: 0,
  highScore: 0,
  
  startedGameTime: Date.now(),
  
  framecount: 1,
  x_new_cactus: 1000,
  
  darkMode: false,
  afternoon: false,
  
  obstacle: Math.random(),
  
  lastScoreNight: 0,
  
  score100: false,
  fillStyleHighScore: "black",
  
  normalGame: true
};
const dino = {
  x: 20,
  y: 158, //Modified
  
  y_for_gravity: 158, //No modified
  
  w: 55,
  h: 60,
  
  img: new Image(),
  
  jump: false,
  
  vel_jump: 5,
  
  step: 0,
  
  limit_jump: 68,
  gravity: 7
};
const floor1 = {
  x: 0,
  y: 200,

  w: 850,
  h: 13,

  img: new Image()
};
const floor2 = {
  x: 850,
  y: 200,

  w: 850,
  h: 13,

  img: new Image()
};

const cloud1 = {
  x: 600,
  y: 50,
  
  w: 60,
  h: 60,
  
  img: new Image()
};
const cloud2 = {
  x: 800,
  y: 10,

  w: 60,
  h: 60,

  img: new Image()
};
const cloud3 = {
  x: 1000,
  y: 50,

  w: 60,
  h: 60,

  img: new Image()
};

const star1 = {
  x: 400,
  y: 50
};
const star2 = {
  x: 500,
  y: 98
};
const star3 = {
  x: 100,
  y: 35
};

const moon = {
  x: window.innerWidth,
  y: 30,
  
  h: 60,
  
  img: new Image()
}

let mass = 1;
let vel = 8;

let frames = 0;

const clouds = [cloud1, cloud2, cloud3];
const stars = [star1, star2, star3]
let cactuses = [];
let mountains = [];

const dinoRunStep1 = new Image();
const dinoRunStep2 = new Image();

const dinoDead = new Image();
const dinoJump = new Image();

const mountain = new Image();

dinoRunStep1.src = "Images/Dino/DinoRun1.png";
dinoRunStep2.src = "Images/Dino/DinoRun2.png";

dinoDead.src = "Images/Dino/DinoDead.png";
dinoJump.src = "Images/Dino/DinoJump.png";

mountain.src = "Images/Other/mountain.png";

let cactus_images = ["LargeCactus1", "SmallCactus1", "SmallCactus2"];
const cactus_type = {
  "LargeCactus1": new Image(),
  "LargeCactus2": new Image(),
  "LargeCactus3": new Image(),
  "LargeCactus4": new Image(),
  "LargeCactus5": new Image(),
  "SmallCactus1": new Image(),
  "SmallCactus2": new Image(),
  "SmallCactus3": new Image(),
  "SmallCactus4": new Image()
};

for (let [type, image] of Object.entries(cactus_type)){
  cactus_type[type].src = "Images/Cactus/" + type + ".png";
};
for (let i = 0; i * 150 < window.innerWidth; ++i){
  mountains.push({
    x: i * 150,
    
    img: mountain
  })
}

const birdStep1 = new Image();
const birdStep2 = new Image();

const bird = {
  stepBird: 0,
  
  img: birdStep1,
  
  x: canvas.width,
  y: 158,
  y2: 170, //Y for step 2
  
  w: 60,
  h: 40
};

const stars_img = [0, 0];
const moons = [];

let moon_level = 1;

const jump_audio = new Audio("Audio/jump.mp3");
const gameOver_audio = new Audio("Audio/gameOver.mp3");
const score100_audio = new Audio("Audio/score100.mp3");

floor1.img.src = "Images/Other/Track.png";
floor2.img.src = "Images/Other/Track.png";

birdStep1.src = "Images/Bird/Bird1.png";
birdStep2.src = "Images/Bird/Bird2.png";

clouds.forEach(c => c.img.src = "Images/Other/Cloud.png");

dino.img.src = "Images/Dino/DinoStart.png";

stars_img.forEach((x, i) => {
  stars_img[i] = new Image();
  
  stars_img[i].src = `Images/Star/star${i + 1}.png`;
});
for (let star of stars){
  star.img = stars_img[Math.floor(Math.random() * stars_img.length)];
}

for (let i = 0; i < 7; ++i){
  let img = new Image();
  img.src = `Images/Moon/moon${i + 1}.png`;
  
  moons.push(img);
}
moon.img = moons[moon_level]

function drawDino(){
  ctx.drawImage(dino.img, dino.x, dino.y, dino.w, dino.h);
}
function runDino(){
  if (++dino.step <= 5){
    dino.img = dinoRunStep1;
  }
  else {
    dino.img = dinoRunStep2;
  }
  
  if (dino.step == 10){
    dino.step = 0;
  }
}
function drawFloor(){
  ctx.drawImage(floor1.img, floor1.x, floor1.y, floor1.w, floor1.h);
  ctx.drawImage(floor2.img, floor2.x, floor2.y, floor2.w, floor2.h);
  
  floor1.x -= game.speed;
  floor2.x -= game.speed;
  
  if(floor1.x <= -floor1.w){
    floor1.x = 0;
    floor2.x = floor1.w;
  }
}
function drawClouds(){
  clouds.forEach(cloud => {
    ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.w, cloud.h);
    
    cloud.x -= game.speed - 3;
    
    if (cloud.x <= -cloud.w){
      cloud.x = canvas.width;
      cloud.y = [10, 50][Math.floor(Math.random() * 3)];
    }
  })
}
function drawCactuses(){
  if(game.framecount++ % 60 == 0 && (game.obstacle < .3 || game.score < 200)){
    let image = cactus_type[cactus_images[Math.floor(Math.random() * cactus_images.length)]];
    let extra_distances = [250, 300, 450, 650];
    let distance = extra_distances[Math.floor(
        Math.random() * 
          extra_distances.length
      )];
    
    if (image == "LargeCactus4" && game.score >= 100){
      image = "LargeCactus1"
    }
    cactuses.push({
      x: cactuses.length > 0 
        ? cactuses.at(-1).x + distance + (
          cactuses.at(-1).x + distance >= window.innerWidth 
            ? 0 
            : window.innerWidth
          )
        : window.innerWidth,
    
      img: image
    });
    
    game.x_new_cactus += 300;
  } 
  
  if (bird.x < window.innerWidth){
    return;
  }
  
  
  for (let i = 0; i < cactuses.length; i++) {
    let cactus = cactuses[i];
    if(cactus.img.src.includes("Large")){
      ctx.drawImage(cactus.img, cactus.x, 165, cactus.img.width / 2, 50);
      
      cactus.y = 165;
      
      cactus.w = cactus.img.width / 2;
      cactus.h = 50;
    } else {
      ctx.drawImage(cactus.img, cactus.x, 175, cactus.img.width / 2, 40);
      cactus.y = 175;
      
      cactus.w = cactus.img.width / 2;
      cactus.h = 40;
    }
    
    
    cactus.x -= game.speed;
    
    if (cactus.x + cactus.w < 0) {
      game.obstacle = Math.random();
      
      cactuses.splice(i--, 1);
    }
  }
}
function drawMountains(){
  if (game.framecount % 20 == 0) {
    mountains.push({
      x: canvas.width,
  
      img: mountain
    });
  }
  
  for (let i = 0; i < mountains.length; i++) {
    let mountain = mountains[i];
    
    ctx.drawImage(mountain.img, mountain.x, 60, window.innerWidth, 170);
  
    mountain.x -= game.speed - 1.5
    mountain.w = window.innerWidth;
  
    if (mountain.x + mountain.w < 0) {
      mountains.splice(i--, 1);
    }
  }
}
function drawStars(){
  stars.forEach(star => {
    ctx.drawImage(star.img, star.x, star.y, 10, 10);
  
    star.x--;
  
    if (star.x <= -10) {
      star.x = canvas.width + Math.random() * 100;
      star.y = Math.floor(Math.random() * 100) + 30;
      
      star.img = stars_img[Math.floor(Math.random() * stars_img.length)];
    }
  })
}
function drawMoon(){
  ctx.drawImage(moon.img, moon.x, moon.y, moon.img.width * .75, moon.img.height * .75);
  
  if (moon.x <= -moon.img.width){
    moon.x = window.innerWidth;
  } else {
    moon.x--;
  }
}
function drawBird(){
  if (game.obstacle < .3 || (cactuses.some(c => c.x < window.innerWidth) && bird.x >= window.innerWidth)){
    return;
  }
  
  let y;
  
  if(++bird.stepBird <= 10){
    bird.img = birdStep1;
    
    y = bird.y;
  } else {
    bird.img = birdStep2;
    y = bird.y2;
  }
  
  bird.top = y;
  
  ctx.drawImage(bird.img, bird.x, y, bird.w, bird.h);
  
  bird.x -= game.speed + 1.5;
  
  if (bird.x <= -bird.w){
    bird.x = canvas.width;
    game.obstacle = Math.random();
    
    let n = Math.floor(Math.random() * 2);
    bird.y = [40, 158][n];
    bird.y2 = [52, 170][n];
  }
  
  if (bird.stepBird == 20){
    bird.stepBird = 0;
  }
}
function start(){
  resetGame();
  
  window.removeEventListener("touchstart", start);
  window.addEventListener("touchstart", function(){
    if (dino.y >= dino.y_for_gravity && !dino.jump){
      jump();
    
      playSound("jump");
    }
  });
  
  game.started = true;
}
function resetGame(){
  dino.y = dino.y_for_gravity;
  dino.jump = false;
  
  mass = 1;
  vel = 8;
  
  cactuses = [];
  mountains = [];
  
  moon.img = moons[moon_level];
  
  for (let i = 0; i * 150 < window.innerWidth; ++i){
    mountains.push({
      x: i * 150,
    
      img: mountain
    })
  }
  
  game.x_new_cactus = 1000;
  
  game.gameOver = false;
  
  game.startedGameTime = Date.now();
  
  game.framecount = 1;
  game.score = 0;
  
  game.speed = 4;
  game.darkMode = false;
  
  game.score100 = false;
  game.fillStyleHighScore = "black";
  
  cactus_images = ["LargeCactus1", "SmallCactus1", "SmallCactus2"];
  
  bird.x = window.innerWidth;
  
  requestAnimationFrame(main);
}
function jump(){
  game.gameOver = false;
  dino.jump = true;
  
  let force = (1/2)*mass* (vel**2)
  
  dino.y -= force;//dino.vel_jump;
  
  vel--
  
  if (vel == 0){
    mass = -1;
  }
  
  dino.img = dinoJump;
  
  if (vel==-9/*dino.y >= dino.limit_jump*/){
    dino.jump = false;
    
    vel = 8;
    mass = 1;
  }
}
function gravity(){
  dino.y += dino.gravity;
  
  window.removeEventListener("touchstart", jump);
}
function main(){
  if (frames >= 100){
    frames = 0
  }
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.filter = "none"
  
  manageTheme()
  
  if (game.started && !dino.jump && dino.y >= dino.y_for_gravity){
    runDino();
  }
  if (!dino.img.src.includes("Start")){
    if (!game.normalGame){
      drawMountains();
    }
    
    drawFloor();
    drawCactuses();
    
    manageSpeed();
    
    if (!game.darkMode){
      drawClouds();
    } else {
      drawStars();
      drawMoon();
    }
    
    if (game.score >= 200){
      drawBird();
    }
    
    manageScore();
  }
  if (dino.jump && frames++ % 2 == 0){
    jump();
    
    dino.step = 0;
  }
  
  if (collisionBird()){
    gameOver();
  }
  
  cactuses.forEach(c => {
    if(c.x <= dino.w){
      if (collisionCactus(c)){
        gameOver();
      }
    }
  });
  if (dino.y < dino.y_for_gravity && !dino.jump){
    gravity();
  } else {
    window.addEventListener("touchstart", jump);
  }
  drawDino();
  
  if(!game.gameOver){
    requestAnimationFrame(main);
  }
}
function manageTheme(){
  if (game.darkMode) {
    
    ctx.fillStyle = "#222";
  
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    game.fillStyleHighScore = ctx.fillStyle
  } else if (game.afternoon){
    ctx.fillStyle = "#C46925";
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "black";
  } else {
    if (!game.normalGame){
    ctx.fillStyle = "cornflowerblue";
  
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "black";
    game.fillStyleHighScore = ctx.fillStyle
  
    if (game.score100 && game.score % 9 != 4){
      ctx.fillStyle = "transparent"
    }
    }
  }
}
function manageSpeed(){
  if (game.framecount % 500 == 0){
    game.speed += .25
  }
}
function gameOver(){
  navigator.vibrate(100);
  playSound("gameOver")
  
  dino.img = dinoDead;
  dino.img.onload = drawDino;
  
  game.gameOver = true;
  game.started = false;
  
  window.removeEventListener("touchstart", jump);
  window.addEventListener("touchstart", start);
  
  if (game.score > game.highScore){
    game.highScore = game.score;
  }
  drawGameOverIcons();
  /*
  if (game.darkMode){
    ctx.fillStyle = "white"
  } else {
    ctx.fillStyle = "black"
  }
  let score = "0".repeat(5 - game.score.toString().length) + game.score;
  
  ctx.clearRect(40, canvas.width -  100, 100, 50);
  ctx.fillText(`${score}`, canvas.width - 80, 30);*/
}
function drawGameOverIcons(){
  let message_game_over = new Image();
  message_game_over.src = "Images/Other/GameOver.png";
  
  message_game_over.onload = () => {
    ctx.drawImage(message_game_over, canvas.width / 2 - 125, 50, 250, 25);
  }
  
  let reset = new Image();
  reset.src = "Images/Other/Reset.png";
  
  reset.onload = () => {
    ctx.drawImage(reset, canvas.width / 2 - 25, 100, 50, 60);
  }
  
  if (game.score % 100 == 0){
    game.speed += 1;
  }
}
function manageScore(){
  if (game.score == 1400){
    cactus_images.push("LargeCactus5", "SmallCactus4");
  } else if (game.score == 100){
    cactus_images.push("LargeCactus2", "SmallCactus3")
  } else if (game.score == 400){
    cactus_images.push("LargeCactus4", "LargeCactus3")
  }
  
  game.score = Math.floor((Date.now() - game.startedGameTime) / 80);
  
  let score = "0".repeat(5 - game.score.toString().length) + game.score;
  let highScore = "0".repeat(5 - game.highScore.toString().length) + game.highScore;
  
  ctx.font = "15px Font";
  
  if (game.highScore != 0){
    ctx.fillText(`${score}`, canvas.width - 80, 30);
    
    ctx.fillStyle = game.fillStyleHighScore
    ctx.fillText(`${highScore} `, canvas.width - 170, 30);
    
    ctx.fillText("HI", canvas.width - 205, 30);
  } else {
    ctx.fillText(score, canvas.width - 100, 30);
  }
  
  if(game.score > 0){
    if (game.score % 700 == 0){
      game.darkMode = true;
      game.afternoon = false;
      
      game.lastScoreNight = game.score;
    } else if (game.lastScoreNight + 200 == game.score && game.darkMode){
      game.darkMode = false;
      game.afternoon = false;
      
      moon_level++;
      
      if (moon_level == moons.length){
        moon_level = 0
      }
      moon.img = moons[moon_level];
    }
    if (game.score % 100 == 0){
      score100();
    } else if (game.score % 120 == 0){
      game.score100 = false;
    }
  }
}
function score100(){
  playSound("score100");
  
 // game.score100 = true;
}
function collisionCactus(cactus){
  return dino.x + dino.w * .25 < cactus.x + cactus.w &&
    dino.x + dino.w * .25 + dino.w * .5 > cactus.x &&
    dino.y + dino.h * .25 < cactus.y + cactus.h &&
    dino.y + dino.h * .25 + dino.h * .5 > cactus.y;
}
function playSound(sound){
  let audio;
  
  if (sound == "jump"){
    audio = jump_audio;
  } else if (sound == "gameOver"){
    audio = gameOver_audio;
  } else if (sound == "score100"){
    audio = score100_audio;
  }
  
  audio.play()
}
function collisionBird(){
  return dino.x < bird.x + bird.w / 4 &&
      dino.x + dino.w - 20 > bird.x &&
      dino.y < bird.top + bird.h &&
      dino.y + dino.h - 20 > bird.top;
}

window.addEventListener("touchstart", start);
dino.img.onload = drawDino;