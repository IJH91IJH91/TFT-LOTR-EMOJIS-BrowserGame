// gameBoard.js - Handles shop, bench, battlefield, and placement logic

// Game state variables
let gold = 50;
let draggedUnit = null;
let draggedParent = null;
const GRID_SIZE = 8;

// Initialize the game board
function initGameBoard() {
    createBattlefield();
    setupShop();
    placeEnemyUnits();
    updateGoldDisplay();
    setupEventListeners();
}

// Create the 8x8 battlefield grid
function createBattlefield() {
    const battlefield = document.getElementById('battlefield');
    battlefield.innerHTML = '';
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            battlefield.appendChild(cell);
        }
    }
}

// Setup the shop with random units
function setupShop() {
    const shopSlots = document.querySelectorAll('.shop-slot');
    
    shopSlots.forEach(slot => {
        slot.innerHTML = '';
        // if (Math.random() > 0.3)  // 70% chance to have a unit in shop
            const randomUnit = window.UnitInfo.getRandomUnitData();
            window.UnitInfo.createUnitElement(randomUnit, slot, true);

    });
}

// Place enemy units on the battlefield
function placeEnemyUnits() {
    const battlefield = document.getElementById('battlefield');
    
    // Select a random number of enemies (3 to 7)
    const numEnemies = Math.floor(Math.random() * 5) + 3;
    const shuffledEnemies = [...window.UnitInfo.enemyUnits].sort(() => Math.random() - 0.5);
    const selectedEnemies = shuffledEnemies.slice(0, numEnemies);
    
    // Categorize units
    const tanks = selectedEnemies.filter(unit => unit.type === 'tank');
    const melee = selectedEnemies.filter(unit => unit.type === 'melee');
    const archer = selectedEnemies.filter(unit => unit.type === 'archer');
    
    const placement = {
        0: archer,  // Front row
        1: melee,  // Mid row
        2: melee,  // Mid row
        3: tanks  // Back row
    };
    
    Object.keys(placement).forEach(row => {
        let usedCols = new Set();
        placement[row].forEach(unitData => {
            let col;
            let attempts = 0;
            do {
                col = Math.floor(Math.random() * 5) + 1; // Random column from 1 to 5
                attempts++;
            } while (usedCols.has(col) && attempts < 10);
            
            usedCols.add(col);
            const cell = battlefield.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell && !cell.querySelector('.unit')) {
                const enemyUnitData = { ...unitData, isEnemy: true };
                window.UnitInfo.createUnitElement(enemyUnitData, cell);
            }
        });
    });
}


// Update gold display
function updateGoldDisplay() {
    document.getElementById('gold-amount').textContent = gold;
}

// Setup drag and drop functionality
function setupDragDropListeners() {
    // Setup draggable units
    document.addEventListener('mousedown', function(e) {
        const unit = e.target.closest('.unit');
        if (unit && !unit.dataset.isEnemy && !window.BattleLogic.isCombatActive) {
            draggedUnit = unit;
            draggedParent = unit.parentElement;
            
            // Setup drag ghost
            unit.setAttribute('draggable', true);
            unit.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', 'unit');
                setTimeout(() => {
                    unit.style.opacity = '0.4';
                }, 0);
            }, { once: true });
        }
    });
    
    // Make battlefield and bench accept drops
    const dropTargets = [
        ...document.querySelectorAll('.battlefield .cell'),
        ...document.querySelectorAll('.bench-slot')
    ];
    
    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedUnit && draggedParent) {
                // Check if dropping on battlefield
                if (target.classList.contains('cell')) {
                    const row = parseInt(target.dataset.row);
                    // Only allow player units in bottom half
                    if (row < 4 && !draggedUnit.dataset.isEnemy) {
                        alert('You can only place units in the bottom half of the battlefield!');
                        return;
                    }
                }
                
                // Don't allow drops if target already has a unit
                if (!target.querySelector('.unit')) {
                    target.appendChild(draggedUnit);
                }
            }
        });
    });
    
    // Reset drag state on dragend
    document.addEventListener('dragend', () => {
        if (draggedUnit) {
            draggedUnit.style.opacity = '1';
            draggedUnit = null;
            draggedParent = null;
        }
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Drag and drop
    setupDragDropListeners();
    
    // Shop interaction
    const shopSlots = document.querySelectorAll('.shop-slot');
    shopSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const unit = slot.querySelector('.unit');
            if (unit) {
                const cost = parseInt(unit.dataset.cost);
                if (gold >= cost) {
                    gold -= cost;
                    updateGoldDisplay();
                    
                    // Find first empty bench slot
                    const benchSlots = document.querySelectorAll('.bench-slot');
                    let placed = false;
                    
                    for (let benchSlot of benchSlots) {
                        if (!benchSlot.querySelector('.unit')) {
                            // Clone unit data and create new unit on bench
                            const unitData = {
                                name: unit.dataset.name,
                                faction: unit.dataset.faction,
                                type: unit.dataset.type,
                                health: parseInt(unit.dataset.health),
                                maxHealth: parseInt(unit.dataset.maxHealth),
                                attack: parseInt(unit.dataset.attack),
                                range: parseInt(unit.dataset.range)
                            };
                            
                            const newUnit = window.UnitInfo.createUnitElement(unitData, benchSlot);
                            placed = true;
                            break;
                        }
                    }
                    
                    if (!placed) {
                        alert('Your bench is full! Sell units to make space.');
                        gold += cost; // Refund gold
                        updateGoldDisplay();
                    } else {
                        // Remove unit from shop
                        slot.innerHTML = '';
                    }
                } else {
                    alert('Not enough gold!');
                }
            }
        });
    });
    
    // Combat button
    document.getElementById('start-combat').addEventListener('click', () => {
        window.BattleLogic.startCombat();
    });
    
    // Refresh shop button
    document.getElementById('refresh-shop').addEventListener('click', () => {
        if (gold >= 1) {
            gold -= 1;
            updateGoldDisplay();
            setupShop();
        } else {
            alert('Not enough gold to refresh shop!');
        }
    });
}

// Reset battlefield after combat
function resetBattlefield() {
    // Remove all enemy units
    document.querySelectorAll('.battlefield .unit[data-is-enemy="true"]').forEach(unit => {
        unit.remove();
    });
    
    // Reset health for player units
    document.querySelectorAll('.battlefield .unit:not([data-is-enemy="true"])').forEach(unit => {
        unit.dataset.health = unit.dataset.maxHealth;
        const healthFill = unit.querySelector('.health-fill');
        healthFill.style.width = '100%';
        healthFill.style.backgroundColor = '#3f3';
    });
    
    // Place new enemy units
    placeEnemyUnits();
    
    // Refresh shop
    setupShop();
}

// Music control // Music control // Music control
document.addEventListener('DOMContentLoaded', function() {
    const musicButton = document.getElementById('music-toggle');
    const music = document.getElementById('background-music');
    let isMusicPlaying = false;
    
    // Set initial volume
    music.volume = 0.3;
    
    musicButton.addEventListener('click', function() {
        if (isMusicPlaying) {
            music.pause();
            musicButton.textContent = '🔇';
            isMusicPlaying = false;
        } else {
            // Start playing only if this is user-initiated
            music.play().catch(error => {
                console.error("Music playback failed:", error);
                // Most browsers require user interaction before audio can play
                alert("Click again to play music (browser requires user interaction)");
            });
            musicButton.textContent = '🔊';
            isMusicPlaying = true;
        }
    });
    
    // Auto-play attempt (most browsers will block this)
    music.play().catch(error => {
        console.error("Auto-play failed as expected:", error);
        // This is normal, as browsers require user interaction
    });
});

// Add gold to player's account
function addGold(amount) {
    gold += amount;
    updateGoldDisplay();
}

// Export objects and functions for other modules
window.GameBoard = {
    gold,
    initGameBoard,
    resetBattlefield,
    updateGoldDisplay,
    addGold
};

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.GameBoard.initGameBoard();
});