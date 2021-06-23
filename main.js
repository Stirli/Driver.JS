const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
car.classList.add("car");

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
    traffic: 2.5
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame() {
    start.classList.add('hide');
    settings.start = true;

    makeStrips();
    makeEnemies();

    gameArea.appendChild(car);
    settings.playerX = car.offsetLeft;
    settings.playerY = car.offsetTop;


    requestAnimationFrame(playGame);
}

function makeEnemies() {
    settings.enemyArea = 100 * settings.traffic;
    let count = getElementQuantity(settings.enemyArea) + 1;
    settings.roadPartWidth = gameArea.offsetWidth / 3;
    for (let i = 0; i < count; i++) {
        let enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.backgroundImage = 'url(./alt-image/enemy.png)';
        gameArea.appendChild(enemy);
        enemy.ry = settings.enemyArea * (i - 1) - gameArea.offsetHeight;
        let part = Math.round(Math.random() * 2); // часть дороги по горизонтали: 0, 1 и 2
        enemy.x = part * settings.roadPartWidth + enemy.offsetWidth / 2;

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
            let part = Math.round(Math.random() * 2); // часть дороги по горизонтали: 0, 1 и 2
            enemy.x = part * settings.roadPartWidth + enemy.offsetWidth / 2;
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

        if (keys.ArrowLeft && settings.playerX - settings.speed > 0) {
            settings.playerX -= settings.speed + 1;
        }

        if (keys.ArrowRight && settings.playerX + settings.speed < gameArea.offsetWidth - car.offsetWidth) {
            settings.playerX += settings.speed + 1;
        }

        if (keys.ArrowUp && settings.playerY - settings.speed > 0) {
            settings.playerY -= settings.speed;
        }

        if (keys.ArrowDown && settings.playerY + settings.speed < gameArea.offsetHeight - car.offsetHeight) {
            settings.playerY += settings.speed + 1;
        }


        car.style.left = settings.playerX + "px";
        car.style.top = settings.playerY + "px";

        moveStrips();
        moveEnemies();

        requestAnimationFrame(playGame);
    }
}

function getElementQuantity(elementHeight) {
    return Math.round(gameArea.clientHeight / elementHeight);
}

function startRun(event) {
    if (keys[event.key] === undefined) {
        return;
    }

    event.preventDefault();
    keys[event.key] = true;
    console.log(event.key, keys[event.key]);
}

function stopRun(event) {
    if (keys[event.key] === undefined) {
        return;
    }

    event.preventDefault();
    keys[event.key] = false;
    console.log(event.key, keys[event.key]);
}