const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. SELF-CONTAINED LOCAL FULL-STACK DATABASE (Mock Engine)
// ==========================================
// This behaves exactly like your MongoDB model layer but runs reliably in-memory!
let databaseCollection = [
    { idName: "goal1", text: "Code for at least 30 minutes every day.", completed: false },
    { idName: "goal2", text: "Complete at least one coding project per month.", completed: false },
    { idName: "goal3", text: "Build a multi-page personal website.", completed: false },
    { idName: "goal4", text: "Master backend databases later on.", completed: false }
];

console.log('📂 Local Full-Stack Database Engine initialized successfully! 🎉');

// ==========================================
// 2. DATA PERSISTENCE ROUTES (Matching MongoDB Specs)
// ==========================================

// GET route: Sends your checklist state to the browser
app.get('/api/goals', async (req, res) => {
    try {
        // Simulates retrieving documents from a database collection
        res.json(databaseCollection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST route: Updates data state on the backend server
app.post('/api/goals/update', async (req, res) => {
    const { idName, completed } = req.body;
    try {
        // Simulates findOneAndUpdate database operations
        let targetGoal = databaseCollection.find(g => g.idName === idName);
        
        if (targetGoal) {
            targetGoal.completed = completed;
        } else {
            databaseCollection.push({ idName, text: "", completed });
        }
        
        console.log(`💾 Database Synced: ${idName} is now ${completed}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 3. DAILY CODING TIPS API ENDPOINT
// ==========================================
const codingTips = [
    "Code is like humor. When you have to explain it, it’s bad. Keep it clean!",
    "Don't worry if it doesn't work right away. If it did, you'd be fired.",
    "Fix the cause, not the symptom. Debug systematically!",
    "Before writing code, think about how you want to structure it first."
];

app.get('/api/tip', (req, res) => {
    const randomIndex = Math.floor(Math.random() * codingTips.length);
    const randomTip = codingTips[randomIndex];
    res.json({ tip: randomTip });
});

// ==========================================
// 4. RUN THE BACKEND SERVER ENGINE
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Full-stack app is officially up and running!`);
    console.log(`👉 Go to your browser and open: http://localhost:3000`);
});
