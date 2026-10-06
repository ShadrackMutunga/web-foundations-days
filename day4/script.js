// Select elements
const textarea = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// Function to update counters and classes
function updateCounts() {
    const text = textarea.value;
    const length = text.length;

    // Character count logic
    charCount.textContent = `${length} / 200 characters`;
    charCount.className = ''; // Reset classes
    
    if (length > 180) {
        charCount.classList.add('warning');
    }
    if (length > 200) {
        charCount.classList.add('over');
    }

    // Word count logic
    // Trim whitespace, then split by spaces. If empty string, count is 0.
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = `${words} words`;
}

// Function to save draft
function saveDraft() {
    localStorage.setItem('draft', textarea.value);
}

// Function to clear everything
function clearAll() {
    textarea.value = '';
    updateCounts();
    localStorage.removeItem('draft');
}

// Event Listeners
textarea.addEventListener('input', () => {
    updateCounts();
    saveDraft();
});

textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearAll();
    }
});

clearBtn.addEventListener('click', clearAll);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    // Update button text
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Initialization on page load
window.addEventListener('DOMContentLoaded', () => {
    // Restore draft
    const savedDraft = localStorage.getItem('draft');
    if (savedDraft) {
        textarea.value = savedDraft;
    }
    updateCounts();

    // Restore theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    }
});