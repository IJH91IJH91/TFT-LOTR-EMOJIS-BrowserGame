// traitDisplay.js - Shows active traits on the left side of the battlefield

// Create a traits container on the left of the battlefield
function createTraitsContainer() {
    const gameContainer = document.querySelector('.game-container');
    const battlefield = document.getElementById('battlefield');
    
    // Create the main traits container
    const traitsContainer = document.createElement('div');
    traitsContainer.id = 'traits-container';
    traitsContainer.className = 'traits-container';
    
    // Insert it before the battlefield
    gameContainer.insertBefore(traitsContainer, battlefield);
    
    // Add the traits container
    const activeTraits = document.createElement('div');
    activeTraits.id = 'active-traits';
    activeTraits.className = 'active-traits';
    
    // Add title
    const traitsTitle = document.createElement('div');
    traitsTitle.className = 'traits-title';
    traitsTitle.textContent = 'Active Traits';
    
    traitsContainer.appendChild(traitsTitle);
    traitsContainer.appendChild(activeTraits);
    
    return traitsContainer;
}

// Update the active traits display
function updateTraitsDisplay() {
    const activeTraits = document.getElementById('active-traits');
    if (!activeTraits) return;
    
    // Clear existing traits
    activeTraits.innerHTML = '';
    
    // Get all units on the battlefield (not on bench or shop)
    const battlefieldUnits = document.querySelectorAll('#battlefield .unit');
    
    // Count traits
    const traitCounts = {};
    battlefieldUnits.forEach(unit => {
        if (!unit.dataset.traits) return;
        
        // Parse traits from data attribute
        const traits = JSON.parse(unit.dataset.traits || '[]');
        
        traits.forEach(trait => {
            if (!traitCounts[trait]) {
                traitCounts[trait] = {
                    count: 0,
                    units: []
                };
            }
            traitCounts[trait].count++;
            traitCounts[trait].units.push(unit.dataset.name);
        });
    });
    
    // Display traits
    Object.keys(traitCounts).sort().forEach(trait => {
        const count = traitCounts[trait].count;
        const units = traitCounts[trait].units;
        
        // Create trait element
        const traitElement = document.createElement('div');
        traitElement.className = 'trait-item';
        
        // Add trait icon based on trait name
        const traitIcon = getTraitIcon(trait);
        
        // Create trait content
        traitElement.innerHTML = `
            <div class="trait-icon">${traitIcon}</div>
            <div class="trait-info">
                <div class="trait-name">${trait} (${count})</div>
                <div class="trait-description">${getTraitDescription(trait, count)}</div>
            </div>
        `;
        
        // Add tooltip with unit names
        traitElement.title = `Units: ${units.join(', ')}`;
        
        // Add trait element to container
        activeTraits.appendChild(traitElement);
        
        // Add active class if trait bonus is active
        if (isTraitBonusActive(trait, count)) {
            traitElement.classList.add('trait-active');
        }
    });
}

// Get trait icon based on trait name
function getTraitIcon(trait) {
    const icons = {
        'Gondor': '⚜️',
        'Warrior': '⚔️',
        'Ranger': '🏹',
        'Cavalry': '🐎',
        'Defender': '🛡️',
        'Healer': '🌿',
        'Rohan': '🐎',
        'Dwarves': '⛏️',
        'Elves': '🧝',
        'Mordor': '👤',
        'Isengard': '👹',
        'East': '🗡️',
        'Harad': '👳🏾‍♂️',
        'Goblin': '👺',
        'Scavenger': '🗑️',
        'Berserker': '🔥',
        'Royalty': '👑',
        'Spearman': '🔱'
    };
    
    return icons[trait] || '✦';
}

// Get trait description based on trait name and count
function getTraitDescription(trait, count) {
    const descriptions = {
        'Gondor': {
            description: 'Gondor units gain bonus defense',
            thresholds: {
                2: '+10% defense',
                4: '+25% defense',
                6: '+40% defense'
            }
        },
        'Warrior': {
            description: 'Warriors deal increased damage',
            thresholds: {
                2: '+10% attack damage',
                4: '+20% attack damage',
                6: '+35% attack damage'
            }
        },
        'Ranger': {
            description: 'Rangers gain attack range',
            thresholds: {
                2: '+1 attack range',
                4: '+2 attack range',
                6: '+3 attack range and +15% damage'
            }
        },
        'Cavalry': {
            description: 'Cavalry units move faster',
            thresholds: {
                2: '+15% move speed',
                4: '+30% move speed and +10% attack'
            }
        },
        'Defender': {
            description: 'Defenders gain health regeneration',
            thresholds: {
                2: '1% HP regen per second',
                3: '2% HP regen per second'
            }
        },
        'Healer': {
            description: 'Healers heal nearby allies',
            thresholds: {
                1: 'Heal 1% HP per second',
                2: 'Heal 2% HP per second',
                3: 'Heal 3% HP per second'
            }
        },
        'Rohan': {
            description: 'Rohan units gain charge damage',
            thresholds: {
                2: '+20% first attack damage',
                4: '+40% first attack damage'
            }
        },
        'Dwarves': {
            description: 'Dwarves gain max health',
            thresholds: {
                2: '+15% max health',
                4: '+30% max health'
            }
        },
        'Elves': {
            description: 'Elves gain mana regeneration',
            thresholds: {
                2: '+20% mana gain',
                4: '+40% mana gain',
                6: '+60% mana gain'
            }
        },
        'Mordor': {
            description: 'Mordor units gain attack power over time',
            thresholds: {
                2: '+2% attack every 5 seconds',
                4: '+4% attack every 5 seconds'
            }
        },
        'Isengard': {
            description: 'Isengard units gain splash damage',
            thresholds: {
                2: '10% splash damage',
                4: '25% splash damage'
            }
        },
        'Harad': {
            description: 'Harad units gain lifesteal',
            thresholds: {
                2: '10% lifesteal',
                4: '20% lifesteal'
            }
        },
        'East': {
            description: 'Eastern units gain armor piercing',
            thresholds: {
                2: '15% armor piercing',
                3: '30% armor piercing'
            }
        },
        'Goblin': {
            description: 'Goblins gain attack speed',
            thresholds: {
                3: '+15% attack speed',
                6: '+30% attack speed'
            }
        },
        'Scavenger': {
            description: 'Scavengers gain gold on kills',
            thresholds: {
                1: '+1 gold per kill',
                3: '+2 gold per kill'
            }
        },
        'Berserker': {
            description: 'Berserkers gain rage when damaged',
            thresholds: {
                1: '+5% attack when damaged',
                2: '+10% attack when damaged'
            }
        },
        'Royalty': {
            description: 'Royal units boost nearby allies',
            thresholds: {
                1: '+10% stats to nearby allies',
                2: '+20% stats to nearby allies'
            }
        },
        'Spearman': {
            description: 'Spearmen counter cavalry',
            thresholds: {
                2: '+30% damage vs cavalry',
                4: '+60% damage vs cavalry'
            }
        }
    };
    
    // Get description for this trait
    const traitInfo = descriptions[trait];
    if (!traitInfo) return 'No description available';
    
    // Find the highest threshold that the count satisfies
    const thresholds = Object.keys(traitInfo.thresholds)
        .map(Number)
        .sort((a, b) => b - a)
        .find(threshold => count >= threshold);
    
    if (thresholds) {
        return `${traitInfo.description}: ${traitInfo.thresholds[thresholds]}`;
    } else {
        return `${traitInfo.description} (inactive)`;
    }
}

// Check if trait bonus is active
function isTraitBonusActive(trait, count) {
    const minimumCounts = {
        'Gondor': 2,
        'Warrior': 2,
        'Ranger': 2,
        'Cavalry': 2,
        'Defender': 2,
        'Healer': 1,
        'Rohan': 2,
        'Dwarves': 2,
        'Elves': 2,
        'Mordor': 2,
        'Isengard': 2,
        'East': 2,
        'Harad': 2,
        'Goblin': 3,
        'Scavenger': 1,
        'Berserker': 1,
        'Royalty': 1,
        'Spearman': 2
    };
    
    return count >= (minimumCounts[trait] || 2);
}

// Modify the createUnitElement function to include traits
function extendUnitElementWithTraits(original) {
    return function(unitData, container, isShop) {
        // Call the original function
        const unit = original(unitData, container, isShop);
        
        // Add traits data attribute
        if (unitData.traits && Array.isArray(unitData.traits)) {
            unit.dataset.traits = JSON.stringify(unitData.traits);
        }
        
        return unit;
    };
}

// Initialize traits display
function initTraitsDisplay() {
    // Create container
    createTraitsContainer();
    
    // Extend the unit creation function to include traits
    if (window.UnitInfo && window.UnitInfo.createUnitElement) {
        window.UnitInfo.createUnitElement = extendUnitElementWithTraits(window.UnitInfo.createUnitElement);
    }
    
    // Update traits when units change
    const updateInterval = setInterval(updateTraitsDisplay, 1000);
    
    // Also update on specific events
    document.addEventListener('unitAdded', updateTraitsDisplay);
    document.addEventListener('unitRemoved', updateTraitsDisplay);
    document.addEventListener('combatStart', updateTraitsDisplay);
    document.addEventListener('combatEnd', updateTraitsDisplay);
    
    // Initial update
    updateTraitsDisplay();
}

// Add CSS for traits display
function addTraitsStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .game-container {
            display: flex;
            flex-direction: row;
            gap: 20px;
            max-width: 1000px;
            align-items: flex-start;
        }
        
        .traits-container {
            width: 180px;
            background-color: rgba(34, 34, 34, 0.8);
            border-radius: 5px;
            padding: 10px;
            margin-top: 72px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            border: 2px solid #594e2d;
            max-height: 500px;
            overflow-y: auto;
        }
        
        .traits-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
            color: #ffd700;
            font-size: 16px;
        }
        
        .trait-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding: 5px;
            background-color: rgba(50, 50, 50, 0.5);
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .trait-active {
            background-color: rgba(80, 100, 50, 0.5);
            border-left: 3px solid #ffd700;
        }
        
        .trait-icon {
            font-size: 18px;
            margin-right: 8px;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .trait-info {
            flex: 1;
        }
        
        .trait-name {
            font-weight: bold;
            font-size: 14px;
        }
        
        .trait-description {
            font-size: 11px;
            color: #cccccc;
            margin-top: 2px;
        }
        
        /* Adjust battlefield layout */
        .battlefield, .shop, .bench, .controls {
            flex: 1;
        }
        
        /* Make controls go across full width */
        .controls {
            width: 100%;
            order: -1;
        }
        
        /* Make the shop, battlefield, and bench display in column */
        .game-container {
            flex-wrap: wrap;
        }
        
        .shop, .battlefield, .bench {
            width: calc(100% - 200px);
            margin-left: auto;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when window loads
window.addEventListener('load', () => {
    addTraitsStyles();
    initTraitsDisplay();
});