// battleLogic.js - Handles combat logic, AI, and unit behaviors

//
let isCombatActive = false;
const COMBAT_INTERVAL = 100; // Reduced to 100ms for smoother animations and attack timing

function startCombat() {
    if (isCombatActive) return;
    
    const button = document.getElementById('start-combat');
    button.textContent = 'Combat in Progress...';
    button.disabled = true;
    
    isCombatActive = true;
    
    document.querySelectorAll('.unit').forEach(unit => {
        unit.setAttribute('draggable', false);
        unit.dataset.attackTimer = 0; // Reset attack timer at start of combat
        unit.dataset.mana = 0; // Reset mana at start of combat
        unit.dataset.moveTimer = 0;   // Reset move timer at start of combat
        updateManaBar(unit); // Initialize mana bar
    });    // Disable dragging during combat
    
    // Execute combat
    const combatInterval = setInterval(() => {
        console.log("Combat turn executing..."); // Debug message
        const result = executeCombatTurn();
        
        if (result || !isCombatActive) {
            clearInterval(combatInterval);
            endCombat(result);
        }
    }, COMBAT_INTERVAL);
}

function executeCombatTurn() {
    const allUnits = Array.from(document.querySelectorAll('.battlefield .unit'));
    let playerUnitsAlive = false;
    let enemyUnitsAlive = false;
    
    // Check if combat should end
    allUnits.forEach(unit => {
        if (unit.dataset.isEnemy === 'true') {
            enemyUnitsAlive = true;
        } else {
            playerUnitsAlive = true;
        }
    });
    
    if (!playerUnitsAlive || !enemyUnitsAlive) {
        return playerUnitsAlive ? 'player' : 'enemy';
    }
    
    // Process each unit's turn
    allUnits.forEach(unit => {
        const health = parseInt(unit.dataset.health);
        if (health <= 0) return; // Skip dead units
        
        console.log(`Processing unit: ${unit.dataset.name}`); // Debug message
        
        // Update attack timer
        let attackTimer = parseFloat(unit.dataset.attackTimer) || 0;
        const attackSpeed = parseFloat(unit.dataset.attackSpeed) || 1.0;
        
        // Increase timer
        attackTimer += (COMBAT_INTERVAL / 1000) * attackSpeed;
        unit.dataset.attackTimer = attackTimer;
        
        // Find target
        const target = findTarget(unit);
        
        if (target) {
            console.log(`Found target: ${target.dataset.name}`); // Debug message
            
            // Move towards target if not in range
            const inRange = isInRange(unit, target);
            
            if (!inRange) {
                console.log("Moving towards target"); // Debug message
                moveTowardsTarget(unit, target);
            } else if (attackTimer >= 1) { // Only attack if attack timer is full
                console.log("Attacking target"); // Debug message
                // Attack target
                attackTarget(unit, target);
                
                // Reset attack timer after attack
                unit.dataset.attackTimer = 0;
                
                // Check if mana is full and should cast ability
                if (parseInt(unit.dataset.mana) >= parseInt(unit.dataset.maxMana)) {
                    castAbility(unit, target);
                }
            }
        } else {
            console.log("No target found"); // Debug message
        }
    });
    
    return null;
}

// Find a target for a unit
function findTarget(unit) {
    const isEnemy = unit.dataset.isEnemy === 'true';
    const allUnits = Array.from(document.querySelectorAll('.battlefield .unit'));
    
    // Filter potential targets (enemy units for player, player units for enemy)
    const potentialTargets = allUnits.filter(target => {
        const targetIsEnemy = target.dataset.isEnemy === 'true';
        return (isEnemy !== targetIsEnemy) && parseInt(target.dataset.health) > 0;
    });
    
    if (potentialTargets.length === 0) return null;
    
    // Find closest target
    let closestTarget = potentialTargets[0];
    let closestDistance = getDistance(unit, closestTarget);
    
    potentialTargets.forEach(target => {
        const distance = getDistance(unit, target);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestTarget = target;
        }
    });
    
    return closestTarget;
}

// Check if target is in range
function isInRange(unit, target) {
    const range = parseInt(unit.dataset.range);
    const distance = getDistance(unit, target);
    return distance <= range;
}

// Get distance between two units
function getDistance(unit1, unit2) {
    const cell1 = unit1.parentElement;
    const cell2 = unit2.parentElement;
    
    const row1 = parseInt(cell1.dataset.row);
    const col1 = parseInt(cell1.dataset.col);
    const row2 = parseInt(cell2.dataset.row);
    const col2 = parseInt(cell2.dataset.col);
    
    // Manhattan distance for simplicity
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

// Move unit towards target with obstacle avoidance
function moveTowardsTarget(unit, target) {
    const unitCell = unit.parentElement;
    const targetCell = target.parentElement;

    const unitRow = parseInt(unitCell.dataset.row);
    const unitCol = parseInt(unitCell.dataset.col);
    const targetRow = parseInt(targetCell.dataset.row);
    const targetCol = parseInt(targetCell.dataset.col);
    const moveTimer = 1;
    const moveSpeed = parseFloat(unit.dataset.moveSpeed) || 0.5;

    if (moveTimer < 1) {
        // Increment timer based on combat interval and movement speed
        moveTimer += (COMBAT_INTERVAL / 999) * moveSpeed;
        unit.dataset.moveTimer = moveTimer;
        return false; // Skip movement this turn
    }
    
    // Reset timer if we're going to move
    unit.dataset.moveTimer = 0;

    // Get all possible moves (up, right, down, left, diagonals)
    const possibleMoves = [
        { row: unitRow - 1, col: unitCol },     // Up
        { row: unitRow, col: unitCol + 1 },     // Right
        { row: unitRow + 1, col: unitCol },     // Down
        { row: unitRow, col: unitCol - 1 },     // Left
        { row: unitRow - 1, col: unitCol + 1 }, // Up-Right
        { row: unitRow + 1, col: unitCol + 1 }, // Down-Right
        { row: unitRow + 1, col: unitCol - 1 }, // Down-Left
        { row: unitRow - 1, col: unitCol - 1 }  // Up-Left
    ];

    // Calculate distances for each possible move
    const movesWithDistance = possibleMoves.map(move => {
        return {
            ...move,
            distance: Math.abs(move.row - targetRow) + Math.abs(move.col - targetCol)
        };
    });

    // Sort by distance (closest to target first)
    movesWithDistance.sort((a, b) => a.distance - b.distance);

    // Try each move in order until we find a valid one
    for (const move of movesWithDistance) {
        const cell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
        
        // Check if cell exists and isn't occupied by another unit
        if (cell && !cell.querySelector('.unit')) {
            // Move to this cell
            cell.appendChild(unit);
            console.log(`Unit moved to [${move.row}, ${move.col}]`); // Debug message
            return true;
        }
    }
    
    console.log("No valid moves available, unit stuck");
    return false;
}

// Update mana bar visual
function updateManaBar(unit) {
    const mana = parseInt(unit.dataset.mana);
    const maxMana = parseInt(unit.dataset.maxMana);
    const manaPercentage = Math.min(100, (mana / maxMana) * 100);
    
    const manaFill = unit.querySelector('.mana-fill');
    if (manaFill) {
        manaFill.style.width = `${manaPercentage}%`;
    }
}

// Attack target
function attackTarget(unit, target) {
    
    const damage = parseInt(unit.dataset.attack);
    let targetHealth = parseInt(target.dataset.health);
    
    console.log(`Attacking for ${damage} damage, target has ${targetHealth} health`); // Debug message
    
    // Apply damage
    targetHealth -= damage;
    target.dataset.health = targetHealth;
    
    // Update health bar
    const healthFill = target.querySelector('.health-fill');
    const healthPercentage = Math.max(0, (targetHealth / parseInt(target.dataset.maxHealth)) * 100);
    healthFill.style.width = `${healthPercentage}%`;
    
    // Change color based on health
    if (healthPercentage < 30) {
        healthFill.style.backgroundColor = '#f33';
    } else if (healthPercentage < 60) {
        healthFill.style.backgroundColor = '#ff3';
    }
    
    // Add mana for attacking
    let currentMana = parseInt(unit.dataset.mana) || 0;
    const manaGain = parseInt(unit.dataset.manaPerAttack) || 10;
    const maxMana = parseInt(unit.dataset.maxMana) || 100;
    
    currentMana = Math.min(maxMana, currentMana + manaGain);
    unit.dataset.mana = currentMana;
    
    // Update mana bar
    updateManaBar(unit);
    
    // Handle death
    if (targetHealth <= 0) {
        console.log(`Unit killed: ${target.dataset.name}`); // Debug message
        target.style.opacity = '0.3';
        setTimeout(() => {
            target.remove();
        }, 500);
    }
    
    // Show attack animation
    unit.classList.add('attacking');
    target.classList.add('taking-damage');
    setTimeout(() => {
        unit.classList.remove('attacking');
        target.classList.remove('taking-damage');
    }, 300);
}

function showDamageNumber(targetElement, damageAmount) {
    const damageText = document.createElement('div');
    damageText.className = 'damage-text';
    damageText.textContent = damageAmount.toFixed(1);
    
    // Position it over the target
    const targetRect = targetElement.getBoundingClientRect();
    damageText.style.left = '50%';
    damageText.style.top = '50%';
    
    // Add to target
    targetElement.appendChild(damageText);
    
    // Apply animation
    damageText.animate([
        { transform: 'translate(-50%, -50%)', opacity: 1 },
        { transform: 'translate(-50%, -100%)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    }).onfinish = () => damageText.remove();
}



// Cast special ability when mana is full
function castAbility(unit, target) {
    // Reset mana after ability cast
    unit.dataset.mana = 0;
    updateManaBar(unit);
    
    // Show ability effect
    unit.classList.add('casting-ability');
    setTimeout(() => {
        unit.classList.remove('casting-ability');
    }, 500);
    
    // Different ability effects based on unit type
    const unitType = unit.dataset.type;
    const unitFaction = unit.dataset.faction;
    
    switch(unitType) {
        case 'melee':
            // Melee units do a cleave attack (hit multiple enemies)
            const nearbyEnemies = findNearbyEnemies(unit, 1); // 1 tile radius
            nearbyEnemies.forEach(enemy => {
                const bonusDamage = Math.floor(parseInt(unit.dataset.attack) * 0.5);
                damageUnit(enemy, bonusDamage, true);
            });
            console.log(`${unit.dataset.name} used Cleave ability!`);
            break;
            
        case 'archer':
            // Archers do a focused shot (critical hit)
            const critDamage = Math.floor(parseInt(unit.dataset.attack) * 2);
            damageUnit(target, critDamage, true);
            console.log(`${unit.dataset.name} used Focused Shot ability!`);
            break;
            
        case 'tank':
            // Tanks gain a shield
            unit.dataset.shield = Math.floor(parseInt(unit.dataset.maxHealth) * 0.2);
            console.log(`${unit.dataset.name} activated Shield ability!`);
            
            // Show shield visual
            const shieldEffect = document.createElement('div');
            shieldEffect.className = 'shield-effect';
            shieldEffect.style.position = 'absolute';
            shieldEffect.style.width = '100%';
            shieldEffect.style.height = '100%';
            shieldEffect.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            shieldEffect.style.borderRadius = '50%';
            shieldEffect.style.pointerEvents = 'none';
            unit.appendChild(shieldEffect);
            
            setTimeout(() => {
                shieldEffect.remove();
            }, 3000);
            break;
            
        case 'hero':
            // Heroes get a powerful unique ability based on faction
            if (unitFaction === 'hero' || unitFaction === 'men') {
                // Fellowship or Men heroes do an inspiration (buff allies)
                const nearbyAllies = findNearbyAllies(unit, 2); // 2 tile radius
                nearbyAllies.forEach(ally => {
                    ally.dataset.attack = Math.floor(parseInt(ally.dataset.attack) * 1.2);
                    
                    // Show buff visual
                    ally.style.filter = 'brightness(1.3)';
                    setTimeout(() => {
                        ally.style.filter = '';
                    }, 3000);
                });
                console.log(`${unit.dataset.name} used Inspiration ability!`);
            } else if (unitFaction === 'evil') {
                // Evil heroes do a fear effect (stun enemies)
                const nearbyEnemies = findNearbyEnemies(unit, 2); // 2 tile radius
                nearbyEnemies.forEach(enemy => {
                    // Stun for 1 second
                    enemy.dataset.stunned = 'true';
                    enemy.style.filter = 'grayscale(0.7)';
                    
                    setTimeout(() => {
                        enemy.dataset.stunned = 'false';
                        enemy.style.filter = '';
                    }, 1000);
                });
                console.log(`${unit.dataset.name} used Fear ability!`);
            }
            break;
    }
}

// Find nearby enemy units within a certain radius
function findNearbyEnemies(unit, radius) {
    const isEnemy = unit.dataset.isEnemy === 'true';
    const allUnits = Array.from(document.querySelectorAll('.battlefield .unit'));
    const unitCell = unit.parentElement;
    const unitRow = parseInt(unitCell.dataset.row);
    const unitCol = parseInt(unitCell.dataset.col);
    
    return allUnits.filter(target => {
        // Must be an enemy and alive
        const targetIsEnemy = target.dataset.isEnemy === 'true';
        if ((isEnemy === targetIsEnemy) || parseInt(target.dataset.health) <= 0) {
            return false;
        }
        
        // Must be within radius
        const targetCell = target.parentElement;
        const targetRow = parseInt(targetCell.dataset.row);
        const targetCol = parseInt(targetCell.dataset.col);
        const distance = Math.abs(unitRow - targetRow) + Math.abs(unitCol - targetCol);
        
        return distance <= radius;
    });
}

// Find nearby allied units within a certain radius
function findNearbyAllies(unit, radius) {
    const isEnemy = unit.dataset.isEnemy === 'true';
    const allUnits = Array.from(document.querySelectorAll('.battlefield .unit'));
    const unitCell = unit.parentElement;
    const unitRow = parseInt(unitCell.dataset.row);
    const unitCol = parseInt(unitCell.dataset.col);
    
    return allUnits.filter(target => {
        // Must be an ally and alive
        const targetIsEnemy = target.dataset.isEnemy === 'true';
        if ((isEnemy !== targetIsEnemy) || target === unit || parseInt(target.dataset.health) <= 0) {
            return false;
        }
        
        // Must be within radius
        const targetCell = target.parentElement;
        const targetRow = parseInt(targetCell.dataset.row);
        const targetCol = parseInt(targetCell.dataset.col);
        const distance = Math.abs(unitRow - targetRow) + Math.abs(unitCol - targetCol);
        
        return distance <= radius;
    });
}

// Apply damage to a unit with optional special effect
function damageUnit(unit, damage, isAbility = false) {
    let targetHealth = parseInt(unit.dataset.health);
    
    // Apply damage
    targetHealth -= damage;
    unit.dataset.health = targetHealth;
    
    // Update health bar
    const healthFill = unit.querySelector('.health-fill');
    const healthPercentage = Math.max(0, (targetHealth / parseInt(unit.dataset.maxHealth)) * 100);
    healthFill.style.width = `${healthPercentage}%`;
    
    // Change color based on health
    if (healthPercentage < 30) {
        healthFill.style.backgroundColor = '#f33';
    } else if (healthPercentage < 60) {
        healthFill.style.backgroundColor = '#ff3';
    }
    
    // Special effect for ability damage
    if (isAbility) {
        unit.classList.add('ability-effect');
        setTimeout(() => {
            unit.classList.remove('ability-effect');
        }, 300);
    }
    
    // Handle death
    if (targetHealth <= 0) {
        console.log(`Unit killed: ${unit.dataset.name}`); // Debug message
        unit.style.opacity = '0.3';
        setTimeout(() => {
            unit.remove();
        }, 500);
    }
}

// End combat
function endCombat(result) {
    isCombatActive = false;
    
    console.log(`Combat ended with result: ${result}`); // Debug message
    
    // Re-enable dragging
    document.querySelectorAll('.unit').forEach(unit => {
        unit.setAttribute('draggable', true);
    });
    
    // Update UI
    const button = document.getElementById('start-combat');
    button.textContent = 'Start Combat';
    button.disabled = false;
    
    // Reward player if won
    if (result === 'player') {
        window.GameBoard.addGold(3);
        alert('Victory! Earned 3 gold.');
    } else if (result === 'enemy') {
        alert('Defeat! Try again with a different strategy.');
    }
    
    // Reset the battlefield
    window.GameBoard.resetBattlefield();
}

// Export objects and functions for other modules
window.BattleLogic = {
    isCombatActive,
    startCombat,
    executeCombatTurn,
    findTarget,
    moveTowardsTarget,
    attackTarget,
    updateManaBar,
    castAbility
};