const shaker = document.getElementById('shaker');
const popup = document.getElementById('popup');
const letterEl = document.getElementById('letter');
const equationEl = document.getElementById('equation');
const closeBtn = document.getElementById('close-btn');
const resetBtn = document.getElementById('reset-btn');
const roundSelectContainer = document.getElementById('round-select-container');
const roundSelect = document.getElementById('round-select');
const roundSelectText = document.getElementById('round-select-text');
const roundSelectDropdown = document.getElementById('round-select-dropdown');
const togglePanel = document.getElementById('toggle-panel');
const sidePanel = document.getElementById('side-panel');
const drawnBalls = document.getElementById('drawn-balls');

// Manage Equations Modal Elements
const manageEquationsBtn = document.getElementById('manage-equations-btn');
const manageEquationsModal = document.getElementById('manage-equations-modal');
const modalRoundSelect = document.getElementById('modal-round-select');
const letterTabs = document.querySelectorAll('.letter-tab');
const equationsList = document.getElementById('equations-list');
const newEquationInput = document.getElementById('new-equation-input');
const addEquationBtn = document.getElementById('add-equation-btn');
const clearRoundBtn = document.getElementById('clear-round-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const saveChangesBtn = document.getElementById('save-changes-btn');

let currentModalRound = 1;
let currentModalLetter = 'B';
let pendingChanges = [];

let drawnEquations = [];
const letters = ['B', 'I', 'N', 'G', 'O'];
let currentEquation = '';
let drawnEquationsPerRound = {1: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 2: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 3: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 4: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 5: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}};
let isShaking = false;
let ballReleaseContainer = null;
let completedRounds = new Set();

// Equations data - used by both game and Manage Equations modal
const equations = {
    1: {
        'B': ['1²', '√4', '5-2', '12 / 3', '√25', '15 - 9', '19 - 12', '2³', '21 - 12', '50 / 5', '16 - 5', '(3)(4)', '√169', '84 / 6', '9 + 6'],
        'I': ['4²', '20 - 3', '27 - 9', '76 / 4', '100 / 5', '14 + 7', '(11)(2)', '30-7', '16+8', '100/4', '20+6', '(9)(3)', '40-12', '18+11', '(15)(2)'],
        'N': ['124/4', '20+12', '(11)(3)', '50-16', '(7)(5)', '	6²', '74/2', '29+9', '(13)(3)', '60-20', '-10+51', '(21)(2)', '86/2', '30+14', '(9)(5)'],
        'G': ['70-24', '64-17', '(4)(12)', '7²', '100÷2', '30+21', '(13)(4)', '80-27', '(-6)(-9)', '-15+70', '	112/2', '(19)(3)', '90-32', '70+(-11)', '(-12)(-5)'],
        'O': ['122/2', '40+22', '(9)(7)', '(8)(8)', '80+(-15)', '(-11)(-6)', '134/2', '40+28', '(23)(3)', '100-30', '128-57', '(8)(9)', '90+(-17)', '148/2', '50+25']
    },
    2: {
        'B': ['-1+2', '7-5', '(-3)(-1)', '16/4', '7+(-2)', '9-3', '(7)(1)', '32/4', '20+(-11)', '30-20', '(-11)(-1)', '24/2', '20+(-7)', '64-50', '(-3)(-5)'],
        'I': ['96/6', '68+(-51)', '21-3', '8(2)+3', '100/5', '31+(-10)', '28-2²', '3³-4', '120/5', '19+6', '35-9', '3²(3)', '84/3', '12+17', '(5)(6)'],
        'N': ['30-(-1)', '25+7', '28+5', '5×6+4', '-35+70', '11+25', '50+(-13)', '40-2', '9×7+12', '6×6+4', '50-9', '32+10', '129÷3', '88÷2', '8×5+5'],
        'G': ['40+6', '50-3', '48÷6', '60-11', '(5)²+(5)²', '50÷2+26', '100÷2+2', '25+28', '(6)(9)', '25+28+1+1', '40+16', '(57)(1)', '50+48-40', '(60)(1)-1', '(10)(5)+5+5'],
        'O': ['(40)(2)-19', '100-38', '(9)(7)(2)-63', '(30)(2)+4', '100+(-35)', '(6)²+30', '(67)(2)-67', '(8)²+4', '√100+59', '(20)(3)+10', '11+50+10', '72÷9×9', '100+(-27)', '14+20+40', 'grade mo sa   math']
    },
    3: {
        'B': ['-5+6', '18-16', '(-9) ÷ (-3)', '(2)(2)', '-7+12', '20-14', '2² + 3', '(√25) + 3', '19 + (-10)', '2³ + 2', '16 - 5', '(2²)(3)', '2⁴ - 3', '87 - 73', '5² + (-10)'],
        'I': ['(2²)(2²)', '25 - 8', '72 ÷ 4', '	6 + 13', '(5)(2²)', '(4+3)(3)', '44 ÷ 2', '98 - 75', '(6)(2²)', '18 + 7', '46 - 20', '(3²)(3)', '17 + 11', '56 - 27', '	(10²) - 70'],
        'N': ['65+(-34)', '(2³)(2²)', '99÷3', '18+16', '45-10', '(√36)(6)', '26+11', '87-49', '(13)(3)', '(3³) + 13', '56-15', '(6)(7)', '(10)(4)+3', '220÷5', '29+16'],
        'G': ['97-51', '141/3', '(12)(2²)', '71+(-22)', '(5²)+(5²)', '78-27', '63+(-11)', '212/4', '(5²)(2)+4', '(6+5)(5)', '23+33', '88+31', '(29)(2)', '78+(-19)', '(15)(2²)'],
        'O': ['(7²)(2) - 37', '78-16', '(3²)(7)', '86-22', '(15)(4)+5', '(33)(2)', '88+(-21)', '(16)(3)+20', '(23)(3)', '(25)(2)+20', '97+(-26)', '144÷2', '67+6', '(8)(9)+2', '(15)(5)']
    },
    4: {
        'B': ['(-1)÷(-1)', '(-2)÷(-1)', '(-3)÷(-1)', '(4)÷(-1)', '(-5)÷(-1)', '16+(-10)', '17+(-10)', '18+(-10)', '19+(-10)', '20+(-10)', '44÷4', '48÷4', '52÷4', '56÷4', '60÷4'],
        'I': ['64/4', '68/4', '72/4', '76/4', '80/4', '(21)(2⁰)', '(11)(2¹)', '(23)(2⁰)', '(6)(2²)', '(25)(2⁰)', '(13)(2¹)', '(27)(2⁰)', '(7)(2²)', '(29)(2⁰)', '(15)(2¹)'],
        'N': ['(31)(1)', '(16)(2)', '(11)(3)', '(17)(2)', '(7)(5)', '(12)(3)', '(37)(1)', '(19)(2)', '(13)(3)', '(8)(5)', '(19)(2)+3', '(13)(3)+3', '(10)(4)+3', '(11)(4)', '(9)(5)'],
        'G': ['(11)(4)+2', '(11)(4)+3', '(12)(4)', '(12)(4)+1', '(12)(4)+2', '(8²)(1)-13', '(6²)(2)-20', '(8²)(1)-11', '(9²)(1)-27', '(11²)(1)-66', '(8²)(1)-10', '(7²)(2)-41', '(9²)(1)-23', '(8²)(2)-55', '(10²)(1)-40'],
        'O': ['(-61)(-1)', '(-31)(-2)', '(−21)(−3)', '(−16)(−4)', '(−13)(−5)', '(−11)(−6)', '(−67)(−1)', '(−34)(−2)', '(−23)(−3)', '(−14)(−5)', '(−71)(−1)', '(−36)(−2)', '(−73)(−1)', '(−37)(−2)', '(−25)(−3)']
    },
    5: {
        'B': ['(6x3)-17', '(10÷5) + 0', '(8+7)/5', '(12 ÷ 3) + 0', '(2+3) x 1', '(4x2)-2', '(10+4)-7', '(16÷2)+0', '(4+5)x1', '(15-5)x1', '(8+3)x1', '(6x2) +0', '(20-7)', '(7x2) + 0', '(10+5)'],
        'I': ['(8 x 2)', '(20-3)', '(12+6)', '(10+9)', '(5x4)', '(7x3)', '(11x2)', '(30-7)', '(6x4)', '(5x5)', '(20+6)', '(9x3)', '(4x7)', '(20+9)', '(6x5)'],
        'N': ['(25+6)', '(8x4)', '(30+3)', '(40-6)', '(5x7)', '(30+6)', '(40-3)', '(30+8)', '(50-11)', '(8x5)', '(35+6)', '(6x7)', '(50-7)', '(11x4)', '(40+5)'],
        'G': ['(50-4)', '(40+7)', '(6+8)', '(7x7)', '(25x2)', '(40+11)', '(4x13)', '(60-7)', '(6x9)', '(50+5)', '(7x8)', '(60-3)', '(50+8)', '(60-1)', '(6x10)'],
        'O': ['(50 + 11)', '(31 × 2)', '(9× 7)', '(8 × 8 )', '(60 + 5)', '(6 × 11 )', '(70− 3 )', '(60 + 8 )', '(70 − 1 )', '(7 × 10 )', '(60 + 11)', '(8 × 9)', '(80 −7)', '(70 +4)', '(100 - 25)']
    }
};

// Initialize ball release container
function initBallReleaseContainer() {
    if (!ballReleaseContainer) {
        ballReleaseContainer = document.createElement('div');
        ballReleaseContainer.id = 'ball-release-container';
        document.body.appendChild(ballReleaseContainer);
    }
}

// Check if a round is completed (all numbers drawn)
function isRoundCompleted(round) {
    if (!equations[round]) return false;
    return letters.every(letter => drawnEquationsPerRound[round][letter].length >= equations[round][letter].length);
}

// Update enabled/disabled state of round options
function updateRoundOptionsState() {
    const currentRound = parseInt(roundSelect.dataset.value || '0');
    const options = roundSelectDropdown.querySelectorAll('.round-option');
    
    options.forEach(option => {
        const optionValue = parseInt(option.dataset.value);
        
        // Skip "Select Round" option
        if (optionValue === 0) {
            option.classList.remove('disabled');
            return;
        }
        
        // If a round is selected, disable all other rounds
        if (currentRound !== 0) {
            if (optionValue !== currentRound) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        } else {
            // If no round selected, enable all except completed rounds
            if (completedRounds.has(optionValue)) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        }
        
        // Update selected state
        if (optionValue === currentRound) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Mark a round as completed
function markRoundCompleted(round) {
    completedRounds.add(round);
    updateRoundOptionsState();
    updateResetButtonState(); // Update button state after a round is completed
    
    // If current round is completed, reset to "Select Round"
    const currentRound = parseInt(roundSelect.dataset.value || '0');
    if (currentRound === round) {
        roundSelect.dataset.value = '0';
        roundSelectText.textContent = 'Select Round';
        updateRoundOptionsState();
    }
}

// Create particle effects
function createParticles(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = `particle ${Math.random() > 0.5 ? 'particle-gold' : 'particle-spark'}`;
        
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
        const distance = 50 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30;
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation: particleBurst ${0.4 + Math.random() * 0.3}s ease-out forwards;
            animation-delay: ${Math.random() * 0.1}s;
        `;
        
        ballReleaseContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
}

// Animate ball release from shaker
function animateBallRelease(letter, equation, callback) {
    initBallReleaseContainer();
    
    const shakerRect = shaker.getBoundingClientRect();
    const startX = shakerRect.left + shakerRect.width / 2 - 60;
    const startY = shakerRect.top - 10;
    
    // Add glow to shaker opening
    const shakerGlow = document.createElement('div');
    shakerGlow.className = 'shaker-glow';
    shaker.appendChild(shakerGlow);
    
    setTimeout(() => {
        if (shakerGlow.parentNode) {
            shakerGlow.parentNode.removeChild(shakerGlow);
        }
    }, 800);
    
    // Create particles at shaker opening
    createParticles(startX + 60, startY, 20);
    
    // Create the released ball
    const releasedBall = document.createElement('div');
    releasedBall.className = `released-ball bingo-${letter.toLowerCase()}`;
    releasedBall.innerHTML = `
        <div class="texture-overlay"></div>
        <div class="rim-light"></div>
        <div class="glossy-finish"></div>
        <div class="ball-letter" style="font-size: 40px; font-family: 'Titan One', sans-serif; font-weight: bold; color: white; text-shadow: 1px 1px 0px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.6), -1px -1px 1px rgba(0,0,0,0.3);">${letter}</div>
        <div class="ball-equation" style="font-size: 18px; font-family: 'Oswald', sans-serif; font-weight: 600; color: white; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 10px; padding: 5px 10px; margin-top: 5px; text-align: center;">${equation}</div>
    `;
    
    // Calculate center position relative to shaker
    const centerX = window.innerWidth / 2 - startX - 60;
    const centerY = window.innerHeight / 2 - startY - 60;
    
    releasedBall.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        --center-x: ${centerX}px;
        --center-y: ${centerY}px;
        animation: 
            ballReleaseSmooth 1.8s ease-out forwards,
            ballGlow 1.8s ease-out forwards;
    `;
    
    ballReleaseContainer.appendChild(releasedBall);
    
    // Create particles at shaker opening
    createParticles(startX + 60, startY, 20);
    
    // Create particles at center when ball arrives
    setTimeout(() => {
        const centerXAbs = window.innerWidth / 2 - 60;
        const centerYAbs = window.innerHeight / 2 - 60;
        createParticles(centerXAbs + 60, centerYAbs + 60, 15);
    }, 1500);
    
    // Show popup after ball reaches center
    setTimeout(() => {
        if (releasedBall.parentNode) {
            releasedBall.parentNode.removeChild(releasedBall);
        }
        if (callback) callback();
    }, 1500);
}
// Sound manager implementation using local assets
const soundManager = {
    shakingAudio: new Audio('assets/sounds/shakingg.mp3'),
    popupAudio: new Audio('assets/sounds/popup.mp3'),

    playShakerClick: () => {
        // Can be used for a small click sound if you add one later
    },
    playShakerShake: function() {
        this.shakingAudio.currentTime = 0;
        this.shakingAudio.play().catch(e => console.warn("Shaking sound failed:", e));
    },
    playPopupAppear: function() {
        this.popupAudio.currentTime = 0;
        this.popupAudio.play().catch(e => console.warn("Popup sound failed:", e));
    }
};

// Enhanced shaker click with better feedback
shaker.addEventListener('click', () => {
    if (isShaking) return;
    
    const currentRound = parseInt(roundSelect.dataset.value || '0');
    
    // Check if round is selected
    if (currentRound === 0) {
        showNotification('Please select round first!');
        return;
    }
    
    // Check if round is already completed
    if (completedRounds.has(currentRound)) {
        showNotification('This round is already completed!');
        return;
    }
    
    const allDone = letters.every(letter => drawnEquationsPerRound[currentRound][letter].length >= equations[currentRound][letter].length);
    
    if (allDone) {
        showNotification('All numbers drawn for this round!');
        markRoundCompleted(currentRound);
        return;
    }
    
    isShaking = true;
    soundManager.playShakerClick();
    
    setTimeout(() => {
        shaker.classList.add('shake');
        soundManager.playShakerShake();
        
        setTimeout(() => {
            shaker.classList.remove('shake');
            
            const availableLetters = letters.filter(l => drawnEquationsPerRound[currentRound][l].length < equations[currentRound][l].length);
            
            if (availableLetters.length === 0) {
                isShaking = false;
                return;
            }
            
            const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
            const eqList = equations[currentRound][letter];
            const availableEqs = eqList.filter(e => !drawnEquationsPerRound[currentRound][letter].includes(e));
            
            const equation = availableEqs[Math.floor(Math.random() * availableEqs.length)];
            drawnEquationsPerRound[currentRound][letter].push(equation);
            currentEquation = equation;
            letterEl.textContent = letter;
            equationEl.textContent = equation;
            
            const ball = document.getElementById('bingo-ball');
            ball.classList.forEach(cls => { if (cls.startsWith('bingo-')) ball.classList.remove(cls); });
            ball.classList.add(`bingo-${letter.toLowerCase()}`);
            
            if (!ball.querySelector('.texture-overlay')) {
                const texture = document.createElement('div');
                texture.className = 'texture-overlay';
                ball.appendChild(texture);
            }
            
            if (!ball.querySelector('.rim-light')) {
                const rimLight = document.createElement('div');
                rimLight.className = 'rim-light';
                ball.appendChild(rimLight);
            }
            
            if (!ball.querySelector('.glossy-finish')) {
                const glossy = document.createElement('div');
                glossy.className = 'glossy-finish';
                ball.appendChild(glossy);
            }
            
            // Play popup sound after shaking completes
            soundManager.playPopupAppear();
            
            // Animate ball release from shaker before showing popup
            animateBallRelease(letter, equation, () => {
                popup.classList.add('show');
            });
            
            drawnEquations.push({letter: letter, equation: equation});
            updateDrawnBalls();
            
            isShaking = false;
        }, 3000); // 3 seconds shake
    }, 500);
});

// Enhanced close button
closeBtn.addEventListener('click', () => {
    closePopup();
});

// Click outside to close
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        closePopup();
    }
});

// Function to close popup with animation
function closePopup() {
    const ball = document.getElementById('bingo-ball');
    ball.classList.forEach(cls => { if (cls.startsWith('bingo-')) ball.classList.remove(cls); });
    popup.classList.remove('show');
}

// Enhanced reset with confirmation
resetBtn.addEventListener('click', () => {    
    resetGame(); // Confirmation logic is now inside resetGame
});

function resetGame() {
    if (resetBtn.textContent === 'Reset Game') {
        // Full game reset scenario
        if (confirm('Are you sure you want to reset the entire game? All progress will be lost and all rounds will be re-enabled.')) {
            completedRounds.clear(); // Clear all completed rounds
            drawnEquations = []; // Clear global drawn equations display
            // Re-initialize drawnEquationsPerRound for all rounds
            drawnEquationsPerRound = {
                1: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 
                2: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 
                3: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 
                4: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}, 
                5: {'B': [], 'I': [], 'N': [], 'G': [], 'O': []}
            };
            roundSelect.dataset.value = '0';
            roundSelectText.textContent = 'Select Round';
            updateDrawnBalls();
            updateRoundOptionsState(); // Re-enable all rounds
            updateResetButtonState(); // Change button back to "Reset Round"
            showNotification('Game reset successfully!');
        }
    } else {
        // "Reset Round" logic (existing behavior, but refined)
        const currentSelectedRound = parseInt(roundSelect.dataset.value || '0'); 

        if (currentSelectedRound === 0) {
            showNotification('No round selected to reset.');
            return;
        }

        if (confirm(`Are you sure you want to reset Round ${currentSelectedRound}? It will be marked as completed and its drawn numbers will be cleared.`)) {
            // Mark the current round as completed/disabled
            completedRounds.add(currentSelectedRound);
            
            // Clear drawn equations for the specific round being reset
            drawnEquationsPerRound[currentSelectedRound] = {'B': [], 'I': [], 'N': [], 'G': [], 'O': []};
            
            // Clear the global display of drawn equations (assuming side panel shows current session's draws)
            drawnEquations = []; 
            
            roundSelect.dataset.value = '0'; // Reset selection to "Select Round"
            roundSelectText.textContent = 'Select Round';
            updateDrawnBalls(); // Update the side panel display
            updateRoundOptionsState(); // Update dropdown options (disable the just-completed round)
            updateResetButtonState(); // Update button text (might change to "Reset Game" if all rounds are now completed)
            showNotification(`Round ${currentSelectedRound} reset successfully!`);
        }
    }
}

// Toggle panel with smooth animation
togglePanel.addEventListener('click', () => {
    sidePanel.classList.toggle('open');
    togglePanel.classList.toggle('open');
    roundSelectContainer.classList.toggle('open');
    togglePanel.textContent = sidePanel.classList.contains('open') ? '◀' : '▶';
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (sidePanel.classList.contains('open') && !sidePanel.contains(e.target) && e.target !== togglePanel) {
        sidePanel.classList.remove('open');
        togglePanel.classList.remove('open');
        roundSelectContainer.classList.remove('open');
        togglePanel.textContent = '▶';
    }
});

// Update drawn balls with enhanced animation
function updateDrawnBalls() {
    drawnBalls.innerHTML = '';
    
    if (drawnEquations.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.cssText = `
            text-align: center;
            color: #800000;
            font-weight: 600;
            padding: 20px;
            font-size: 16px;
            margin-top: 50px;
        `;
        emptyMessage.textContent = 'No math equations drawn yet. Click the shaker to start!';
        drawnBalls.appendChild(emptyMessage);
        return;
    }
    
    drawnEquations.forEach((item, index) => {
        setTimeout(() => {
            const ball = document.createElement('div');
            ball.className = `bingo-ball bingo-${item.letter.toLowerCase()}`;
            ball.innerHTML = `<div class="texture-overlay"></div><div class="rim-light"></div><div class="glossy-finish"></div><div class="ball-letter">${item.letter}</div><div class="ball-equation">${item.equation}</div>`;
            drawnBalls.appendChild(ball);
            
            // Scroll to bottom to show latest ball
            drawnBalls.scrollTop = drawnBalls.scrollHeight;
        }, index * 50);
    });
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #800000;
        padding: 20px 40px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 18px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 10001;
        animation: notificationPop 0.5s ease;
        border: 3px solid #800000;
        font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationFade 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes notificationFade {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space or Enter to draw
    if (e.code === 'Space' || e.code === 'Enter') {
        if (!popup.classList.contains('show') && !isShaking) {
            e.preventDefault();
            shaker.click();
        }
    }
    
    // Escape to close popup
    if (e.code === 'Escape' && popup.classList.contains('show')) {
        closePopup();
    }
    
    // Escape to close dropdown
    if (e.code === 'Escape' && !roundSelectDropdown.classList.contains('hidden')) {
        roundSelectDropdown.classList.add('hidden');
        roundSelect.classList.remove('open');
    }
    
    // 'P' to toggle panel
    if (e.code === 'KeyP' && !popup.classList.contains('show')) {
        togglePanel.click();
    }
});

// Round change notification
roundSelect.addEventListener('click', () => {
    roundSelectDropdown.classList.toggle('hidden');
    roundSelect.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!roundSelectContainer.contains(e.target)) {
        roundSelectDropdown.classList.add('hidden');
        roundSelect.classList.remove('open');
    }
});

// Handle option selection
roundSelectDropdown.addEventListener('click', (e) => {
    const option = e.target.closest('.round-option');
    if (!option) return;
    
    if (option.classList.contains('disabled')) {
        return;
    }
    
    const selectedRound = parseInt(option.dataset.value);
    roundSelect.dataset.value = selectedRound;
    roundSelectText.textContent = option.textContent;
    
    if (selectedRound !== 0) {
        showNotification(`Switched to Round ${selectedRound}`);
    }
    
    updateRoundOptionsState();
    roundSelectDropdown.classList.add('hidden');
    roundSelect.classList.remove('open');
});

// Function to update the reset button text based on completed rounds
function updateResetButtonState() {
    const totalRounds = Object.keys(equations).length;
    if (completedRounds.size === totalRounds) {
        resetBtn.textContent = 'Reset Game';
    } else {
        resetBtn.textContent = 'Reset Round';
    }
}

// Initialize
updateDrawnBalls();
initBallReleaseContainer();
roundSelect.dataset.value = '0';
updateRoundOptionsState();
updateResetButtonState();

// ==================== MANAGE EQUATIONS MODAL ====================

// Open modal
manageEquationsBtn.addEventListener('click', () => {
    currentModalRound = parseInt(modalRoundSelect.value);
    currentModalLetter = 'B';
    pendingChanges = [];
    renderAllColumns();
    manageEquationsModal.classList.remove('hidden');
    setTimeout(() => manageEquationsModal.classList.add('show'), 10);
});

// Close modal
function closeModal() {
    manageEquationsModal.classList.remove('show');
    setTimeout(() => manageEquationsModal.classList.add('hidden'), 300);
}

cancelModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
manageEquationsModal.addEventListener('click', (e) => {
    if (e.target === manageEquationsModal) {
        closeModal();
    }
});

// Render all 5 columns (B, I, N, G, O)
function renderAllColumns() {
    const letterOrder = ['B', 'I', 'N', 'G', 'O'];
    
    letterOrder.forEach(letter => {
        const columnList = document.getElementById(`column-${letter}`);
        columnList.innerHTML = '';
        
        const eqs = equations[currentModalRound][letter] || [];
        
        eqs.forEach((eq, index) => {
            const item = document.createElement('div');
            item.className = 'col-equation-item';
            item.innerHTML = `
                <input type="text" value="${eq}" data-letter="${letter}" data-index="${index}">
                <div class="col-equation-actions">
                    <button class="col-update-btn" data-letter="${letter}" data-index="${index}">✓</button>
                    <button class="col-delete-btn" data-letter="${letter}" data-index="${index}">✕</button>
                </div>
            `;
            columnList.appendChild(item);
        });
    });
    
    // Add event listeners for update and delete buttons
    document.querySelectorAll('.col-update-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const letter = this.dataset.letter;
            const index = parseInt(this.dataset.index);
            const input = document.querySelector(`input[data-letter="${letter}"][data-index="${index}"]`);
            const newValue = input.value.trim();
            const currentValue = equations[currentModalRound][letter][index];
            
            if (newValue && newValue !== currentValue) {
                pendingChanges.push({
                    round: currentModalRound,
                    letter: letter,
                    index: index,
                    value: newValue,
                    type: 'update'
                });
                showNotification('Update queued');
            }
        });
    });
    
    document.querySelectorAll('.col-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const letter = this.dataset.letter;
            const index = parseInt(this.dataset.index);
            const columnList = document.getElementById(`column-${letter}`);
            const item = this.closest('.col-equation-item');
            
            pendingChanges.push({
                round: currentModalRound,
                letter: letter,
                index: index,
                type: 'delete'
            });
            
            item.remove();
            showNotification('Delete queued');
        });
    });
}

// Add equation from column input
document.querySelectorAll('.add-col-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const letter = this.dataset.letter;
        const input = document.querySelector(`input[data-letter="${letter}"]`);
        const newValue = input.value.trim();
        
        if (newValue) {
            pendingChanges.push({
                round: currentModalRound,
                letter: letter,
                value: newValue,
                type: 'add'
            });
            
            input.value = '';
            
            // Add to display immediately
            const columnList = document.getElementById(`column-${letter}`);
            const item = document.createElement('div');
            item.className = 'col-equation-item';
            const newIndex = (equations[currentModalRound][letter] || []).length;
            item.innerHTML = `
                <input type="text" value="${newValue}" data-letter="${letter}" data-index="${newIndex}">
                <div class="col-equation-actions">
                    <button class="col-update-btn" data-letter="${letter}" data-index="${newIndex}">✓</button>
                    <button class="col-delete-btn" data-letter="${letter}" data-index="${newIndex}">✕</button>
                </div>
            `;
            columnList.appendChild(item);
            
            // Re-attach event listeners
            const updateBtn = item.querySelector('.col-update-btn');
            const deleteBtn = item.querySelector('.col-delete-btn');
            const inputEl = item.querySelector('input');
            
            updateBtn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                const newVal = inputEl.value.trim();
                const currVal = equations[currentModalRound][letter][idx];
                if (newVal && newVal !== currVal) {
                    pendingChanges.push({
                        round: currentModalRound,
                        letter: letter,
                        index: idx,
                        value: newVal,
                        type: 'update'
                    });
                    showNotification('Update queued');
                }
            });
            
            deleteBtn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                pendingChanges.push({
                    round: currentModalRound,
                    letter: letter,
                    index: idx,
                    type: 'delete'
                });
                item.remove();
                showNotification('Delete queued');
            });
            
            showNotification('Add queued');
        }
    });
});

// Enter key for column inputs
document.querySelectorAll('.column-add-form input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const letter = input.dataset.letter;
            document.querySelector(`.add-col-btn[data-letter="${letter}"]`).click();
        }
    });
});

// Modal round select change
modalRoundSelect.addEventListener('change', () => {
    currentModalRound = parseInt(modalRoundSelect.value);
    renderAllColumns();
});

// Clear round
clearRoundBtn.addEventListener('click', () => {
    if (confirm(`Are you sure you want to clear all equations for Round ${currentModalRound}?`)) {
        pendingChanges.push({
            round: currentModalRound,
            type: 'clearRound'
        });
        renderAllColumns();
        showNotification('Clear round queued');
    }
});

// Save changes
saveChangesBtn.addEventListener('click', () => {
    if (pendingChanges.length === 0) {
        showNotification('No changes to save');
        closeModal();
        return;
    }
    
    // Show confirmation
    if (!confirm(`Are you sure you want to save ${pendingChanges.length} change(s)?`)) {
        return;
    }
    
    showNotification('Saving changes...');
    
    // Process pending changes
    pendingChanges.forEach(change => {
        if (change.type === 'clearRound') {
            equations[change.round] = {
                'B': [], 'I': [], 'N': [], 'G': [], 'O': []
            };
        } else if (change.type === 'add') {
            if (!equations[change.round][change.letter]) {
                equations[change.round][change.letter] = [];
            }
            equations[change.round][change.letter].push(change.value);
        } else if (change.type === 'update') {
            if (equations[change.round][change.letter]) {
                equations[change.round][change.letter][change.index] = change.value;
            }
        } else if (change.type === 'delete') {
            if (equations[change.round][change.letter]) {
                equations[change.round][change.letter].splice(change.index, 1);
            }
        }
    });
    
    pendingChanges = [];
    showNotification('Changes saved successfully!');
    closeModal();
});
