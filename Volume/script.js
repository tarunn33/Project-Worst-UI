document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const gameArea = document.getElementById('game-area');
    const currentVolumeEl = document.getElementById('current-volume');
    const audioPlayer = document.getElementById('audio-player');
    const startButton = document.getElementById('start-button');
    const gameOverScreen = document.getElementById('game-over-screen');
    const tryAgainButton = document.getElementById('try-again-button');
    // The notification container will be grabbed by the function
    const notificationContainer = document.getElementById('notification-container');

    let gameInterval;
    let gameSpeed = 2; // Pixels to move per frame
    let isGameRunning = false;

    // --- GAME STATE FUNCTIONS ---

    function startGame() {
        gameArea.innerHTML = ''; 
        notificationContainer.innerHTML = ''; // Clear old notifications
        gameOverScreen.classList.add('hidden');
        startButton.disabled = true;
        startButton.textContent = 'Click the numbers!';

        isGameRunning = true;
        
        audioPlayer.play();
        setVolume(0); 

        gameInterval = setInterval(createDroppingElement, 1000); 
        requestAnimationFrame(gameLoop);
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval); 
        audioPlayer.pause();
        gameOverScreen.classList.remove('hidden'); 
        notificationContainer.innerHTML = ''; // Clear old notifications
    }

    // --- ELEMENT CREATION & HANDLING ---

    function createDroppingElement() {
        if (!isGameRunning) return;
        if (Math.random() < 0.2) {
            createBomb();
        } else {
            createNumber();
        }
    }

    function createNumber() {
        const numberEl = document.createElement('div');
        numberEl.classList.add('number');
        const numberValue = Math.floor(Math.random() * 101);
        numberEl.textContent = numberValue;
        numberEl.dataset.value = numberValue;
        numberEl.addEventListener('click', handleNumberClick);
        positionElement(numberEl);
        gameArea.appendChild(numberEl);
    }

    function createBomb() {
        const bombEl = document.createElement('div');
        bombEl.classList.add('bomb');
        bombEl.textContent = '💥'; 
        bombEl.addEventListener('click', handleBombClick);
        positionElement(bombEl);
        gameArea.appendChild(bombEl);
    }

    function positionElement(el) {
        const gameWidth = gameArea.clientWidth;
        el.style.left = `${Math.random() * (gameWidth - 50)}px`;
        el.style.top = '-50px';
    }

    // --- EVENT HANDLERS ---

    function handleNumberClick(event) {
        if (!isGameRunning) return; 

        const clickedEl = event.target;
        const clickedValue = parseInt(clickedEl.dataset.value, 10);

        clickedEl.removeEventListener('click', handleNumberClick);
        
        // Set the volume
        setVolume(clickedValue);

        // --- THIS IS THE NEW PART ---
        // Show the pop-up notification
        showNotification(`Volume set to ${clickedValue}`);
        // -----------------------------

        clickedEl.classList.add('clicked');
        setTimeout(() => {
            clickedEl.remove();
        }, 300);
    }

    function handleBombClick(event) {
        if (!isGameRunning) return; 
        event.target.textContent = '🔥';
        event.target.style.transform = 'scale(2)';
        endGame();
    }

    // --- CORE LOGIC ---

    function setVolume(value) {
        const volumeLevel = value / 100;
        audioPlayer.volume = volumeLevel;
        currentVolumeEl.textContent = value;
    }

    // --- NEW: FUNCTION TO SHOW POP-UP ---
    function showNotification(message) {
        const notif = document.createElement('div');
        notif.classList.add('notification');
        notif.textContent = message;
        
        notificationContainer.appendChild(notif);
        
        // Remove the notification element after its animation finishes (3 seconds)
        setTimeout(() => {
            notif.remove();
        }, 3000);
    }

    function gameLoop() {
        if (!isGameRunning) return; 

        document.querySelectorAll('.number, .bomb').forEach(element => {
            const currentTop = parseFloat(element.style.top);
            const newTop = currentTop + gameSpeed;
            element.style.top = `${newTop}px`;
            if (newTop > window.innerHeight) {
                element.remove();
            }
        });

        requestAnimationFrame(gameLoop); 
    }

    // --- INITIAL EVENT LISTENERS ---
    startButton.addEventListener('click', startGame);
    tryAgainButton.addEventListener('click', startGame); 
});