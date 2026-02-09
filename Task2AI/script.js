// ========== DOM ELEMENT SELECTION ==========
// Using modern JavaScript methods to select all required elements
const arrow = document.getElementById('arrow');
const bowArrow = document.getElementById('bowArrow');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const bowContainer = document.getElementById('bowContainer');
const arrowCountDisplay = document.getElementById('arrowCount');
const scoreDisplayContainer = document.getElementById('scoreDisplay');
const gameArea = document.getElementById('gameArea');

// ========== GAME STATE VARIABLES ==========
let score = 0;
let timeLeft = 60; // 60 seconds game timer
let arrowsRemaining = 15;
let gameActive = true;
let gameOver = false;
let arrowMoving = false;
let isPulled = false;
let streak = 0; // Streak counter for consecutive hits
let maxStreak = 0; // Highest streak achieved

// Target movement state
let targetDirection = 1;
let targetTop = 100;
let targetSpeed = 5; // Will increase with difficulty
let targetSize = 150; // Will decrease with difficulty

// Bow and arrow state
let bowArrowY = 0; // Rotation angle
let arrowX = 0;
let arrowY = 0;
let velocityX = 0;
let velocityY = 0;
const GRAVITY = 0.3;
const ARROW_POWER = 15;
let arrowAngle = 0;

// References for intervals
let timerInterval = null;
let targetInterval = null;

// ========== TIMER FUNCTION ==========
function startTimer() {
    // Clear any existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Start countdown
    timerInterval = setInterval(() => {
        if (gameActive && timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            
            // Check if time is up
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    // Create or update timer display if it doesn't exist
    let timerElement = document.getElementById('timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.style.cssText = 'position: absolute; top: 10px; right: 20px; background: white; padding: 10px 20px; border-radius: 20px; font-size: 24px; font-weight: bold; z-index: 100;';
        document.body.appendChild(timerElement);
    }
    timerElement.textContent = `Time: ${timeLeft}s`;
}

// ========== SCORE UPDATE FUNCTION ==========
function updateScore(points) {
    // Calculate streak bonus
    const streakBonus = streak >= 2 ? streak * 5 : 0;
    const totalPoints = points + streakBonus;
    
    score += totalPoints;
    scoreDisplay.textContent = score;
    
    // Update streak display
    updateStreakDisplay();
    
    // Show bonus if applicable
    if (streakBonus > 0) {
        showStreakBonus(streakBonus);
    }
    
    // Increase difficulty every 50 points
    if (score > 0 && score % 50 === 0) {
        increaseDifficulty();
    }
}

function updateStreakDisplay() {
    let streakElement = document.getElementById('streakDisplay');
    if (!streakElement) {
        streakElement = document.createElement('div');
        streakElement.id = 'streakDisplay';
        streakElement.style.cssText = 'position: absolute; top: 60px; left: 50%; transform: translateX(-50%); background: rgba(255, 165, 0, 0.9); color: white; padding: 8px 20px; border-radius: 20px; font-size: 20px; font-weight: bold; z-index: 100;';
        document.body.appendChild(streakElement);
    }
    
    if (streak >= 2) {
        streakElement.textContent = `🔥 ${streak}x STREAK! +${streak * 5} bonus`;
        streakElement.style.display = 'block';
    } else {
        streakElement.style.display = 'none';
    }
}

function showStreakBonus(bonus) {
    const message = document.createElement('div');
    message.textContent = `STREAK BONUS! +${bonus}`;
    message.style.cssText = 'position: fixed; top: 30%; left: 50%; transform: translateX(-50%); background: rgba(255, 140, 0, 0.95); color: white; padding: 15px 30px; border-radius: 10px; font-size: 28px; font-weight: bold; z-index: 1000; animation: fadeOut 1.5s ease-out;';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 1500);
}

// ========== DIFFICULTY PROGRESSION FUNCTION ==========
function increaseDifficulty() {
    // Increase target speed
    targetSpeed = Math.min(targetSpeed + 2, 15); // Max speed of 15
    
    // Decrease target size (minimum 80px)
    if (targetSize > 80) {
        targetSize -= 15;
        target.style.width = targetSize + 'px';
        target.style.height = targetSize + 'px';
        
        // Update all ring sizes proportionally
        const rings = target.querySelectorAll('.ring');
        rings[0].style.width = targetSize + 'px';
        rings[0].style.height = targetSize + 'px';
        rings[1].style.width = (targetSize * 0.73) + 'px';
        rings[1].style.height = (targetSize * 0.73) + 'px';
        rings[2].style.width = (targetSize * 0.47) + 'px';
        rings[2].style.height = (targetSize * 0.47) + 'px';
        rings[3].style.width = (targetSize * 0.2) + 'px';
        rings[3].style.height = (targetSize * 0.2) + 'px';
    }
    
    // Visual feedback for difficulty increase
    showDifficultyMessage();
}

function showDifficultyMessage() {
    const message = document.createElement('div');
    message.textContent = 'DIFFICULTY INCREASED!';
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 0, 0, 0.9); color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; z-index: 1000; animation: fadeOut 2s ease-out;';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 2000);
}

// ========== TARGET MOVEMENT FUNCTION ==========
function moveTarget() {
    if (!gameActive || gameOver) return;
    
    targetTop += (targetSpeed * targetDirection);
    
    // Reverse direction at boundaries
    if (targetTop <= 50 || targetTop >= window.innerHeight - 250) {
        targetDirection *= -1;
    }
    
    target.style.top = targetTop + 'px';
}

// ========== ARROW SHOOTING FUNCTIONS ==========
function shootArrow() {
    if (arrowMoving || !gameActive || gameOver || arrowsRemaining <= 0) return;
    
    arrowMoving = true;
    arrowsRemaining--;
    updateArrowCount();
    
    // Calculate bow container's actual center position
    const bowCenterX = 80 + 30;
    const bowCenterY = window.innerHeight / 2;
    
    // Calculate arrow starting position from bow center
    const angleRad = (bowArrowY * Math.PI) / 180;
    const arrowOffsetX = 5 - 10;
    const arrowOffsetY = -290;
    
    // Apply rotation to get actual arrow position
    arrowX = bowCenterX + (arrowOffsetX * Math.cos(angleRad)) - (arrowOffsetY * Math.sin(angleRad));
    arrowY = bowCenterY + (arrowOffsetX * Math.sin(angleRad)) + (arrowOffsetY * Math.cos(angleRad));
    
    // Calculate initial velocity
    velocityX = Math.cos(angleRad) * ARROW_POWER;
    velocityY = Math.sin(angleRad) * ARROW_POWER;
    
    // Store arrow rotation angle
    arrowAngle = bowArrowY;
    
    // Show arrow and hide bow arrow
    arrow.style.display = 'block';
    arrow.style.left = arrowX + 'px';
    arrow.style.top = arrowY + 'px';
    arrow.style.transform = `rotate(${arrowAngle}deg)`;
    bowArrow.style.display = 'none';
    
    // Start animation
    moveArrow();
}

function moveArrow() {
    if (!arrowMoving) return;
    
    // Apply physics
    velocityY += GRAVITY;
    arrowX += velocityX;
    arrowY += velocityY;
    
    // Update arrow rotation based on velocity
    arrowAngle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
    
    // Update arrow position
    arrow.style.left = arrowX + 'px';
    arrow.style.top = arrowY + 'px';
    arrow.style.transform = `rotate(${arrowAngle}deg)`;
    
    // Check collision with target
    if (checkCollision()) {
        handleHit();
        return;
    }
    
    // Check if arrow is out of bounds
    if (arrowX > window.innerWidth || arrowY > window.innerHeight || arrowY < -100) {
        resetArrow(false); // Pass false to indicate it was a miss
        return;
    }
    
    // Continue animation
    requestAnimationFrame(moveArrow);
}

function handleHit() {
    // Increase streak
    streak++;
    if (streak > maxStreak) {
        maxStreak = streak;
    }
    
    // Calculate points based on hit position (closer to center = more points)
    const points = calculateHitPoints();
    updateScore(points);
    
    // Visual feedback on hit
    showHitMessage(points);
    
    resetArrow(true); // Pass true to indicate it was a hit
}

function calculateHitPoints() {
    const arrowRect = arrow.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    // Calculate distance from center
    const arrowCenterX = arrowRect.left + arrowRect.width / 2;
    const arrowCenterY = arrowRect.top + arrowRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(arrowCenterX - targetCenterX, 2) + 
        Math.pow(arrowCenterY - targetCenterY, 2)
    );
    
    // Award points based on distance (bullseye = 50, outer = 10)
    const radius = targetSize / 2;
    if (distance < radius * 0.2) return 50; // Yellow center
    if (distance < radius * 0.47) return 30; // Red ring
    if (distance < radius * 0.73) return 20; // Blue ring
    return 10; // Outer gold ring
}

function showHitMessage(points) {
    const message = document.createElement('div');
    message.textContent = `+${points}`;
    message.style.cssText = `position: fixed; left: ${arrowX}px; top: ${arrowY}px; color: gold; font-size: 32px; font-weight: bold; z-index: 1000; animation: floatUp 1s ease-out; pointer-events: none;`;
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 1000);
}

function checkCollision() {
    const arrowRect = arrow.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    return !(arrowRect.right < targetRect.left ||
             arrowRect.left > targetRect.right ||
             arrowRect.bottom < targetRect.top ||
             arrowRect.top > targetRect.bottom);
}

function resetArrow(wasHit = false) {
    arrowMoving = false;
    arrow.style.display = 'none';
    bowArrow.style.display = 'block';
    
    // Reset streak only if arrow missed
    if (!wasHit) {
        if (streak > 0) {
            showStreakLost();
        }
        streak = 0;
        updateStreakDisplay();
    }
    
    // Check if game should end due to no arrows
    if (arrowsRemaining <= 0 && gameActive) {
        setTimeout(() => endGame(), 500);
    }
}

function showStreakLost() {
    const message = document.createElement('div');
    message.textContent = 'STREAK LOST!';
    message.style.cssText = 'position: fixed; top: 30%; left: 50%; transform: translateX(-50%); background: rgba(255, 0, 0, 0.9); color: white; padding: 15px 30px; border-radius: 10px; font-size: 24px; font-weight: bold; z-index: 1000; animation: fadeOut 1s ease-out;';
    document.body.appendChild(message);
    
    setTimeout(() => message.remove(), 1000);
}

function updateArrowCount() {
    arrowCountDisplay.textContent = arrowsRemaining;
}

// ========== GAME END & RESTART FUNCTIONS ==========
function endGame() {
    gameActive = false;
    gameOver = true;
    
    // Stop all intervals
    if (timerInterval) clearInterval(timerInterval);
    if (targetInterval) clearInterval(targetInterval);
    
    // Show game over screen
    showGameOverScreen();
}

function showGameOverScreen() {
    const overlay = document.createElement('div');
    overlay.id = 'gameOverOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;';
    
    const gameOverBox = document.createElement('div');
    gameOverBox.style.cssText = 'background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px;';
    
    gameOverBox.innerHTML = `
        <h1 style="font-size: 48px; margin: 0 0 20px 0; color: #333;">GAME OVER!</h1>
        <p style="font-size: 32px; margin: 20px 0; color: #666;">Final Score: <span style="color: #4169E1; font-weight: bold;">${score}</span></p>
        <p style="font-size: 20px; margin: 10px 0; color: #ff8c00;">🔥 Max Streak: <span style="font-weight: bold;">${maxStreak}x</span></p>
        <p style="font-size: 18px; color: #888; margin: 20px 0;">${arrowsRemaining <= 0 ? 'Out of arrows!' : 'Time\'s up!'}</p>
        <button id="restartBtn" style="background: #4169E1; color: white; border: none; padding: 15px 40px; font-size: 24px; border-radius: 10px; cursor: pointer; margin-top: 20px;">
            Play Again
        </button>
    `;
    
    overlay.appendChild(gameOverBox);
    document.body.appendChild(overlay);
    
    // Add restart functionality
    document.getElementById('restartBtn').addEventListener('click', restartGame);
}

function restartGame() {
    // Remove game over overlay
    const overlay = document.getElementById('gameOverOverlay');
    if (overlay) overlay.remove();
    
    // Close menu if open
    const menu = document.getElementById('menuOverlay');
    if (menu) menu.remove();
    
    // Reset all game variables
    score = 0;
    timeLeft = 60;
    arrowsRemaining = 15;
    gameActive = true;
    gameOver = false;
    arrowMoving = false;
    isPulled = false;
    streak = 0;
    maxStreak = 0;
    
    // Reset difficulty
    targetSpeed = 5;
    targetSize = 150;
    target.style.width = targetSize + 'px';
    target.style.height = targetSize + 'px';
    
    // Reset ring sizes
    const rings = target.querySelectorAll('.ring');
    rings[0].style.width = '150px';
    rings[0].style.height = '150px';
    rings[1].style.width = '110px';
    rings[1].style.height = '110px';
    rings[2].style.width = '70px';
    rings[2].style.height = '70px';
    rings[3].style.width = '30px';
    rings[3].style.height = '30px';
    
    // Reset displays
    scoreDisplay.textContent = score;
    updateArrowCount();
    updateTimerDisplay();
    
    // Reset arrow
    arrow.style.display = 'none';
    bowArrow.style.display = 'block';
    
    // Restart game
    init();
}

// ========== EVENT HANDLING ==========
// Mouse movement for aiming
document.addEventListener('mousemove', (e) => {
    if (!arrowMoving && gameActive && !gameOver) {
        const mouseY = e.clientY;
        const bowContainerRect = bowContainer.getBoundingClientRect();
        const bowCenterY = bowContainerRect.top + bowContainerRect.height / 2;
        
        // Calculate rotation angle
        const deltaY = mouseY - bowCenterY;
        const angle = Math.max(-45, Math.min(45, deltaY / 3));
        
        // Rotate bow container
        bowContainer.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        bowArrowY = angle;
    }
});

// Mouse down to pull bowstring
document.addEventListener('mousedown', (e) => {
    if (!arrowMoving && gameActive && !gameOver) {
        isPulled = true;
        bowArrow.classList.add('pulled');
        
        // Curve the bowstring
        const stringLine = document.getElementById('stringLine');
        if (stringLine) {
            stringLine.outerHTML = '<path id="stringLine" d="M 5 10 Q -45 77.5 5 145" stroke="#333" stroke-width="2" fill="none"/>';
        }
    }
});

// Mouse up to shoot arrow
document.addEventListener('mouseup', (e) => {
    if (!arrowMoving && isPulled && gameActive && !gameOver) {
        isPulled = false;
        bowArrow.classList.remove('pulled');
        
        // Reset bowstring
        const stringLine = document.getElementById('stringLine');
        if (stringLine) {
            stringLine.outerHTML = '<line id="stringLine" x1="5" y1="10" x2="5" y2="145" stroke="#333" stroke-width="2"/>';
        }
        
        // Shoot the arrow
        shootArrow();
    }
});

// Settings button click to show menu
const settingsButton = document.getElementById('settingsIcon');
if (settingsButton) {
    settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
}

// ========== MENU FUNCTIONS ==========
function toggleMenu() {
    const existingMenu = document.getElementById('menuOverlay');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    showMenu();
}

function showMenu() {
    // Pause game
    const wasPaused = !gameActive;
    if (!gameOver) {
        gameActive = false;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000;';
    
    const menuBox = document.createElement('div');
    menuBox.style.cssText = 'background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px; min-width: 300px;';
    
    menuBox.innerHTML = `
        <h1 style="font-size: 42px; margin: 0 0 30px 0; color: #333;">⚙️ MENU</h1>
        <div style="margin: 20px 0; padding: 20px; background: #f0f0f0; border-radius: 10px;">
            <p style="font-size: 18px; margin: 10px 0; color: #666;">Score: <span style="font-weight: bold; color: #4169E1;">${score}</span></p>
            <p style="font-size: 18px; margin: 10px 0; color: #666;">Time Left: <span style="font-weight: bold;">${timeLeft}s</span></p>
            <p style="font-size: 18px; margin: 10px 0; color: #666;">Arrows: <span style="font-weight: bold;">${arrowsRemaining}</span></p>
            <p style="font-size: 18px; margin: 10px 0; color: #ff8c00;">🔥 Streak: <span style="font-weight: bold;">${streak}x</span></p>
        </div>
        <button id="resumeBtn" style="background: #4CAF50; color: white; border: none; padding: 12px 30px; font-size: 20px; border-radius: 10px; cursor: pointer; margin: 10px; width: 200px;">
            Resume Game
        </button>
        <button id="restartMenuBtn" style="background: #ff9800; color: white; border: none; padding: 12px 30px; font-size: 20px; border-radius: 10px; cursor: pointer; margin: 10px; width: 200px;">
            Restart Game
        </button>
    `;
    
    overlay.appendChild(menuBox);
    document.body.appendChild(overlay);
    
    // Add event listeners
    document.getElementById('resumeBtn').addEventListener('click', () => {
        overlay.remove();
        if (!wasPaused && !gameOver) {
            gameActive = true;
        }
    });
    
    document.getElementById('restartMenuBtn').addEventListener('click', () => {
        overlay.remove();
        restartGame();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (!wasPaused && !gameOver) {
                gameActive = true;
            }
        }
    });
}

// ========== GAME INITIALIZATION ==========
function init() {
    // Start timer
    startTimer();
    
    // Start target movement
    if (targetInterval) clearInterval(targetInterval);
    targetInterval = setInterval(moveTarget, 50);
    
    // Update initial displays
    updateTimerDisplay();
    updateArrowCount();
    
    console.log('Game initialized successfully!');
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translate(-50%, -60%); }
    }
    @keyframes floatUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-50px); }
    }
`;
document.head.appendChild(style);

// Start the game
init();
