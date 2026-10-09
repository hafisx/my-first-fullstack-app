// ==========================================
// 1. DARK MODE TOGGLE (Local Storage Baseline)
// ==========================================
const themeButton = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeButton) themeButton.innerHTML = '☀️ Light Mode';
}

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeButton.innerHTML = '☀️ Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeButton.innerHTML = '🌙 Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==========================================
// 2. CHECKLIST WITH SERVER SYNCHRONIZATION
// ==========================================
const goalsList = document.getElementById('goals-list');

function loadSavedGoals() {
    fetch('/api/goals')
        .then(response => response.json())
        .then(savedGoals => {
            console.log("🟢 Live Backend Sync Data:", savedGoals);
            
            savedGoals.forEach(goal => {
                const checkbox = document.getElementById(goal.idName);
                if (checkbox) {
                    checkbox.checked = goal.completed;
                    const label = checkbox.nextElementSibling;
                    if (label) {
                        if (goal.completed) {
                            label.classList.add('completed-goal');
                        } else {
                            label.classList.remove('completed-goal');
                        }
                    }
                }
            });
        })
        .catch(err => console.error("❌ Pipeline Sync Error:", err));
}

// Run the data initialization routine as soon as the site opens
loadSavedGoals();

if (goalsList) {
    goalsList.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const checkbox = event.target;
            const label = checkbox.nextElementSibling;
            
            if (checkbox.checked) {
                if (label) label.classList.add('completed-goal');
            } else {
                if (label) label.classList.remove('completed-goal');
            }

            // FORWARD SYNC PIPELINE TO SERVER
            fetch('/api/goals/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idName: checkbox.id,
                    completed: checkbox.checked
                })
            })
            .then(response => response.json())
            .then(data => console.log('💾 Backend Sync Response:', data))
            .catch(error => console.error('❌ Sync Communication Error:', error));
        }
    });
}

// ==========================================
// 3. COUNTDOWN TIMER FEATURE
// ==========================================
const display = document.getElementById('timer-display');
const startBtn = document.getElementById('timer-start');
const pauseBtn = document.getElementById('timer-pause');
const resetBtn = document.getElementById('timer-reset');

let countdownInterval;
let totalSeconds = 30 * 60; 
let isRunning = false;

function updateDisplay() {
    if (display) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function startTimer() {
    if (isRunning) return; 
    isRunning = true;
    countdownInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            clearInterval(countdownInterval);
            isRunning = false;
            alert("Congratulations! You completed your 30 minutes of coding today! 🎉");
        }
    }, 1000); 
}

if (startBtn) startBtn.addEventListener('click', startTimer);
if (pauseBtn) { pauseBtn.addEventListener('click', () => { clearInterval(countdownInterval); isRunning = false; }); }
if (resetBtn) { resetBtn.addEventListener('click', () => { clearInterval(countdownInterval); isRunning = false; totalSeconds = 30 * 60; updateDisplay(); }); }

// ==========================================
// 4. DAILY MOTIVATION BACKEND FETCH
// ==========================================
const tipText = document.getElementById('tip-text');
const tipBtn = document.getElementById('get-tip-btn');

function fetchDailyTip() {
    fetch('/api/tip')
        .then(response => response.json())
        .then(data => {
            if (tipText) tipText.textContent = data.tip;
        })
        .catch(error => {
            console.error("Error fetching tip:", error);
        });
}

fetchDailyTip();
if (tipBtn) tipBtn.addEventListener('click', fetchDailyTip);
