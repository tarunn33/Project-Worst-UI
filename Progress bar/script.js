// Get references to our elements
const bucket = document.getElementById('bucket');
const bucketWater = document.getElementById('bucket-water'); // Get the water div
const riverContainer = document.getElementById('river-container');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const fillHole = document.getElementById('fill-hole');

// --- State Variables ---
let isBucketFull = false;
let currentProgress = 0; // Progress in percentage
let hasWon = false; // Add a win state

// Constants for the "game" logic
const FILL_AMOUNT = 5; // How much % one bucket adds
const LEAK_RATE = 0.5; // <<< UPDATED: How much % to leak per interval

// --- Make the bucket follow the mouse ---
document.addEventListener('mousemove', (e) => {
    bucket.style.left = (e.pageX - 16) + 'px'; 
    bucket.style.top = (e.pageY - 16) + 'px';
});

// --- Click the *river* to fill the bucket ---
riverContainer.addEventListener('click', () => {
    if (!isBucketFull) {
        isBucketFull = true;
        bucketWater.style.height = '24px'; // Directly set the height
    }
});

// --- Click the *fill hole* to empty the bucket ---
fillHole.addEventListener('click', () => {
    if (isBucketFull) {
        isBucketFull = false;
        bucketWater.style.height = '0px'; // Directly set the height
        
        // Add progress (only if not already won)
        if (!hasWon) {
            currentProgress += FILL_AMOUNT;
            if (currentProgress > 100) {
                currentProgress = 100;
            }
            updateProgressBar();
        }
    }
});

// <<< UPDATED: Leak Logic with Visual Droplets >>>
setInterval(() => {
    // Only leak if progress is above 0 and the user hasn't won
    if (currentProgress > 0 && !hasWon) {
        
        // 1. Decrease the progress
        currentProgress -= LEAK_RATE;
        if (currentProgress < 0) {
            currentProgress = 0;
        }
        updateProgressBar();

        // 2. Create a visual droplet
        const droplet = document.createElement('div');
        droplet.classList.add('droplet');

        // Calculate a random position *within the filled part* of the bar
        const fillPercentage = currentProgress / 100;
        const containerWidth = progressContainer.offsetWidth;
        const filledWidth = containerWidth * fillPercentage;
        
        // Get a random position, but add a small offset from the edges
        const randomLeft = (Math.random() * (filledWidth - 10)) + 5; 
        
        droplet.style.left = randomLeft + 'px';
        
        progressContainer.appendChild(droplet);

        // 3. Remove the droplet from the DOM after it falls
        setTimeout(() => {
            if (droplet.parentNode) { // Check if it still exists
                 droplet.remove();
            }
        }, 1500); // 1500ms matches the animation duration
    }
}, 500); // A droplet leaks every 500ms (half a second)

// Helper function to update the bar's width
function updateProgressBar() {
    progressFill.style.width = currentProgress + '%';
    
    // Check for win condition
    if (currentProgress >= 100 && !hasWon) {
        hasWon = true; // Set win state
        currentProgress = 100; // Lock at 100
        progressFill.style.width = '100%'; // Ensure it's visually 100%
        document.querySelector('h2').innerText = 'Completed Successfully!';
        document.querySelector('p').innerText = 'You filled the progress bar with your hard work. Well done!';
    }
}