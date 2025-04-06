// traitDisplay.js - Shows active traits on the left side of the battlefield

// Create a traits container on the left of the battlefield
function createTraitsContainer() {
    const gameContainer = document.querySelector('.game-container');
    const battlefield = document.getElementById('battlefield');
    
    // Create the main traits container
    const traitsContainer = document.createElement('div');
    traitsContainer.id = 'traits-container';
    traitsContainer.className = 'traits-container';
    
    // Find the main game area div, which IS a direct child of gameContainer
    const mainGameArea = gameContainer.querySelector('.main-game-area');

    // Insert the traitsContainer before the main game area
    if (mainGameArea) {
        gameContainer.insertBefore(traitsContainer, mainGameArea);
    } else {
        console.error("Could not find .main-game-area to insert traits container before.");
        gameContainer.appendChild(traitsContainer);
    }

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
    console.log("--- Running updateTraitsDisplay ---"); // <<< ADDED
    const activeTraitsContainer = document.getElementById('active-traits');
    if (!activeTraitsContainer) {
        console.log("Error: #active-traits container not found."); // <<< ADDED
        return;
    }

    activeTraitsContainer.innerHTML = ''; // Clear existing content

    const battlefieldUnits = document.querySelectorAll('#battlefield .unit');
    console.log('Battlefield Units Found:', battlefieldUnits.length); // <<< ADDED

    const traitCounts = {};
    battlefieldUnits.forEach(unit => {
        // --- ADDED Debugging inside unit loop ---
        console.log(`Processing Unit: ${unit.dataset.name}, Is Enemy: ${unit.dataset.isEnemy}`);
        if (unit.dataset.isEnemy === 'true') {
             console.log(`Skipping enemy unit: ${unit.dataset.name}`);
             return;
        }
        console.log(`Unit data-traits attribute:`, unit.dataset.traits);
         if (!unit.dataset.traits) {
             console.log(`Skipping unit ${unit.dataset.name}: No data-traits attribute.`);
             return;
         }
        // --- END ADDED Debugging ---

        try { // Add try-catch for parsing robustness
            const traits = JSON.parse(unit.dataset.traits || '[]');
            console.log(`Parsed Traits for ${unit.dataset.name}:`, traits); // <<< ADDED

            traits.forEach(trait => {
                if (!traitCounts[trait]) {
                    traitCounts[trait] = { count: 0, units: [] };
                }
                traitCounts[trait].count++;
                if (!traitCounts[trait].units.includes(unit.dataset.name)) {
                    traitCounts[trait].units.push(unit.dataset.name);
                }
            });
        } catch (e) {
             console.error(`Error parsing traits for unit ${unit.dataset.name}:`, unit.dataset.traits, e); // <<< ADDED Error Catching
        }
    });

    console.log('Final Trait Counts:', JSON.stringify(traitCounts)); // <<< ADDED (stringify for better object view)

    

    // Display the traits that were actually counted
    Object.keys(traitCounts).sort().forEach(trait => {
        console.log(`Attempting to display trait: ${trait}`); // <<< ADDED
        const count = traitCounts[trait].count;
        const units = traitCounts[trait].units;

        const traitElement = document.createElement('div');
        traitElement.className = 'trait-item';

        const traitIcon = getTraitIcon(trait);

        traitElement.innerHTML = `
            <div class="trait-icon">${traitIcon}</div>
            <div class="trait-info">
                <div class="trait-name">${trait} (${count})</div>
                <div class="trait-description">${getTraitDescription(trait, count)}</div>
            </div>
        `;
        traitElement.title = `Units: ${units.join(', ')}`;

        if (isTraitBonusActive(trait, count)) {
            traitElement.classList.add('trait-active');
            traitElement.classList.remove('trait-inactive');
        } else {
            traitElement.classList.add('trait-inactive');
            traitElement.classList.remove('trait-active');
        }

        activeTraitsContainer.appendChild(traitElement);
        console.log(`Successfully appended element for trait: ${trait}`); // <<< ADDED
    });
     console.log("--- Finished updateTraitsDisplay ---"); // <<< ADDED
}

// Get trait icon based on trait name
function getTraitIcon(trait) {
    const icons = { // small icon in TOP LEFT
        'Gondor': '⚜️',
        '': '⚔️',
        '': '🏹',
        '': '🐎',
        '': '🛡️',
        '': '🌿',
        'Rohan': '🐎',
        'Dwarves': '⛏️',
        'Elves': '🧝',
        'Mordor': '👤',
        'Isengard': '👹',
        'East': '🗡️',
        'Harad': '👳🏾‍♂️',
        'Goblin': '👺',
        '': '🗑️',
        '': '🔥',
        '': '👑',
        '': '🔱'
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
            } },
        'Fellowship': {
            description: 'Warriors deal increased damage',
            thresholds: {
                2: '+10% attack damage',
                4: '+20% attack damage',
                6: '+35% attack damage'
            } },
        'Gbros': {
            description: 'Rangers gain attack range',
            thresholds: {
                2: '+1 attack range',
                4: '+2 attack range',
                6: '+3 attack range and +15% damage'
            } },
        'Ithilien': {
            description: 'Cavalry units move faster',
            thresholds: {
                2: '+15% move speed',
                4: '+30% move speed and +10% attack'
            } },
        'Hobbit': {
            description: 'Defenders gain health regeneration',
            thresholds: {
                2: '1% HP regen per second',
                3: '2% HP regen per second'
            } },
        'Lothlórien': {
            description: 'Healers heal nearby allies',
            thresholds: {
                1: 'Heal 1% HP per second',
                2: 'Heal 2% HP per second',
                3: 'Heal 3% HP per second'
            } },
        'Rohan': {
            description: 'Rohan units gain charge damage',
            thresholds: {
                2: '+20% first attack damage',
                4: '+40% first attack damage'
            } },
        'Dwarves': {
            description: 'Dwarves gain max health',
            thresholds: {
                2: '+15% max health',
                4: '+30% max health'
            }  },
        'Elves': {
            description: 'Elves gain mana regeneration',
            thresholds: {
                2: '+20% mana gain',
                4: '+40% mana gain',
                6: '+60% mana gain'
            }  },
        'Mordor': {
            description: 'Mordor units gain attack power over time',
            thresholds: {
                2: '+2% attack every 5 seconds',
                4: '+4% attack every 5 seconds'
            }  },
        'Isengard': {
            description: 'Isengard units gain splash damage',
            thresholds: {
                2: '10% splash damage',
                4: '25% splash damage'
            }  },
        'Harad': {
            description: 'Harad units gain lifesteal',
            thresholds: {
                2: '10% lifesteal',
                4: '20% lifesteal'
            } },
        'East': {
            description: 'Eastern units gain armor piercing',
            thresholds: {
                2: '15% armor piercing',
                3: '30% armor piercing'
            } },
        'Rivendell': {
            description: 'Goblins gain attack speed',
            thresholds: {
                3: '+15% attack speed',
                6: '+30% attack speed'
            }  },
        'Mirkwood': {
            description: 'Scavengers gain gold on kills',
            thresholds: {
                1: '+1 gold per kill',
                3: '+2 gold per kill'
            } },
        ' ': {
            description: 'Berserkers gain rage when damaged',
            thresholds: {
                1: '+5% attack when damaged',
                2: '+10% attack when damaged'
            } },
        'Royalty': {
            description: 'Royal units boost nearby allies',
            thresholds: {
                1: '+10% stats to nearby allies',
                2: '+20% stats to nearby allies'
            }},
        ' ': {
            description: 'Spearmen counter cavalry',
            thresholds: {
                2: '+30% damage vs cavalry',
                4: '+60% damage vs cavalry'
            }
        }
    };
    
    const traitInfo = descriptions[trait];
    if (!traitInfo) return 'No description available';
    
    // Format all thresholds
    let thresholdText = Object.entries(traitInfo.thresholds)
        .map(([num, effect]) => `(${num}) ${effect}`)
        .join(', ');

    return `${traitInfo.description}: ${thresholdText}`; // Return base description and all thresholds
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
    return function(unitData, container, isShop) { // This is the NEW createUnitElement
        console.log(`[Wrapper] Called for unitData named: ${unitData.name}`); // <<< ADDED
        const unit = original(unitData, container, isShop);

        if (unitData.traits && Array.isArray(unitData.traits)) {
            unit.dataset.traits = JSON.stringify(unitData.traits);
            console.log(`[Wrapper] Set data-traits for ${unit.dataset.name}:`, unit.dataset.traits); // <<< You might already have this one
        } else {
            console.log(`[Wrapper] Did NOT set data-traits for ${unitData.name}. unitData.traits:`, unitData.traits); // <<< You might already have this one
        }
        return unit;
    };
}

// Initialize traits display
function initTraitsDisplay() {
    window.UnitInfo.createUnitElement = extendUnitElementWithTraits(window.UnitInfo.createUnitElement);
    createTraitsContainer();
    
    
    
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
        .traits-container {
            width: 180px; /* Or your desired width */
            background-color: rgba(34, 34, 34, 0.8);
            border-radius: 5px;
            padding: 10px;
            margin-top: 72px; /* Adjust or remove margin as needed */
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            border: 2px solid #594e2d;
            max-height: 500px; /* Adjust as needed */
            overflow-y: auto;
            Add flex-shrink: 0;
            flex-shrink: 0;
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
            /* Remove background color change from here if you only want text color change */
            /* background-color: rgba(50, 50, 50, 0.5); */
            border-radius: 4px;
            transition: background-color 0.3s, color 0.3s, font-weight 0.3s; /* Added color/font-weight transition */
        }

        /* Style for the text part when trait is INACTIVE */
        .trait-inactive .trait-info { /* Target the text container */
            color: #888; /* Grey color */
            font-weight: normal;
        }
         /* Style for the text part when trait is ACTIVE */
        .trait-active .trait-info { /* Target the text container */
            color: white; /* White color */
            font-weight: bold;
        }

        /* Optional: Keep background highlight for active traits if desired */
         .trait-active {
             background-color: rgba(80, 100, 50, 0.5); /* Example active background */
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
            /* Ensure icon color isn't overridden if you want it consistent */
             color: #ccc; /* Or keep its default */
        }

        .trait-info {
            flex: 1;
             /* Set default text color here if needed, otherwise controlled by active/inactive */
             /* color: #ccc; */ /* Example default if needed */
        }

        .trait-name {
            /* font-weight: bold; */ /* Remove bold from base, let active/inactive handle it */
            font-size: 14px;
        }

        .trait-description {
            font-size: 11px;
            /* color: #cccccc; */ /* Color controlled by parent .trait-info active/inactive */
            margin-top: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when window loads
window.addEventListener('load', () => {
    addTraitsStyles();
    initTraitsDisplay();
});