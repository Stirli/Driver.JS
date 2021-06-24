const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    audio = new Audio('/audio/music1.m4a');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const settings = {
    start: false,
    score: 0,
    speed: 5,
    playerX: 0,
    playerY: 0,
    traffic: 3
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame() {
    start.classList.add('hide');
    settings.start = true;

    makeStrips();
    makeEnemies();
    makePlayer();

    startAudio();
    requestAnimationFrame(playGame);
}

function makePlayer() {
    car.classList.add("car");
    gameArea.appendChild(car);
    settings.playerX = car.offsetLeft;
    settings.playerY = car.offsetTop;
}

function movePlayer() {

    let inverseTurn = false;

    if (keys.ArrowUp && settings.playerY - settings.speed > 0) {
        settings.playerY -= settings.speed;
    }

    if (keys.ArrowDown && settings.playerY + settings.speed < gameArea.offsetHeight - car.offsetHeight) {
        settings.playerY += settings.speed + 1;
        inverseTurn = true;
    }

    let turnLeft = 'turn-' + (inverseTurn ? 'right' : 'left');
    let turnRight = 'turn-' + (inverseTurn ? 'left' : 'right');

    if (keys.ArrowLeft && settings.playerX - settings.speed > 0) {
        settings.playerX -= settings.speed + 1;
        if (!car.classList.contains(turnLeft)) {
            car.classList.add(turnLeft);
        }
    } else {
        car.classList.remove(turnLeft);
    }

    if (keys.ArrowRight && settings.playerX + settings.speed < gameArea.offsetWidth - car.offsetWidth) {
        settings.playerX += settings.speed + 1;
        car.classList.toggle(turnRight);
        if (!car.classList.contains(turnRight)) {
            car.classList.add(turnRight);
        }
    } else {
        car.classList.remove(turnRight);
    }




    car.style.left = settings.playerX + "px";
    car.style.top = settings.playerY + "px";
}

function makeEnemies() {
    settings.enemyArea = 100 * settings.traffic;
    let count = getElementQuantity(settings.enemyArea) + 1;
    settings.roadPartWidth = gameArea.offsetWidth / 3;
    for (let i = 0; i < count; i++) {
        let enemy = document.createElement('div');
        enemy.textContent = i;
        enemy.className = 'enemy';
        enemy.classList.add('enemy-debug');
        enemy.style.backgroundImage = `url(./image/enemy${getRandom(8,1)}.png)`;
        gameArea.appendChild(enemy);
        enemy.ry = settings.enemyArea * (i - 1) - gameArea.offsetHeight;
        enemy.x = getRandom(gameArea.offsetWidth - enemy.offsetWidth);

        enemy.style.top = enemy.ry + 'px';
        enemy.style.left = enemy.x + 'px';
    }
}

function moveEnemies() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy, num) => {
        enemy.ry += Math.round(settings.speed / 2);
        let dif = enemy.ry - gameArea.offsetHeight;
        if (dif >= 0) {
            let i = num + 1 < enemies.length ? num + 1 : 0;
            enemy.ry = enemies[i].ry - settings.enemyArea;
            enemy.x = getRandom(gameArea.offsetWidth - enemy.offsetWidth);
            enemy.style.backgroundImage = `url(./image/enemy${getRandom(8,1)}.png)`;
        }

        enemy.style.top = enemy.ry + 'px';
        enemy.style.left = enemy.x + 'px';
    });
}

function makeStrips() {
    let count = getElementQuantity(60) + 1;
    for (let i = 0; i < count; i++) {
        let strip = document.createElement('div');
        strip.className = 'strip';
        gameArea.appendChild(strip);
        strip.y = ((strip.offsetHeight + 10) * i);

        strip.style.top = strip.y + 'px';
    }
}

function moveStrips() {
    let strips = document.querySelectorAll('.strip');
    strips.forEach((strip, num) => {
        strip.y += settings.speed;
        let dif = strip.y - gameArea.offsetHeight;
        if (dif >= 0) {
            let i = num + 1 < strips.length ? num + 1 : 0;
            strip.y = strips[i].y - strip.offsetHeight - 10;
        }

        strip.style.top = strip.y + 'px';
    });
}

function playGame() {
    if (settings.start === true) {
        movePlayer();
        moveStrips();
        moveEnemies();

        requestAnimationFrame(playGame);
    }
}

function getElementQuantity(elementHeight) {
    return Math.round(gameArea.clientHeight / elementHeight);
}

function startRun(event) {
    if (!keys.hasOwnProperty(event.key)) {
        return;
    }

    event.preventDefault();
    keys[event.key] = true;
    console.log(event.key, keys[event.key]);
}

function stopRun(event) {
    if (!keys.hasOwnProperty(event.key)) {
        return;
    }

    event.preventDefault();
    keys[event.key] = false;
    console.log(event.key, keys[event.key]);
}

const getRandom = (max, min = 0) => Math.floor(Math.random() * (max - min) + min);

function test(testFunct, count, ...params) {
    console.time(testFunct.name + ' итераций:' + count);
    for (let index = 0; index < count; index++) {
        let i = testFunct(...params);
    }

    console.timeEnd(testFunct.name + ' итераций:' + count);
}

function startAudio() {
    audio.play();
}