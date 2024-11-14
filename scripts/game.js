//definiranje osnovih varijabli za kanvas
let canvas;
let canvasWidth = window.innerWidth - 6; //postavljam širinu kanvasa - uzimam u obzir 3px sa svake strane
let canvasHeight = window.innerHeight - 6; //postavljam  visinu kanvasa - uzimam u obzir 3px sa svake strane
let context;

//definiranje inicijalnog igraca (inicijalizacija palice)
let stickWidth = 100;
let stickHeight = 15;
let stickVelocity = 10;
let angle = Math.PI / 4 + Math.random() * (Math.PI / 2); //kut izmedju 45 i 135 stupnjeva

let stick = {
  x: canvasWidth / 2 - stickWidth / 2, //centriranje na dnu
  y: canvasHeight - 20, //iznad donjeg ruba
  width: stickWidth,
  height: stickHeight,
  velocityX: stickVelocity, //postavljanje brzine za kretanje u smjeru x osi
  color: "red",
};

//definiranje loptice
let ballRadius = 10;
let ballVelocityX = 5;
let ballVelocityY = 5;

let ball = {
  x: stick.x + stick.width / 2, //horizontalno centriranje
  y: stick.y - ballRadius - 10, //postavljanje iznad palice (border uzet u obzir)
  radius: ballRadius,
  velocityX: ballVelocityX * Math.cos(angle), //horizontalno ubrzanje ovisno o kutu
  velocityY: ballVelocityY * Math.sin(angle), //vertikalno ubrzanje ovisno o kutu
};

//definiranje cigli
let brickArray = []; //polje za spremanje cigli
let brickWidth = 85;
let brickHeight = 18;
let brickColumns = calculateBrickColumns(canvasWidth, 8); //izracunavam koliko stupaca ce mi stati na zaslon
let brickRows = 5;
let brickCount = 0;

//pocetak cigli -> gornji lijevi kut
let brickX = 10;
let brickY = 75;

//definiranje rezultata
let score = 0;

//definiranje varijable za kraj igre
let gameOver = false;

//dohvat zvukova
// Učitavanje zvukova
const collisionSound = new Audio("assets/sounds/collision.mp3");
const scoreSound = new Audio("assets/sounds/score.wav");
const gameOverSound = new Audio("assets/sounds/gameover.wav");
const startGameSound = new Audio("assets/sounds/gamestarted.wav");

//postavljanje velicine canvasa pri ucitavanju zaslona i definiranje konteksta
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext("2d");

  //postavljanje inicijalnog igraca (postavljanje palice)
  context.fillStyle = "#fdd149";
  context.fillRect(stick.x, stick.y, stick.width, stick.height);

  //animacijska petlja za kretanje palice i loptice
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveStick);

  //postavljanje inicijalnih cigli
  createBlicks();

  startGameSound.play();
};

//funkcija koja kreira animacijsku petlju koristeci requestAnimationFrame koji kontinuirano iscrtava palicu na zadanoj poziciji
function update() {
  requestAnimationFrame(update);

  //provjera je li kraj igrice
  if (gameOver) {
    saveBestScore(score);
    return; //kanvas se vise nece azurirati
  }

  //ocisti canvas prije novog iscrtavanja
  context.clearRect(0, 0, canvas.width, canvas.height);

  //nacrtaj palicu
  context.shadowColor = "rgba(0, 0, 0, 0.5)"; // boja sjenke
  context.shadowBlur = 10; // zamućenje sjenke
  context.shadowOffsetX = 0; // pomak sjenke po x-osi
  context.shadowOffsetY = 4; // pomak sjenke po y-osi
  context.fillStyle = stick.color;
  context.fillRect(stick.x, stick.y, stick.width, stick.height);
  //resetiranje postavki za sjencenje da se ne pojavljuju i na dr.elementima
  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  //nacrtaj lopticu
  context.beginPath();
  context.fillStyle = "black";
  ball.x = ball.x + ball.velocityX;
  ball.y = ball.y + ball.velocityY;
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();

  //odbijanje loptice od rub
  if (ball.y <= 0) {
    //ako loptica udari vrh kanvasa
    ball.velocityY = ball.velocityY * -1;
    collisionSound.play();
  } else if (ball.x <= 0 || ball.x + ball.radius >= canvasWidth) {
    //ako loptica udari lijevi ili desni rub kanvasa
    ball.velocityX = ball.velocityX * -1;
    collisionSound.play();
  } else if (ball.y + ball.radius >= canvasHeight) {
    //ako loptica udari dno kanvasa -> GAME OVER
    gameOver = true;
    context.font = "80px sans-serif";
    context.textAlign = "center"; //horizontalno poranvanje teksta
    context.textBaseline = "middle"; //vertikalno poravnanje teksta
    context.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2); //postavljanje teksta na sredinu ekrana
    gameOverSound.play();
  }

  //odbijanje loptice od palice
  if (topCollision(ball, stick) || bottomCollision(ball, stick)) {
    ball.velocityY = ball.velocityY * -1; //okrece Y smjer  kretanja
    collisionSound.play();
  } else if (leftCollision(ball, stick) || rightCollision(ball, stick)) {
    ball.velocityX = ball.velocityX * -1; // okrece X smjer kretanja
    collisionSound.play();
  }

  // Nacrtaj cigle
  for (let m = 0; m < brickArray.length; m++) {
    let brick = brickArray[m];
    if (!brick.broken) {
      // iscrtaj samo cigle koje nisu razbijene
      context.shadowColor = "rgba(0, 0, 0, 0.5)"; // boja sjenke
      context.shadowBlur = 10; // zamućenje sjenke
      context.shadowOffsetX = 0; // pomak sjenke po x-osi
      context.shadowOffsetY = 4; // pomak sjenke po y-osi
      context.fillStyle = "red";
      //provjeri kolizije
      if (topCollision(ball, brick) || bottomCollision(ball, brick)) {
        brick.broken = true;
        ball.velocityY = ball.velocityY * -1; //okrece Y smjer  kretanja
        brickCount = brickCount - 1;
        score += 1;
        scoreSound.play();
      } else if (leftCollision(ball, brick) || rightCollision(ball, brick)) {
        brick.broken = true;
        ball.velocityX = ball.velocityX * -1; //okrece X smjer  kretanja
        brickCount = brickCount - 1;
        score += 1;
        scoreSound.play();
      }
      context.fillRect(brick.x, brick.y, brick.width, brick.height);
      //resetiranje postavki za sjencenje da se ne pojavljuju i na dr.elementima
      context.shadowColor = "transparent";
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
    }
  }

  //provjera jesu li razbijene sve cigle
  if (brickCount == 0) {
    gameOver = true;
    context.font = "80px sans-serif";
    context.textAlign = "center"; //horizontalno poranvanje teksta
    context.textBaseline = "middle"; //vertikalno poravnanje teksta
    context.fillText("WELL DONE", canvasWidth / 2, canvasHeight / 2); //postavljanje teksta na sredinu ekrana
  }

  //prikaz rezultata - poravnanje s desnim rubom
  context.font = "25px sans-serif";
  context.textAlign = "right";
  context.fillText("Best score: " + getBestScore(), canvasWidth - 10, 30);
  context.fillText("Current score: " + score, canvasWidth - 10, 60);
}

//funkcija za kreiranje bloka cigli
function createBlicks() {
  brickArray = []; //ponovna inicijalizacija polja za cigle - brisanje
  for (let i = 0; i < brickColumns; i++) {
    for (let j = 0; j < brickRows; j++) {
      let brick = {
        x: brickX + i * brickWidth + i * 8, // 8 px za razmak izmedju stupaca
        y: brickY + j * brickHeight + j * 8, // 8 px za razmak izmedju redova cigli
        width: brickWidth,
        height: brickHeight,
        broken: false,
      };
      brickArray.push(brick);
    }
  }
  brickCount = brickArray.length;
}

//kretanje palice
function moveStick(e) {
  if (e.code == "ArrowLeft") {
    let newStickPosition = stick.x - stick.velocityX; //ulijevo -> oduzmi od trenutne pozicije
    if (!checkStickUutOfBounds(newStickPosition)) {
      stick.x = newStickPosition;
    }
  } else if (e.code == "ArrowRight") {
    let newStickPosition = stick.x + stick.velocityX; //udesno -> pribroji trenutnoj poziciji
    if (!checkStickUutOfBounds(newStickPosition)) {
      stick.x = newStickPosition;
    }
  }
}

//funkcija za odredjivanje broja stupaca cigli
function calculateBrickColumns(canvasWidth, gap) {
  let availableWidth = canvasWidth + gap; // ukupna dostupna sirina sa razmacima
  return Math.floor(availableWidth / (brickWidth + gap));
}

//provjera je li palica izvan granica
function checkStickUutOfBounds(x) {
  return x < 0 || x + stickWidth > canvasWidth;
}

//detektiranje kolizije za lopticu i palicu ili ciglu -> formula za udaljenost dviju tocaka
function colisionDetection(ball, stickOrBrick) {
  // pronadji najblizu tocku na pravokutniku(stickOrBrick) u odnosu na centar loptice
  let closestX = Math.max(
    stickOrBrick.x,
    Math.min(ball.x, stickOrBrick.x + stickOrBrick.width)
  );
  let closestY = Math.max(
    stickOrBrick.y,
    Math.min(ball.y, stickOrBrick.y + stickOrBrick.height)
  );

  //udaljenost od centra loptice do najblize tocke
  let distX = ball.x - closestX;
  let distY = ball.y - closestY;

  //vraca true ako je udaljenost manja ili jednaka radijusu
  return Math.sqrt(distX * distX + distY * distY) <= ball.radius;
}

//detektiranje gornje kolizije
function topCollision(ball, stickOrBrick) {
  return (
    colisionDetection(ball, stickOrBrick) &&
    ball.y - ball.radius <= stickOrBrick.y //loptica je iznad palice/cigle
  );
}

//detektiranje donje kolizije
function bottomCollision(ball, stickOrBrick) {
  return (
    colisionDetection(ball, stickOrBrick) &&
    ball.y + ball.radius >= stickOrBrick.y + stickOrBrick.height // loptica je ispod palice/cigle
  );
}

//detektiranje lijeve kolizije
function leftCollision(ball, stickOrBrick) {
  return (
    colisionDetection(ball, stickOrBrick) &&
    ball.x - ball.radius <= stickOrBrick.x // loptica je lijevo od palice/cigle
  );
}

//detektiranje desne kolizije
function rightCollision(ball, stickOrBrick) {
  return (
    colisionDetection(ball, stickOrBrick) &&
    ball.x + ball.radius >= stickOrBrick.x + stickOrBrick.width // loptica je desno od palice/cigle
  );
}

//funkcija za spremanje najboljeg rezultata u localStorage
function saveBestScore(score) {
  //dohvat trenutnog najboljeg rezultata
  let bestScore = localStorage.getItem("bestScore");

  //ako nema trenutno najboljeg rezultata ili ako je trenutni rezultat najbolji -> azuriraj najbolji rezultat
  if (bestScore === null || score > bestScore) {
    localStorage.setItem("bestScore", score);
  }
}

//dohvat trenutno najboljeg rezultata
function getBestScore() {
  let bestScore = localStorage.getItem("bestScore");
  return bestScore ? parseInt(bestScore) : 0; // Return the best score or 0 if not set
}
