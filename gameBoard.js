// gameBoard.js - Handles shop, bench, battlefield, and placement logic

// Game state variables
let gold = 25;
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
                console.log('[GameBoard - PlaceEnemy] Placing enemy unit. enemyUnitData:', JSON.stringify(enemyUnitData));
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
                const targetIsBattlefieldCell = target.classList.contains('cell') && target.closest('#battlefield');
                const targetIsBenchSlot = target.classList.contains('bench-slot');
                const sourceWasBattlefieldCell = draggedParent.classList.contains('cell') && draggedParent.closest('#battlefield');
                const sourceWasBenchSlot = draggedParent.classList.contains('bench-slot');
    
                // --- Validation Checks (Keep these) ---
                if (targetIsBattlefieldCell) {
                    const row = parseInt(target.dataset.row);
                    // Only allow player units in bottom half (Rows 4-7 for 8x8 grid)
                    if (row < 4 && !draggedUnit.dataset.isEnemy) { // Assuming 0-3 is enemy, 4-7 is player side
                        alert('You can only place units in the bottom half of the battlefield!');
                        // Important: Reset opacity even on failure
                        if (draggedUnit) draggedUnit.style.opacity = '1';
                        draggedUnit = null;
                        draggedParent = null;
                        return;
                    }
                }
    
                // Don't allow drops if target already has a unit AND isn't the original parent
                if (target.querySelector('.unit') && target !== draggedParent) {
                     // Maybe swap units later, for now, prevent drop or return unit to original parent
                     // For simplicity, just return unit if target is occupied
                     console.log("Target cell occupied.");
                     if (draggedParent && !draggedParent.querySelector('.unit')) {
                         draggedParent.appendChild(draggedUnit); // Put it back
                     }
                     // Reset opacity even on failure
                     if (draggedUnit) draggedUnit.style.opacity = '1';
                     draggedUnit = null;
                     draggedParent = null;
                     return;
                }
                // --- End Validation Checks ---
    
    
                // --- Move Unit and Dispatch Events ---
                // Append unit to the new target cell/slot
                target.appendChild(draggedUnit);
    
                // Check if the move affects the battlefield composition and dispatch events
                if (targetIsBattlefieldCell && sourceWasBenchSlot) {
                    // Moved FROM Bench TO Battlefield
                    console.log('Dispatching unitAdded event');
                    document.dispatchEvent(new CustomEvent('unitAdded', { detail: { unit: draggedUnit } }));
                } else if (targetIsBenchSlot && sourceWasBattlefieldCell) {
                    // Moved FROM Battlefield TO Bench
                    console.log('Dispatching unitRemoved event');
                    document.dispatchEvent(new CustomEvent('unitRemoved', { detail: { unit: draggedUnit } }));
                }
                // NOTE: Moving within the battlefield or within the bench doesn't require unitAdded/unitRemoved
                //       but might require updates if traits depend on position (which they currently don't).
    
                // --- Reset Drag State (Moved inside the if block) ---
                 if (draggedUnit) draggedUnit.style.opacity = '1'; // Reset opacity after successful drop
                 draggedUnit = null;
                 draggedParent = null;
    
            } // End if (draggedUnit && draggedParent)
        }); // End drop listener
    }); // End dropTargets.forEach
    
    document.addEventListener('dragend', () => {
        if (draggedUnit) { // If draggedUnit still exists, drop failed or wasn't on a valid target
            console.log("Drag ended, resetting potentially failed drag.");
            draggedUnit.style.opacity = '1';
            // Optional: ensure it's back in its original parent if possible
            if (draggedParent && !draggedParent.contains(draggedUnit) && !draggedParent.querySelector('.unit')) {
                 draggedParent.appendChild(draggedUnit);
            }
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
            const unitElementInShop = slot.querySelector('.unit'); // Renamed for clarity
            if (unitElementInShop) {
                const cost = parseInt(unitElementInShop.dataset.cost);
                if (gold >= cost) {
                    gold -= cost;
                    updateGoldDisplay();

                    // Find first empty bench slot
                    const benchSlots = document.querySelectorAll('.bench-slot');
                    let placed = false;

                    for (let benchSlot of benchSlots) {
                        if (!benchSlot.querySelector('.unit')) {

                            // --- MODIFICATION START ---
                            // Find the original unit definition from unitInfo.js based on name
                            const unitName = unitElementInShop.dataset.name;
                            const originalUnitData = window.UnitInfo.unitTypes.find(u => u.name === unitName); // Find the full definition

                            if (originalUnitData) {
                                // Use a copy of the original data to pass to createUnitElement
                                // This ensures ALL properties, including 'traits', are included.
                                const unitDataForBench = { ...originalUnitData };

                                console.log('[GameBoard - ShopClick] Found original data:', JSON.stringify(unitDataForBench)); // Optional debug
                                const newUnit = window.UnitInfo.createUnitElement(unitDataForBench, benchSlot); // Pass the full data object

                                placed = true;

                            } else {
                                console.error(`Could not find original unit data for ${unitName}`);
                                // Handle error: maybe refund gold?
                                gold += cost;
                                updateGoldDisplay();
                            }
                            // --- MODIFICATION END ---

                            if (placed) break; // Exit loop once placed
                        }
                    }

                    if (!placed) {
                        alert('Your bench is full! Sell units to make space.');
                        gold += cost; // Refund gold
                        updateGoldDisplay();
                    } else {
                        // Remove unit element from shop slot
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