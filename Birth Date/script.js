// JavaScript logic

// --- GLOBAL CONSTANTS ---
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Array of frustrating messages for the submit button
const submitMessages = [
    "Processing... please wait.",
    "Are you *really* sure?",
    "Final check. This is permanent. Maybe.",
    "Error 404: Birthday not found. Please try again.",
    "Hmm, that doesn't look right. Click submit again to confirm.",
    "Date successfully... lost. Please re-select from 1900.",
    "Saving... Do not turn off your browser.",
    "Just one more click. I promise.",
    "Uploading your data to the mainframe... (which is a toaster).",
    "Confirmed! Your birthday is now January 1, 1900.",
    "Signature invalid. Please click submit again to re-sign."
];

// Define how many "tries" (submit clicks) are needed
const SUBMIT_THRESHOLD = 5; 

// --- GLOBAL STATE VARIABLES ---
let currentDate = new Date(1900, 0, 1);
let clickCount = 0; // Tracks date changes to enable submit
let submitClickCount = 0; // Tracks submit clicks for the final message

// --- DOM ELEMENTS (will be assigned on load) ---
let dateDisplay;
let submitButton;

// --- FUNCTIONS ---

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
    // We only care about the first 3 clicks
    if (clickCount < 3) {
        clickCount++; // Increment the "try" counter
        
        // Check if the user has reached the threshold
        if (clickCount >= 3) {
            submitButton.disabled = false; // Enable the button
            
            // Make it look enabled
            submitButton.style.cursor = 'pointer';
            submitButton.style.backgroundColor = '#4CAF50'; // A nice, inviting green
            submitButton.style.color = 'white';
            submitButton.innerText = "Submit (I'm enabled!)";
        }
    }
}

/**
 * Changes the day based on the inverted controls.
 * @param {number} amount - The amount to change the day by (-1 or 1).
 */
function changeDay(amount) {
    currentDate.setDate(currentDate.getDate() + amount);
    updateDisplay();
    registerClick(); // Register this click as a "try"
}

/**
 * Changes the month based on the inverted controls.
 * @param {number} amount - The amount to change the month by (-1 or 1).
 */
function changeMonth(amount) {
    currentDate.setMonth(currentDate.getMonth() + amount);
    updateDisplay();
    registerClick(); // Register this click as a "try"
}

/**
 * Called when the submit button is clicked.
 * Shows a random message *until* the threshold is met.
 */
function submitDate() {
    submitClickCount++; // Increment the submit "try" counter

    if (submitClickCount < SUBMIT_THRESHOLD) {
        // Not enough tries yet, show a random frustrating message
        const randomIndex = Math.floor(Math.random() * submitMessages.length);
        alert(submitMessages[randomIndex]);
    } else if (submitClickCount === SUBMIT_THRESHOLD) {
        // Reached the threshold! Show the final message.
        
        // Get the current date string directly from the display
        const finalDate = dateDisplay.innerText; 
        
        // Show the congratulatory alert
        alert(`Congratulations! 🥳\n\nAfter all that, your birth date has been successfully set to:\n\n${finalDate}`);
        
        // Final evil twist: disable the button again, permanently.
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
        submitButton.style.backgroundColor = '#C0C0C0'; // Back to dull gray
        submitButton.style.color = '#555';
        submitButton.innerText = "Set (Forever)";
    } else {
        // If they keep clicking the (now disabled) button
        alert("It's already set. You're done.");
    }
}

// --- PAGE INITIALIZATION ---

// Wait for the page to be fully loaded before running JS
document.addEventListener('DOMContentLoaded', (event) => {
    // Assign the DOM elements to our global variables
    dateDisplay = document.getElementById('current-date');
    submitButton = document.getElementById('submit-btn');

    // Ensure the button is disabled on page load
    submitButton.disabled = true; 
    
    // Set the initial date display
    updateDisplay();
});
