const arrow = document.getElementById('arrow');
const target = document.getElementById('target');
const bow = document.getElementById('bow');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const arrowCountDisplay = document.getElementById('arrowCount');
const shootBtn = document.getElementById('shootBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverMsg = document.getElementById('gameOverMsg');
const finalScore = document.getElementById('finalScore');

let score = 0;
let time = 60;
let arrows = 15;
let gameOver = false;
let shooting = false;

let pos = 100;
let dir = 1;
let speed = 2;
let size = 100;

let bowY = 240;
let bowSpeed = 3;
let wPressed = false;
let sPressed = false;

let timer;
let targetTimer;

function startTimer() {
    timer = setInterval(function() {
        if (time > 0 && !gameOver) {
            time--;
            timerDisplay.textContent = time;
            
            if (time === 0) {
                endGame();
            }
        }
    }, 1000);
}

function moveTarget() {
    pos += speed * dir;
    
    if (pos <= 50) {
        dir = 1;
    } else if (pos >= 380) {
        dir = -1;
    }
    
    target.style.top = pos + 'px';
}

function updateScore() {
    score += 10;
    scoreDisplay.textContent = score;
    
    if (score % 50 === 0) {
        increaseDifficulty();
    }
}

function increaseDifficulty() {
    speed += 1;
    size -= 10;
    
    if (size < 50) {
        size = 50;
    }
    
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    
    let gameArea = document.getElementById('gameArea');
    let colors = ['linear-gradient(to bottom, #87CEEB 0%, #90EE90 100%)', 
                  'linear-gradient(to bottom, #FFB6C1 0%, #90EE90 100%)', 
                  'linear-gradient(to bottom, #DDA0DD 0%, #90EE90 100%)',
                  'linear-gradient(to bottom, #F0E68C 0%, #90EE90 100%)'];
    let colorIndex = Math.floor(score / 50) % colors.length;
    gameArea.style.background = colors[colorIndex];
    
    showMessage('Difficulty Increased!');
}

function showMessage(text) {
    let msg = document.createElement('div');
    msg.textContent = text;
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(255, 0, 0, 0.9)';
    msg.style.color = 'white';
    msg.style.padding = '20px 40px';
    msg.style.fontSize = '30px';
    msg.style.fontWeight = 'bold';
    msg.style.borderRadius = '10px';
    msg.style.zIndex = '100';
    document.body.appendChild(msg);
    
    setTimeout(function() {
        document.body.removeChild(msg);
    }, 1500);
}

function shootArrow() {
    if (arrows > 0 && !shooting && !gameOver) {
        shooting = true;
        arrow.style.display = 'block';
        arrow.style.top = bowY + 'px';
        
        arrows--;
        arrowCountDisplay.textContent = arrows;
        
        let left = 80;
        
        let moveArrow = setInterval(function() {
            left += 10;
            arrow.style.left = left + 'px';
            
            if (checkCollision()) {
                clearInterval(moveArrow);
                updateScore();
                resetArrow();
            }
            
            if (left > 900) {
                clearInterval(moveArrow);
                resetArrow();
            }
        }, 20);
        
        if (arrows === 0) {
            setTimeout(function() {
                if (!gameOver) {
                    endGame();
                }
            }, 2000);
        }
    }
}

function checkCollision() {
    let arrowRect = arrow.getBoundingClientRect();
    let targetRect = target.getBoundingClientRect();
    
    return !(arrowRect.right < targetRect.left || 
             arrowRect.left > targetRect.right || 
             arrowRect.bottom < targetRect.top || 
             arrowRect.top > targetRect.bottom);
}

function resetArrow() {
    shooting = false;
    arrow.style.display = 'none';
    arrow.style.left = '80px';
}

function endGame() {
    gameOver = true;
    clearInterval(timer);
    clearInterval(targetTimer);
    
    finalScore.textContent = score;
    gameOverMsg.style.display = 'block';
    shootBtn.style.display = 'none';
    restartBtn.style.display = 'block';
}

function restartGame() {
    score = 0;
    time = 60;
    arrows = 15;
    gameOver = false;
    shooting = false;
    pos = 100;
    dir = 1;
    speed = 2;
    size = 100;
    bowY = 240;
    bow.style.top = bowY + 'px';
    
    let gameArea = document.getElementById('gameArea');
    gameArea.style.background = 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 100%)';
    
    scoreDisplay.textContent = score;
    timerDisplay.textContent = time;
    arrowCountDisplay.textContent = arrows;
    target.style.width = size + 'px';
    target.style.height = size + 'px';
    target.style.top = pos + 'px';
    
    gameOverMsg.style.display = 'none';
    shootBtn.style.display = 'block';
    restartBtn.style.display = 'none';
    resetArrow();
    
    startTimer();
    targetTimer = setInterval(moveTarget, 30);
}

function moveBow() {
    if (wPressed && bowY > 50) {
        bowY -= bowSpeed;
        bow.style.top = bowY + 'px';
    }
    if (sPressed && bowY < 430) {
        bowY += bowSpeed;
        bow.style.top = bowY + 'px';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'w' || e.key === 'W') {
        wPressed = true;
    } else if (e.key === 's' || e.key === 'S') {
        sPressed = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'w' || e.key === 'W') {
        wPressed = false;
    } else if (e.key === 's' || e.key === 'S') {
        sPressed = false;
    }
});

shootBtn.addEventListener('click', shootArrow);
restartBtn.addEventListener('click', restartGame);

startTimer();
targetTimer = setInterval(moveTarget, 30);
setInterval(moveBow, 20);
