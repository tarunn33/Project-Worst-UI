// DOM Element References
const gameContainer = document.getElementById('game-container');
const sun = document.getElementById('sun');
const occluder = document.getElementById('occluder');
const cannon = document.getElementById('cannon');
const ball = document.getElementById('ball');
const aimUpBtn = document.getElementById('aim-up');
const aimDownBtn = document.getElementById('aim-down');

// Game State and Constants
let bodySize = Math.min(window.innerWidth, window.innerHeight) * 0.45;
const ballSize = 25;
const ballSpeed = 15;
const returnFactor = 0.004; // Increased return speed
let cannonAngle = 0; // In degrees
let isFiring = false;

// Position and Velocity Objects
let sunPos = { x: window.innerWidth / 2, y: (window.innerHeight / 2) + 50 };
let occluderPos = { x: window.innerWidth / 2, y: (window.innerHeight / 2) + 50 };
let ballPos = { x: 0, y: 0 };
let ballVel = { x: 0, y: 0 };

// --- INITIALIZATION ---
function setup() {
    // Set sizes of celestial bodies
    sun.style.width = `${bodySize}px`;
    sun.style.height = `${bodySize}px`;
    occluder.style.width = `${bodySize}px`;
    occluder.style.height = `${bodySize}px`;

    // Initial positioning
    updateElementPosition(occluder, occluderPos.x, occluderPos.y);
    updateCannon();

    // Handle window resizing
    window.addEventListener('resize', () => {
        bodySize = Math.min(window.innerWidth, window.innerHeight) * 0.45;
        sun.style.width = `${bodySize}px`;
        sun.style.height = `${bodySize}px`;
        occluder.style.width = `${bodySize}px`;
        occluder.style.height = `${bodySize}px`;
        sunPos = { x: window.innerWidth / 2, y: (window.innerHeight / 2) + 50 };
    });
}

// --- EVENT LISTENERS ---
cannon.addEventListener('click', fire);
aimUpBtn.addEventListener('click', (e) => { e.stopPropagation(); adjustAim(-5); });
aimDownBtn.addEventListener('click', (e) => { e.stopPropagation(); adjustAim(5); });

function adjustAim(angleChange) {
    cannonAngle += angleChange;
    // Clamp the angle to prevent it from going wild
    cannonAngle = Math.max(-60, Math.min(60, cannonAngle));
    updateCannon();
}

function updateCannon() {
     cannon.style.transform = `translateY(-50%) rotate(${cannonAngle}deg)`;
}

function fire() {
    if (isFiring) return; // Prevent firing multiple balls at once
    
    // Recoil animation
    cannon.style.transform = `translateY(-50%) rotate(${cannonAngle}deg) scaleX(0.95) translateX(-10px)`;
    setTimeout(() => {
        updateCannon(); // Reset to normal state
    }, 150);

    isFiring = true;
    ball.style.display = 'block';

    // Calculate muzzle position
    const cannonRect = cannon.getBoundingClientRect();
    const angleRad = cannonAngle * (Math.PI / 180);
    
    ballPos.x = cannonRect.left + cannonRect.width - (ballSize / 2);
    ballPos.y = cannonRect.top + cannonRect.height / 2 - (ballSize / 2);

    // Set ball velocity based on cannon angle
    ballVel.x = Math.cos(angleRad) * ballSpeed;
    ballVel.y = Math.sin(angleRad) * ballSpeed;
}

// --- GAME LOOP ---
function gameLoop() {
    // 1. Update positions
    if (isFiring) {
        ballPos.x += ballVel.x;
        ballPos.y += ballVel.y;
    }

    // 2. Occluder slowly returns to center
    const dxReturn = sunPos.x - occluderPos.x;
    const dyReturn = sunPos.y - occluderPos.y;
    occluderPos.x += dxReturn * returnFactor;
    occluderPos.y += dyReturn * returnFactor;

    // 3. Collision Detection
    const distBallOccluder = getDistance(ballPos.x + ballSize/2, ballPos.y + ballSize/2, occluderPos.x, occluderPos.y);
    if (isFiring && distBallOccluder < (bodySize / 2)) {
        // It's a hit!
        isFiring = false;
        ball.style.display = 'none';

        // Nudge the occluder
        const impactFactor = 3;
        occluderPos.x += ballVel.x * impactFactor;
        occluderPos.y += ballVel.y * impactFactor;
    }
    
    // Reset ball if it goes off-screen
    if (ballPos.x > window.innerWidth || ballPos.x < 0 || ballPos.y > window.innerHeight || ballPos.y < 0) {
         isFiring = false;
         ball.style.display = 'none';
    }

    // 4. Calculate Brightness
    const distSunOccluder = getDistance(sunPos.x, sunPos.y, occluderPos.x, occluderPos.y);
    const maxDist = bodySize / 2;
    const uncoveredRatio = Math.min(distSunOccluder / maxDist, 1);
    
    // Map the ratio to a brightness value (from dark gray to almost white)
    const minBrightness = 20;
    const maxBrightness = 220;
    const brightness = minBrightness + (maxBrightness - minBrightness) * uncoveredRatio;
    
    document.body.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
    sun.style.boxShadow = `0 0 ${10 + 40 * uncoveredRatio}px ${5 + 15 * uncoveredRatio}px rgba(255, 223, 0, 0.7)`;

    // 5. Render elements to the screen
    updateElementPosition(occluder, occluderPos.x, occluderPos.y);
    if (isFiring) {
        ball.style.left = `${ballPos.x}px`;
        ball.style.top = `${ballPos.y}px`;
    }
    sun.style.left = `${sunPos.x}px`;
    sun.style.top = `${sunPos.y}px`;

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// --- UTILITY FUNCTIONS ---
function updateElementPosition(el, x, y) {
    // Uses translate for smoother performance
    el.style.transform = `translate(-50%, -50%) translate(${x - window.innerWidth/2}px, ${y - window.innerHeight/2}px)`;
}

function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// --- START THE APP ---
setup();
gameLoop();

