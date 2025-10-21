// JavaScript logic

// --- GLOBAL CONSTANTS ---
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const submitMessages = [
    "Processing... please wait.", "Are you *really* sure?",
    "Final check. This is permanent. Maybe.",
    "Error 404: Birthday not found. Please try again.",
    "Hmm, that doesn't look right. Click submit again to confirm.",
    "Date successfully... lost. Please re-select from 1900.",
    "Saving... Do not turn off your browser.", "Just one more click. I promise.",
    "Uploading your data to the mainframe... (which is a toaster).",
    "Confirmed! Your birthday is now January 1, 1900.",
    "Signature invalid. Please click submit again to re-sign."
];
const SUBMIT_THRESHOLD = 5; 
const CLICK_DELAY_MS = 500; // INCREASED delay
const RESET_CHANCE = 0.04; // INCREASED reset chance (4%)

// --- GLOBAL STATE VARIABLES ---
let currentDate = new Date(1900, 0, 1);
let clickCount = 0;
let submitClickCount = 0;

// --- DOM ELEMENTS (will be assigned on load) ---
let dateDisplay;
let submitButton;
let mainContainer;

// --- WORSENING FUNCTIONS ---

/**
 * Applies all the "worsening" effects on every click.
 */
function applyWorsening() {
    // 1. Debounce (disable buttons and set global wait cursor)
    document.body.classList.add('debouncing');
    
    // 2. Flicker Date
    dateDisplay.classList.add('flickering');

    setTimeout(() => {
        document.body.classList.remove('debouncing');
        dateDisplay.classList.remove('flickering');
    }, CLICK_DELAY_MS);

    // 3. Move Target
    const x = Math.random() * 40 - 20; // -20px to +20px
    const y = Math.random() * 40 - 20;
    mainContainer.style.left = x + 'px';
    mainContainer.style.top = y + 'px';

    // 4. Random Background Color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    document.body.style.backgroundColor = `rgb(${r},${g},${b})`;

    // 5. Random Reset (The most evil)
    if (Math.random() < RESET_CHANCE) {
        alert("CRITICAL ERROR! SESSION CORRUPTED. All progress lost. Please start again from 1900.");
        currentDate = new Date(1900, 0, 1);
        updateDisplay();
    }
}

// --- CORE FUNCTIONS ---

/**
 * Updates the date text on the screen.
 */
function updateDisplay() {
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    dateDisplay.innerText = `${month} ${day}, ${year}`;
}

/**
 * Tracks the user's clicks. After 3 clicks, it enables the submit button.
 */
function registerClick() {
    if (clickCount < 3) {
        clickCount++;
        if (clickCount >= 3) {
            submitButton.disabled = false;
            submitButton.style.cursor = 'pointer';
            submitButton.style.backgroundColor = '#4CAF50';
            submitButton.style.color = 'white';
            submitButton.innerText = "Submit (I'm enabled!)";
        }
    }
}

/**
 * Checks if the UI is currently debouncing.
 * @returns {boolean} True if clicks are disabled, false otherwise.
 */
function isDebouncing() {
    return document.body.classList.contains('debouncing');
}

/**
 * Changes the day based on the inverted controls.
 */
function changeDay(amount) {
    if (isDebouncing()) return; // Ignore click if debouncing
    currentDate.setDate(currentDate.getDate() + amount);
    updateDisplay();
    registerClick();
    applyWorsening(); // Apply all bad UI effects
}

/**
 * Changes the month based on the inverted controls.
 */
function changeMonth(amount) {
    if (isDebouncing()) return; // Ignore click if debouncing
    currentDate.setMonth(currentDate.getMonth() + amount);
    updateDisplay();
    registerClick();
    applyWorsening(); // Apply all bad UI effects
}

/**
 * Called when the submit button is clicked.
 */
function submitDate() {
    submitClickCount++;

    if (submitClickCount < SUBMIT_THRESHOLD) {
        const randomIndex = Math.floor(Math.random() * submitMessages.length);
        alert(submitMessages[randomIndex]);
    } else if (submitClickCount === SUBMIT_THRESHOLD) {
        const finalDate = dateDisplay.innerText; 
        alert(`Congratulations! 🥳\n\nAfter all that, your birth date has been successfully set to:\n\n${finalDate}`);
        
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
        submitButton.style.backgroundColor = '#C0C0C0';
        submitButton.style.color = '#555';
        submitButton.innerText = "Set (Forever)";
    } else {
        alert("It's already set. You're done.");
    }
}

// --- PAGE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', (event) => {
    dateDisplay = document.getElementById('current-date');
    submitButton = document.getElementById('submit-btn');
    mainContainer = document.getElementById('main-container');

    submitButton.disabled = true; 
    updateDisplay();
});
