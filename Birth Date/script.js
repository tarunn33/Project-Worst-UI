// JavaScript logic

// Global constants
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const dateDisplay = document.getElementById('current-date');

// Start date: January 1, 1900 (JS months are 0-indexed)
let currentDate = new Date(1900, 0, 1);

// Function to update the text display
function updateDisplay() {
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    dateDisplay.innerText = `${month} ${day}, ${year}`;
}

// Function for the "Day" buttons
// The 'amount' will be 1 for down (increase) and -1 for up (decrease)
function changeDay(amount) {
    currentDate.setDate(currentDate.getDate() + amount);
    updateDisplay();
}

// Function for the "Month" buttons
// The 'amount' will be 1 for down (increase) and -1 for up (decrease)
function changeMonth(amount) {
    currentDate.setMonth(currentDate.getMonth() + amount);
    updateDisplay();
}

// A final frustrating alert
function submitDate() {
    alert("Are you SURE you've selected the correct date? Please double-check.");
}

// Set the initial display on page load
// Using DOMContentLoaded is slightly more robust than window.onload
document.addEventListener('DOMContentLoaded', (event) => {
    updateDisplay();
});