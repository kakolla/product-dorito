// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again');
const target = document.getElementById('target');
const targetsHitEl = document.getElementById('targets-hit');
const timerEl = document.getElementById('timer');
const avgTimeEl = document.getElementById('avg-time');
const scoresEl = document.getElementById('scores');
const totalTargets = 10;

// Game variables
let targetsHit = 0;
let startTime;
let reactionTimes = [];
let gameInterval;

// Load pro player data
let proPlayers = [];

// Initialize game
function init() {
    fetch('proPlayers.json')
        .then(response => response.json())
        .then(data => {
            proPlayers = data.players;
        })
        .catch(error => {
            console.error('Error loading pro player data:', error);
            // Use default data if loading fails
            proPlayers = [
                { name: 'Pro Player 1', avgReactionTime: 0.15 },
                { name: 'Pro Player 2', avgReactionTime: 0.17 },
                { name: 'Pro Player 3', avgReactionTime: 0.19 }
            ];
        });

    // Event listeners
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);
    target.addEventListener('click', hitTarget);
}

// Start the game
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    targetsHit = 0;
    reactionTimes = [];
    targetsHitEl.textContent = '0';
    timerEl.textContent = '0.00';
    
    // Start the first target
    setTimeout(showTarget, 1000);
}

// Show a new target at a random position
function showTarget() {
    const gameRect = gameScreen.getBoundingClientRect();
    const maxX = gameRect.width - 50;
    const maxY = gameRect.height - 50;
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.display = 'block';
    
    startTime = Date.now();
    
    // Auto-hide target after 2 seconds if not clicked
    clearTimeout(gameInterval);
    gameInterval = setTimeout(() => {
        if (target.style.display !== 'none') {
            missTarget();
        }
    }, 2000);
}

// Handle target hit
function hitTarget() {
    const reactionTime = (Date.now() - startTime) / 1000; // in seconds
    reactionTimes.push(reactionTime);
    
    // Update UI
    targetsHit++;
    targetsHitEl.textContent = targetsHit;
    timerEl.textContent = reactionTime.toFixed(2);
    
    // Hide target
    target.style.display = 'none';
    
    // Show next target or end game
    if (targetsHit < totalTargets) {
        setTimeout(showTarget, 500);
    } else {
        endGame();
    }
}

// Handle missed target
function missTarget() {
    target.style.display = 'none';
    
    if (targetsHit < totalTargets) {
        setTimeout(showTarget, 500);
    } else {
        endGame();
    }
}

// End the game and show results
function endGame() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Calculate average reaction time
    const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    avgTimeEl.textContent = avgTime.toFixed(2);
    
    // Display leaderboard
    displayLeaderboard(avgTime);
}

// Display leaderboard with pro player comparison
function displayLeaderboard(playerTime) {
    scoresEl.innerHTML = '';
    
    // Add player's score
    const playerScore = document.createElement('div');
    playerScore.className = 'score-item';
    playerScore.innerHTML = `<span>You</span><span>${playerTime.toFixed(2)}s</span>`;
    playerScore.style.color = '#ff4655';
    playerScore.style.fontWeight = 'bold';
    scoresEl.appendChild(playerScore);
    
    // Add pro players' scores
    proPlayers.forEach(player => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `<span>${player.name} (${player.team || 'Pro'})</span><span>${player.avgReactionTime.toFixed(2)}s</span>`;
        scoresEl.appendChild(scoreItem);
    });
}

// Reset the game
function resetGame() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Start the game when the page loads
window.onload = init;
