let KEY_SPACE = false;
let KEY_UP = false;
let KEY_DOWN = false;
let KEY_LEFT = false;
let KEY_RIGHT = false;
let canvas;
let context;
let backgroundImage = new Image();
let restartImage = new Image();
let scoreCounter = 0;
let scoreText;
let highscoreText;
let lazer;
let gotLastBuzzard = false;
let interval_update;
let interval_updateShot;
let interval_createbuzzards;
let interval_checkForCollision;
let interval_checkForOutOfRange;
let interval_checkForShoot;
let highscore = localStorage.getItem('highscore') == null ? 0 : localStorage.getItem('highscore');

let  buzzards = [];

let  shots = [];

let buzzardData = {
    width: 212,
    height: 82,
    speed: 4,
    spawnSpeed: 3000
}

document.onkeydown = function(e) {
    switchKeyValue(e.keyCode, true);
}

document.onkeyup = function(e) {
    switchKeyValue(e.keyCode, false);
}

function switchKeyValue(keyCode, keyValue){
    switch(keyCode) {
        case 32:
            KEY_SPACE = keyValue;
            break;
        case 38:
            KEY_UP = keyValue;
            break;
        case 40:
            KEY_DOWN = keyValue;
            break;
        case 37:
            KEY_LEFT = keyValue;
            break;
        case 39:
            KEY_RIGHT = keyValue;
            break;
    }
}

function initComponents(){
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    context = canvas.getContext('2d');
    scoreText = document.getElementById('score');
    highscoreText = document.getElementById('highscore');
    createLazer();
    startGame();
}

function startGame() {
    loadImages();
    interval_update = setInterval(update, 1000 / 100);
    interval_updateShot = setInterval(updateShot, 1000 / 750);
    interval_createbuzzards = setInterval(createbuzzards, buzzardData.spawnSpeed);
    interval_checkForCollision = setInterval(checkForCollision, 1000 / 100);
    interval_checkForOutOfRange = setInterval(checkForOutOfRange, 1000 / 100);
    interval_checkForShoot = setInterval(checkForShoot, 1000 / 170 );
    draw();
    highscoreText.innerText = "Highscore: " + highscore;
}

function checkForCollision() {
    buzzards.forEach(function(buzzard) {
        if (lazer.x + lazer.width > buzzard.x
        && lazer.x < buzzard.x + buzzard.width
        && lazer.y < buzzard.y + buzzard.height
        && lazer.y + lazer.height > buzzard.y
        && !buzzard.hit){
            stopGame();
            lazer.hit = true;
            lazer.height = lazer.width;
            lazer.img.src = 'img/boom.png';
            setTimeout(() => {
                lazer.img.src = 'none'
            }, 750);
            buzzard.hit = true;
            buzzard.height = buzzard.width;
            buzzard.img.src = 'img/boom.png';
            setTimeout(() => {
                buzzards = [];
            }, 750);
        }

        shots.forEach(function(shot) {
            if (shot.x + shot.width >= buzzard.x
            && shot.y + shot.height >= buzzard.y
            && shot.x + shot.width <= buzzard.x + buzzard.width
            && shot.y + shot.height <= buzzard.y + buzzard.height
            && !buzzard.hit) {
                scoreCounter++;
                updateScore();
                buzzard.hit = true;
                buzzard.height = buzzard.width;
                buzzard.img.src = 'img/boom.png';
                console.log("test");
                gotLastBuzzard = true;
                setTimeout(() => {
                    buzzards = buzzards.filter(u => u != buzzard);
                    shots = shots.filter(u => u != shot);
                }, 750);
            }
            });
    });   
}

function checkForOutOfRange() {
    buzzards.forEach(function(buzzard) {
        if(buzzard.x + buzzard.width > 0){
            buzzard = buzzards.filter(u => u != buzzard);
        }
    });
    shots.forEach(function(shot){
        if(shot.y > canvas.width) shots = shots.filter(u => u != shot);
    });
}

function createLazer(){
    lazer = {
        x: 50,
        y: 243.5,
        hit: false,
        src: 'img/lazer.png',
        width: 209,
        height: 51
    }
}

function createbuzzards() {
    if(gotLastBuzzard) checkBuzzardData();

    let buzzard = {
        x: canvas.width + 1,
        y: Math.random() * 500, 
        width: buzzardData.width,
        height: buzzardData.height,
        src: 'img/buzzard.png',
        img: new Image(),
    };
    buzzard.img.src = buzzard.src;
    buzzards.push(buzzard);
    gotLastBuzzard = false;
}

function checkBuzzardData() {
    if(scoreCounter % 5 == 0 && scoreCounter != 0){
        buzzardData.width *= 1.025;
        buzzardData.height *= 1.025;
        buzzardData.speed *= 1.025;
        buzzardData.spawnSpeed *= 0.85;
        clearInterval(interval_createbuzzards);
        interval_createbuzzards = setInterval(createbuzzards, buzzardData.spawnSpeed);
    }
}

function checkForShoot() {
    if (!lazer.hit){
        if (KEY_SPACE) {
        let shot = {
            x: lazer.x + (lazer.width) * 0.83,
            y: lazer.y + 29,
            width: 37.5,
            height: 5,
            src: 'img/shot.png',
            img: new Image()
        };
        shot.img.src = shot.src;
        shots.push(shot);
        }   
    }
}

function update() {
    if (!lazer.hit){
        if (KEY_UP && lazer.y >= 0) {
            lazer.y -= 5; 
        }
        if (KEY_DOWN && lazer.y + lazer.height <= canvas.height) {
            lazer.y += 5; 
        }
        if (KEY_LEFT && lazer.x >= 0) {
            lazer.x -= 5; 
        }
        if (KEY_RIGHT && lazer.x + lazer.width <= canvas.width) {
            lazer.x += 5; 
        }
    }

    buzzards.forEach(function(buzzard){
        if (!buzzard.hit) {
        buzzard.x -= buzzardData.speed;   
        }
    });
}

function updateShot() {
    shots.forEach(function(shot) {
        shot.x += 30;  
    });
}


function loadImages() {
    backgroundImage.src = 'img/background.png';
    restartImage.src = 'img/restart.png';
    lazer.img = new Image();
    lazer.img.src = lazer.src;
}

function draw() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(lazer.img, lazer.x, lazer.y, lazer.width, lazer.height);

    buzzards.forEach(function(buzzard){
        context.drawImage(buzzard.img, buzzard.x, buzzard.y, buzzard.width, buzzard.height);
    });
    
    shots.forEach(function(shot){
        context.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
    });
    
    requestAnimationFrame(draw);
}

function updateScore(){
    scoreText.innerText = "Score: " + scoreCounter;
    if(scoreCounter > highscore){
        localStorage.setItem("highscore", scoreCounter);
        highscoreText.innerText = "Highscore: " + scoreCounter;
    }
}

function stopGame(){
    clearInterval(interval_update);
    clearInterval(interval_updateShot);
    clearInterval(interval_createbuzzards);
    clearInterval(interval_checkForCollision);
    clearInterval(interval_checkForOutOfRange)
    clearInterval(interval_checkForShoot);
    context.clearRect(0, 0, canvas.width, canvas.height);
    showRestartMenu();
}

function restartGame(){
    if(scoreCounter > 0) localStorage.setItem('highscore', scoreCounter);
    location.reload();
}

function showRestartMenu(){
    let upperBorder = document.getElementById("upperBorder");
    let restartButton = document.createElement("button");
    restartButton.setAttribute("id", "restartButton");
    restartButton.style.width = restartImage.width + "px";
    restartButton.style.height = restartImage.height + "px";
    restartButton.addEventListener("click", restartGame);
    restartButton.style.marginLeft = canvas.width / 2 - restartButton.width / 2 + "px";
    restartButton.style.marginTop = canvas.height / 2 + "px";
    let restartIMG = document.createElement("img");
    restartIMG.setAttribute("id", "restartIMG");
    restartIMG.src = restartImage.src;
    restartIMG.style.width = restartImage.width + "px";
    restartIMG.style.width = restartImage.width + "px";
    restartIMG.style.marginLeft = canvas.width / 2 - restartButton.width / 2 + "px";
    restartIMG.style.marginTop = canvas.height / 2 + "px";
    upperBorder.appendChild(restartIMG);
    upperBorder.appendChild(restartButton);
}
