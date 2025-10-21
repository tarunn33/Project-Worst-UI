document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const statusDisplay = document.getElementById('status');
    const submitBtn = document.getElementById('submitBtn');

    const GRID_SIZE = 10;
    const MINE_COUNT = 15;
    let board = [];
    let gameActive = true;
    let isButtonEvasive = false;

    // --- Irritating features from the old game ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playAnnoyingBeep() {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }

    submitBtn.addEventListener('mouseover', () => {
        if (isButtonEvasive) {
            const x = Math.random() * (window.innerWidth - submitBtn.offsetWidth);
            const y = Math.random() * (window.innerHeight - submitBtn.offsetHeight);
            submitBtn.style.position = 'absolute';
            submitBtn.style.left = `${x}px`;
            submitBtn.style.top = `${y}px`;
        }
    });
    // ---------------------------------------------

    function createBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        board = [];
        gameActive = true;
        statusDisplay.textContent = "Don't click the bombs!";
        submitBtn.disabled = true;

        // Create cells
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            gameBoard.appendChild(cell);

            board.push({
                index: i,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                element: cell
            });

            cell.addEventListener('click', () => handleLeftClick(board[i]));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(board[i]);
            });
        }

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < MINE_COUNT) {
            const randomIndex = Math.floor(Math.random() * board.length);
            if (!board[randomIndex].isMine) {
                board[randomIndex].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate adjacent mines
        board.forEach(cell => {
            if (!cell.isMine) {
                cell.adjacentMines = getNeighbors(cell.index).filter(n => n.isMine).length;
            }
        });
    }

    function getNeighbors(index) {
        const neighbors = [];
        const isLeftEdge = (index % GRID_SIZE === 0);
        const isRightEdge = (index % GRID_SIZE === GRID_SIZE - 1);

        const directions = [
            -GRID_SIZE - 1, -GRID_SIZE, -GRID_SIZE + 1,
            -1, 1,
            GRID_SIZE - 1, GRID_SIZE, GRID_SIZE + 1
        ];

        directions.forEach(dir => {
            const neighborIndex = index + dir;
            if (neighborIndex >= 0 && neighborIndex < board.length) {
                if (isLeftEdge && (dir === -GRID_SIZE - 1 || dir === -1 || dir === GRID_SIZE - 1)) return;
                if (isRightEdge && (dir === -GRID_SIZE + 1 || dir === 1 || dir === GRID_SIZE + 1)) return;
                neighbors.push(board[neighborIndex]);
            }
        });
        return neighbors;
    }

    function handleLeftClick(cell) {
        if (!gameActive || cell.isRevealed || cell.isFlagged) return;

        playAnnoyingBeep();

        if (cell.isMine) {
            gameOver(false);
            return;
        }

        revealCell(cell);
        checkWinCondition();
    }

    function handleRightClick(cell) {
        if (!gameActive || cell.isRevealed) return;
        cell.isFlagged = !cell.isFlagged;
        cell.element.textContent = cell.isFlagged ? '🚩' : '';
        cell.element.classList.toggle('flagged', cell.isFlagged);
    }
    
    function revealCell(cell) {
        if (cell.isRevealed) return;
        cell.isRevealed = true;
        cell.element.classList.add('revealed');

        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.dataset.mines = cell.adjacentMines;
        } else {
            // Flood fill for empty cells
            setTimeout(() => {
                getNeighbors(cell.index).forEach(neighbor => {
                    if (!neighbor.isRevealed && !neighbor.isFlagged) {
                        revealCell(neighbor);
                    }
                });
            }, 10);
        }
    }

    function checkWinCondition() {
        const revealedNonMines = board.filter(cell => cell.isRevealed && !cell.isMine).length;
        const totalNonMines = GRID_SIZE * GRID_SIZE - MINE_COUNT;
        if (revealedNonMines === totalNonMines) {
            gameOver(true);
        }
    }

    function gameOver(isWin) {
        gameActive = false;
        if (isWin) {
            statusDisplay.textContent = "YOU WON! Good luck clicking the button.";
            submitBtn.disabled = false;
            isButtonEvasive = true;
            setTimeout(() => {
                isButtonEvasive = false;
                statusDisplay.textContent = "It'll stay still now. Click it.";
                submitBtn.style.position = 'relative';
                submitBtn.style.left = '0';
                submitBtn.style.top = '0';
            }, 10000);
        } else {
            statusDisplay.textContent = "BOOM! You lose. Restarting...";
            board.forEach(cell => {
                if (cell.isMine) {
                    cell.element.classList.add('mine');
                    cell.element.textContent = '💣';
                }
            });
            setTimeout(createBoard, 2000);
        }
    }

    createBoard();
});

