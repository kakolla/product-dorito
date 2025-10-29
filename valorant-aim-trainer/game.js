// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again');
const target = document.getElementById('target');
const targetsHitEl = document.getElementById('targets-hit');
const totalTargetsEl = document.getElementById('total-targets');
const timerEl = document.getElementById('timer');
const avgTimeEl = document.getElementById('avg-time');
const accuracyEl = document.getElementById('accuracy');
const accuracyResultEl = document.getElementById('accuracy-result');
const totalHitsEl = document.getElementById('total-hits');
const scoresEl = document.getElementById('scores');
const highScoreEl = document.getElementById('high-score');
const loadingScreen = document.getElementById('loading-screen');
const menuOverlay = document.getElementById('menu-overlay');
const menuBtn = document.getElementById('menu-btn');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const quitBtn = document.getElementById('quit-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const resultDifficultyEl = document.getElementById('result-difficulty');
const gameMessageEl = document.getElementById('game-message');
const hitEffectEl = document.getElementById('hit-effect');

// Audio elements
const hitSound = document.getElementById('hit-sound');
const missSound = document.getElementById('miss-sound');
const completeSound = document.getElementById('complete-sound');

// Game variables
let targetsHit = 0;
let targetsMissed = 0;
let startTime;
let gameStartTime;
let reactionTimes = [];
let gameInterval;
let targetTimeout;
let gameActive = false;
let currentDifficulty = 'medium';
let highScores = {
    easy: parseFloat(localStorage.getItem('highScore_easy')) || 0,
    medium: parseFloat(localStorage.getItem('highScore_medium')) || 0,
    hard: parseFloat(localStorage.getItem('highScore_hard')) || 0
};

// Game settings
const GAME_SETTINGS = {
    easy: { targets: 10, timeLimit: 2000, size: 70, speed: 1.0 },
    medium: { targets: 15, timeLimit: 1500, size: 60, speed: 1.2 },
    hard: { targets: 25, timeLimit: 1000, size: 50, speed: 1.5 }
};

// Load pro player data
let proPlayers = [];

// Initialize game
function init() {
    // Simulate loading
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            startScreen.style.opacity = '1';
        }, 500);
    }, 2000);

    // Load pro players
    loadProPlayers();
    
    // Load high scores
    updateHighScoreDisplay();
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', resetGame);
    target.addEventListener('click', hitTarget);
    menuBtn.addEventListener('click', toggleMenu);
    resumeBtn.addEventListener('click', toggleMenu);
    restartBtn.addEventListener('click', restartGame);
    quitBtn.addEventListener('click', quitToMenu);
    
    // Difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
            totalTargetsEl.textContent = GAME_SETTINGS[currentDifficulty].targets;
        });
    });
    
    // Set default difficulty
    totalTargetsEl.textContent = GAME_SETTINGS.medium.targets;
}

async function loadProPlayers() {
    try {
        const response = await fetch('proPlayers.json');
        const data = await response.json();
        proPlayers = data.players;
    } catch (error) {
        console.error('Error loading pro player data:', error);
        // Use default data if loading fails
        proPlayers = [
            { name: 'TenZ', team: 'Sentinels', role: 'Duelist', avgReactionTime: 0.15, country: 'Canada', image: 'https://via.placeholder.com/100' },
            { name: 'Scream', team: 'Team Liquid', role: 'Duelist', avgReactionTime: 0.16, country: 'Belgium', image: 'https://via.placeholder.com/100' },
            { name: 'Derke', team: 'Fnatic', role: 'Duelist', avgReactionTime: 0.17, country: 'Finland', image: 'https://via.placeholder.com/100' },
            { name: 'yay', team: 'Optic Gaming', role: 'Duelist', avgReactionTime: 0.14, country: 'USA', image: 'https://via.placeholder.com/100' },
            { name: 'Zekken', team: 'Sentinels', role: 'Duelist', avgReactionTime: 0.18, country: 'USA', image: 'https://via.placeholder.com/100' }
        ];
    }
}

function updateHighScoreDisplay() {
    const highScore = highScores[currentDifficulty];
    highScoreEl.textContent = highScore > 0 ? highScore.toFixed(2) : '--.--';
}

// Start the game
function startGame() {
    const settings = GAME_SETTINGS[currentDifficulty];
    
    // Reset game state
    targetsHit = 0;
    targetsMissed = 0;
    reactionTimes = [];
    gameActive = true;
    
    // Update UI
    targetsHitEl.textContent = '0';
    totalTargetsEl.textContent = settings.targets;
    timerEl.textContent = '0.00';
    accuracyEl.textContent = '100%';
    
    // Set target size based on difficulty
    target.style.width = `${settings.size}px`;
    target.style.height = `${settings.size}px`;
    
    // Show game screen
    startScreen.classList.add('fade-out');
    setTimeout(() => {
        startScreen.classList.add('hidden');
        startScreen.classList.remove('fade-out');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('fade-in');
        setTimeout(() => gameScreen.classList.remove('fade-in'), 500);
        
        // Start the game
        gameStartTime = Date.now();
        showTarget();
    }, 500);
}

// Show a new target at a random position
function showTarget() {
    if (!gameActive) return;
    
    const gameRect = gameScreen.getBoundingClientRect();
    const targetSize = parseInt(target.style.width);
    const maxX = gameRect.width - targetSize - 20;
    const maxY = gameRect.height - targetSize - 20;
    
    // Ensure targets don't appear too close to the edges
    const x = 20 + Math.floor(Math.random() * maxX);
    const y = 20 + Math.floor(Math.random() * maxY);
    
    // Random scale for variety
    const scale = 0.8 + Math.random() * 0.4;
    
    // Apply transform for smooth movement
    target.style.transform = 'scale(0)';
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.display = 'flex';
    
    // Animate target appearance
    setTimeout(() => {
        target.style.transform = `scale(${scale})`;
        target.style.transition = 'transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    }, 10);
    
    startTime = Date.now();
    
    // Auto-hide target after time limit if not clicked
    clearTimeout(targetTimeout);
    targetTimeout = setTimeout(() => {
        if (target.style.display !== 'none') {
            missTarget();
        }
    }, GAME_SETTINGS[currentDifficulty].timeLimit);
}

// Handle target hit
function hitTarget(e) {
    if (!gameActive) return;
    e.stopPropagation();
    
    const reactionTime = (Date.now() - startTime) / 1000; // in seconds
    reactionTimes.push(reactionTime);
    
    // Play hit sound
    hitSound.currentTime = 0;
    hitSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Show hit effect
    showHitEffect(e.clientX, e.clientY);
    
    // Update UI
    targetsHit++;
    targetsHitEl.textContent = targetsHit;
    updateAccuracy();
    
    // Show reaction time with color coding
    const reactionTimeDisplay = reactionTime.toFixed(2);
    timerEl.textContent = reactionTimeDisplay;
    
    // Color code based on reaction time
    if (reactionTime < 0.3) {
        timerEl.style.color = '#4caf50'; // Green for very fast
    } else if (reactionTime < 0.5) {
        timerEl.style.color = '#8bc34a'; // Light green for fast
    } else if (reactionTime < 0.8) {
        timerEl.style.color = '#ffc107'; // Yellow for average
    } else {
        timerEl.style.color = '#f44336'; // Red for slow
    }
    
    // Hide target
    target.style.display = 'none';
    
    // Show next target or end game
    const settings = GAME_SETTINGS[currentDifficulty];
    if (targetsHit < settings.targets) {
        const delay = Math.max(200, 500 / settings.speed);
        setTimeout(showTarget, delay);
    } else {
        endGame();
    }
}

// Show hit effect at click position
function showHitEffect(x, y) {
    hitEffectEl.style.left = `${x - 50}px`;
    hitEffectEl.style.top = `${y - 50}px`;
    hitEffectEl.style.display = 'block';
    hitEffectEl.style.animation = 'none';
    hitEffectEl.offsetHeight; // Trigger reflow
    hitEffectEl.style.animation = 'hitEffect 0.6s forwards';
    
    // Show hit marker
    const hitMarker = document.createElement('div');
    hitMarker.className = 'hit-marker';
    hitMarker.style.left = `${x - 10}px`;
    hitMarker.style.top = `${y - 10}px`;
    document.body.appendChild(hitMarker);
    
    // Remove hit marker after animation
    setTimeout(() => {
        hitMarker.remove();
    }, 1000);
}

// Handle missed target
function missTarget() {
    if (!gameActive) return;
    
    targetsMissed++;
    updateAccuracy();
    
    // Play miss sound
    missSound.currentTime = 0;
    missSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Show miss message
    showMessage('MISS!', '#f44336');
    
    // Hide target
    target.style.display = 'none';
    
    // Show next target or end game
    const settings = GAME_SETTINGS[currentDifficulty];
    if (targetsHit < settings.targets) {
        const delay = Math.max(200, 500 / settings.speed);
        setTimeout(showTarget, delay);
    } else {
        endGame();
    }
}

// Update accuracy display
function updateAccuracy() {
    const totalShots = targetsHit + targetsMissed;
    const accuracy = totalShots > 0 ? (targetsHit / totalShots) * 100 : 100;
    accuracyEl.textContent = `${Math.round(accuracy)}%`;
    
    // Color code accuracy
    if (accuracy >= 90) {
        accuracyEl.style.color = '#4caf50'; // Green
    } else if (accuracy >= 70) {
        accuracyEl.style.color = '#ffc107'; // Yellow
    } else {
        accuracyEl.style.color = '#f44336'; // Red
    }
    
    return accuracy;
}

// Show game message
function showMessage(text, color = '#fff') {
    gameMessageEl.textContent = text;
    gameMessageEl.style.color = color;
    gameMessageEl.style.opacity = '1';
    gameMessageEl.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
        gameMessageEl.style.opacity = '0';
        gameMessageEl.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 1000);
}

// End the game and show results
function endGame() {
    gameActive = false;
    clearTimeout(targetTimeout);
    
    // Calculate stats
    const totalTime = (Date.now() - gameStartTime) / 1000;
    const avgTime = reactionTimes.length > 0 ? 
        reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 0;
    const accuracy = updateAccuracy();
    
    // Play complete sound
    completeSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Update result screen
    avgTimeEl.textContent = avgTime.toFixed(2);
    totalHitsEl.textContent = targetsHit;
    accuracyResultEl.textContent = `${Math.round(accuracy)}%`;
    resultDifficultyEl.textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    
    // Update high score if beaten
    if (avgTime > 0 && (highScores[currentDifficulty] === 0 || avgTime < highScores[currentDifficulty])) {
        highScores[currentDifficulty] = avgTime;
        localStorage.setItem(`highScore_${currentDifficulty}`, avgTime.toString());
        updateHighScoreDisplay();
        showMessage('NEW HIGH SCORE!', '#4caf50');
    }
    
    // Show result screen
    gameScreen.classList.add('fade-out');
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        gameScreen.classList.remove('fade-out');
        resultScreen.classList.remove('hidden');
        resultScreen.classList.add('fade-in');
        setTimeout(() => resultScreen.classList.remove('fade-in'), 500);
    }, 500);
    
    // Display leaderboard
    displayLeaderboard(avgTime);
}

// Display leaderboard with pro player comparison
function displayLeaderboard(playerTime) {
    // Sort pro players by reaction time
    const sortedPlayers = [...proPlayers]
        .filter(p => p.avgReactionTime)
        .sort((a, b) => a.avgReactionTime - b.avgReactionTime);
    
    // Add player to the leaderboard
    const playerEntry = {
        name: 'You',
        team: 'Your Best',
        avgReactionTime: playerTime,
        isPlayer: true
    };
    
    // Find the position to insert the player
    let playerPosition = sortedPlayers.findIndex(p => p.avgReactionTime > playerTime);
    if (playerPosition === -1) playerPosition = sortedPlayers.length;
    
    sortedPlayers.splice(playerPosition, 0, playerEntry);
    
    // Display the leaderboard (top 5 + player if not in top 5)
    scoresEl.innerHTML = '';
    const displayPlayers = [];
    
    // Add top 5 players
    const topPlayers = sortedPlayers.slice(0, 5);
    displayPlayers.push(...topPlayers);
    
    // Add player if not in top 5
    if (!topPlayers.includes(playerEntry) && playerPosition >= 5) {
        if (playerPosition > 5) {
            displayPlayers.push({ isSpacer: true });
        }
        displayPlayers.push(playerEntry);
    }
    
    // Create leaderboard items
    displayPlayers.forEach((player, index) => {
        if (player.isSpacer) {
            const spacer = document.createElement('div');
            spacer.className = 'leaderboard-spacer';
            spacer.innerHTML = '...';
            scoresEl.appendChild(spacer);
            return;
        }
        
        const playerEl = document.createElement('div');
        playerEl.className = `score-item ${player.isPlayer ? 'player' : ''}`;
        
        const rank = sortedPlayers.indexOf(player) + 1;
        const time = player.avgReactionTime.toFixed(2);
        const isTop3 = rank <= 3;
        
        playerEl.innerHTML = `
            <div class="player-info">
                <span class="rank">${rank}${getOrdinalSuffix(rank)}</span>
                ${player.image ? `<img src="${player.image}" alt="${player.name}" class="player-avatar">` : ''}
                <div class="player-details">
                    <span class="player-name">${player.name}</span>
                    ${player.team ? `<span class="player-team">${player.team}</span>` : ''}
                </div>
            </div>
            <div class="score-time">${time}s</div>
        `;
        
        scoresEl.appendChild(playerEl);
    });
}

// Helper function to get ordinal suffix
function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
}

// Toggle game menu
function toggleMenu() {
    if (menuOverlay.classList.contains('hidden')) {
        // Pause game
        gameActive = false;
        clearTimeout(targetTimeout);
        menuOverlay.classList.remove('hidden');
        menuOverlay.classList.add('fade-in');
        setTimeout(() => menuOverlay.classList.remove('fade-in'), 200);
    } else {
        // Resume game
        menuOverlay.classList.add('fade-out');
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
            menuOverlay.classList.remove('fade-out');
            gameActive = true;
            if (targetsHit < GAME_SETTINGS[currentDifficulty].targets) {
                showTarget();
            }
        }, 200);
    }
}

// Restart the current game
function restartGame() {
    toggleMenu();
    resetGameState();
    startGame();
}

// Quit to main menu
function quitToMenu() {
    toggleMenu();
    resetGameState();
    
    gameScreen.classList.add('fade-out');
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        gameScreen.classList.remove('fade-out');
        startScreen.classList.remove('hidden');
        startScreen.classList.add('fade-in');
        setTimeout(() => startScreen.classList.remove('fade-in'), 500);
    }, 500);
}

// Reset game state
function resetGameState() {
    targetsHit = 0;
    targetsMissed = 0;
    reactionTimes = [];
    clearTimeout(targetTimeout);
    target.style.display = 'none';
    gameMessageEl.textContent = '';
    gameMessageEl.style.opacity = '0';
}

// Reset the game to start screen
function resetGame() {
    resetGameState();
    
    resultScreen.classList.add('fade-out');
    setTimeout(() => {
        resultScreen.classList.add('hidden');
        resultScreen.classList.remove('fade-out');
        startScreen.classList.remove('hidden');
        startScreen.classList.add('fade-in');
        setTimeout(() => startScreen.classList.remove('fade-in'), 500);
    }, 500);
}

// Start the game when the page loads
window.onload = init;

// Handle clicks on the game screen (for misses)
gameScreen.addEventListener('click', (e) => {
    if (gameActive && e.target === gameScreen) {
        missSound.currentTime = 0;
        missSound.play().catch(e => console.log('Audio play failed:', e));
        showHitEffect(e.clientX, e.clientY);
        showMessage('MISS!', '#f44336');
        targetsMissed++;
        updateAccuracy();
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to toggle menu
    if (e.key === 'Escape' && !startScreen.classList.contains('hidden')) {
        toggleMenu();
    }
    // Space to start game from start screen
    else if (e.key === ' ' && !gameActive && startScreen.classList.contains('hidden') === false) {
        startGame();
    }
});
