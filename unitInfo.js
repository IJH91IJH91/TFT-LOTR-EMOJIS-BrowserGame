// unitInfo.js - Contains unit data, stats, and creation functions

// Unit data
const unitTypes = [
    // { name: '    ', faction: '   ', type: '  ', health: , attack:, range: , cost: , attackSpeed: 0.9, maxMana: , manaPerAttack: , moveSpeed: 1.0, traits: ['           ', '        '] },
    /* GONDOR */ // Prince Imrahil w/spear? ((uncle to fara+boro)
    { name: 'Gondorian Soldier', faction: 'men',   type: 'melee', health: 20, attack: 1.3, range: 1, cost: 1, attackSpeed: 1.3, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits: ['Gondor']   },
    { name: 'Gondorian Archer', faction: 'men',    type: 'archer', health: 15, attack: 1.1, range: 4, cost: 1, attackSpeed: 1.1, maxMana: 120, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor']  },
    { name: 'Tower Guard',     faction: 'men',     type: 'tank', health: 40, attack: 0.8, range: 2, cost: 1, attackSpeed: 0.5, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor'] },
    { name: 'Pippin',     faction: 'hobbit',     type: 'melee',   health: 20, attack:0.8, range:1, cost: 1, attackSpeed: 0.9, maxMana:90 , manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor', 'Fellowship','Hobbit']},
    
    { name: 'Beregond', /* tank*/   faction: 'men', type: 'tank', health: 40, attack: 0.8, range: 2, cost: 2, attackSpeed: 0.5, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor', 'Ithilien'] },
    { name: 'Damrod',   /*melee*/ faction: 'men',  type: 'melee', health: 20, attack: 1.3, range: 1, cost: 2, attackSpeed: 1.3, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits: ['Gondor', 'Ithilien'] },
    { name: 'Mablung', /*archer*/ faction: 'men',  type: 'archer', health: 20, attack: 1.3, range: 1, cost: 2, attackSpeed: 1.3, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits: ['Gondor', 'Ithilien'] },

    { name: 'Boromir',/* tank*/ faction: 'men', type: 'tank', health: 25, attack: 1, range: 1, cost: 3, attackSpeed: 0.9, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor', ' Fellowship','Gbros']},
    { name: 'Faramir',/*archer*/faction: 'men', type: 'archer', health: 25, attack: 1, range: 4, cost: 3, attackSpeed: 0.5, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor','Ithilien','Gbros']},
    { name: 'Aragorn',/*melee*/ faction: 'men', type: 'melee', health: 25, attack: 1, range: 1, cost: 3, attackSpeed: 1, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Gondor', 'Fellowship',]},
    
    /* Elves */ //Thranduil // Glorfindel // Galadriel // Glorfindel
    { name: 'Lórien Swordsman', faction: 'elves', type: 'melee', health: 20, attack: 0.6, range: 1, cost: 1, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits:  ['Elves', 'Lothlórien'] },
    { name: 'Mirkwood Archer',     faction: 'elves', type: 'archer', health: 13, attack: 1, range: 4, cost: 1, attackSpeed: 1.1, maxMana: 150, manaPerAttack: 10, moveSpeed: 1.0, traits: ['Elves', 'Mirkwood'] },
    { name: 'Mirkwood Healer',     faction: 'elves', type: 'healer', health: 18, attack: 0, range: 1, cost: 1, attackSpeed: 0, maxMana: 120, manaPerAttack: 5, moveSpeed: 1.0, traits:     ['Elves', 'Mirkwood'] },

    { name: 'Lórien Captain ',/*melee*/faction: 'elves', type: 'melee', health: 20, attack: 0.6, range: 1, cost: 2, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14,moveSpeed: 1.0,traits:['Elves','Lothlórien'] },
    { name: 'Rivendell Bowman',        faction: 'elves', type: 'archer', health: 13, attack: 1, range: 4, cost: 2, attackSpeed: 1.1, maxMana: 150, manaPerAttack: 10, moveSpeed: 1.0,traits:['Elves','Rivendell'] },

    { name: 'Legolas',/*archer*/faction: 'elves', type: 'archer', health: 25, attack: 1, range: 8, cost: 3, attackSpeed: 0.5, maxMana: 50, manaPerAttack: 12, moveSpeed: 1.0, traits:      ['Elves','Fellowship','Mirkwood'] },
    { name: 'Elrond',/*melee*/faction: 'elves', type: 'melee', health: 20, attack: 0.6, range: 1, cost: 3, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits:     ['Elves','Rivendell'] },
    { name: 'Arwen',/*healer*/faction: 'elves', type: 'healer', health: 20, attack: 0.6, range: 1, cost: 3, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits:   ['Elves','Rivendell'] },
    { name: 'Galadriel',/*???*/faction: 'elves', type: 'healer', health: 20, attack: 0.6, range: 1, cost: 3, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits: ['Elves','Lothlórien'] },
    { name: 'Haldir',/* tank*/ faction: 'elves', type: 'tank', health: 20, attack: 0.6, range: 1, cost: 3, attackSpeed: 0.8, maxMana: 100, manaPerAttack: 14, moveSpeed: 1.0, traits:  ['Elves','Lothlórien'] },
    
    /* Rohan */ // Théodred
    { name: 'Rohan Spearman', faction: 'rohan', type: 'melee', health: 25, attack: 1.1, range: 2, cost: 1, attackSpeed: 1.2, maxMana: 120, manaPerAttack: 15, moveSpeed: 1.4, traits: ['Rohan'] },
    { name: 'Rohan Scout',   faction: 'rohan', type: 'archer', health: 15, attack: 1.2, range: 4, cost: 1, attackSpeed: 1.0, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.1, traits: ['Rohan'] },
    { name: 'Merry',        faction: 'rohan', type: 'archer', health: 15, attack: 1.2, range: 4, cost: 1, attackSpeed: 1.0, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.1, traits: ['Rohan','Hobbit','Fellowship'] },

    { name: 'Háma',         faction: 'rohan', type: 'melee', health: 25, attack: 1.1, range: 2, cost: 2, attackSpeed: 1.2, maxMana: 120, manaPerAttack: 15, moveSpeed: 1.4, traits: ['Rohan'] },
    { name: 'Gamling',      faction: 'rohan', type: 'archer', health: 15, attack: 1.2, range: 4, cost: 2, attackSpeed: 1.0, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.1, traits: ['Rohan'] },

    { name: 'Éowyn',/*healer*/faction: 'rohan', type: 'healer', health: 25, attack: 1.1, range: 2, cost: 3, attackSpeed: 1.2, maxMana: 120, manaPerAttack: 15, moveSpeed: 1.4, traits: ['Rohan', 'HorseLord'] },
    { name: 'Éomer',/*melee*/faction: 'rohan', type: 'melee', health: 15, attack: 1.2, range: 2, cost: 3, attackSpeed: 1.0, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.1, traits: ['Rohan', 'HorseLord'] },
    { name: 'Théoden',/*tank*/faction: 'rohan', type: 'tank', health: 15, attack: 1.2, range: 1, cost: 3, attackSpeed: 1.0, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.1, traits: ['Rohan', 'HorseLord'] },

    /* Dwarves */
    { name: 'Dwarven Warrior', faction: 'dwarves', type: 'melee', health: 30, attack: 1.3, range: 1, cost: 3, attackSpeed: 0.9, maxMana: 80, manaPerAttack: 10, moveSpeed: 0.8, traits: ['Dwarves', 'Warrior'] },
    { name: 'Gimli',            faction: 'dwarves', type: 'tank', health: 45, attack: 0.7, range: 1, cost: 3, attackSpeed: 0.6, maxMana: 100, manaPerAttack: 12, moveSpeed: 0.9, traits: ['Dwarves', 'Fellowship'] },
    
    /* Other */
    { name: 'Frodo',         faction: 'hobbit', type: 'mage', health: 30, attack: 1.3, range: 1, cost: 3, attackSpeed: 0.9, maxMana: 80, manaPerAttack: 10, moveSpeed: 0.8, traits: ['Hobbit', 'Fellowship'] },
    { name: 'Sam',            faction: 'hobbit', type: 'mage', health: 30, attack: 1.3, range: 1, cost: 3, attackSpeed: 0.9, maxMana: 80, manaPerAttack: 10, moveSpeed: 0.8, traits: ['Hobbit', 'Fellowship'] },
    { name: 'Gandalf',         faction: 'wizard', type: 'mage', health: 30, attack: 1.3, range: 1, cost: 3, attackSpeed: 0.9, maxMana: 80, manaPerAttack: 10, moveSpeed: 0.8, traits: ['Wizard', 'Fellowship'] }
];


// Enemy units for initial testing (also updated with traits)
const enemyUnits = [
    { name: 'Harad', faction: 'harad', type: 'tank', health: 40, attack: 1, range: 1, attackSpeed: 1, maxMana: 100, manaPerAttack: 10, moveSpeed: 0.7, traits: ['Isengard', 'Royalty'] },
    { name: 'Haradrim', faction: 'harad', type: 'melee', health: 25, attack: 1.3, range: 1, attackSpeed: 1.0, maxMana: 90, manaPerAttack: 15, moveSpeed: 1.4, traits: ['Harad', 'Cavalry'] },
    { name: 'Hara', faction: 'harad', type: 'archer', health: 25, attack: 1.3, range: 5, attackSpeed: 1.0, maxMana: 90, manaPerAttack: 15, moveSpeed: 1.4, traits: ['Harad', 'Cavalry'] },

    { name: 'Goblin', faction: 'evil', type: 'archer', health: 12, attack: 0.9, range: 8, attackSpeed: 1.1, maxMana: 150, manaPerAttack: 16, moveSpeed: 0.7, traits: ['Isengard', 'Royalty'] },
    { name: 'Gobli', faction: 'evil', type: 'melee', health: 10, attack: 0.7, range: 1, attackSpeed: 0.7, maxMana: 50, manaPerAttack: 8, moveSpeed: 0.8, traits: ['Goblin', 'Scavenger'] },

    { name: 'Orc', faction: 'mordor', type: 'melee', health: 20, attack: 1.1, range: 1, attackSpeed: 0.9, maxMana: 60, manaPerAttack: 10, moveSpeed: 0.8, traits: ['Mordor', 'Warrior'] },
    { name: 'Orc', faction: 'mordor', type: 'archer', health: 12, attack: 1.0, range: 6, attackSpeed: 1.0, maxMana: 120, manaPerAttack: 14, moveSpeed: 0.8, traits: ['Mordor', 'Ranger'] },
    /* Isengard */
    { name: 'Uruk-Hai', faction: 'isengard', type: 'melee', health: 25, attack: 1.5, range: 1, attackSpeed: 1.2, maxMana: 80, manaPerAttack: 12, moveSpeed: 1.0, traits: ['Isengard', 'Berserker'] },
    { name: 'Uruk', faction: 'isengard', type: 'tank', health: 50, attack: 0.9, range: 1, attackSpeed: 0.7, maxMana: 100, manaPerAttack: 14, moveSpeed: 0.9, traits: ['Isengard', 'Defender'] },
    { name: 'Saruman', faction: 'isengard', type: 'tank', health: 50, attack: 0.9, range: 1, attackSpeed: 0.7, maxMana: 100, manaPerAttack: 14, moveSpeed: 0.9, traits: ['Isengard', 'Defender'] },
    { name: 'crackhead', faction: 'isengard', type: 'tank', health: 50, attack: 0.9, range: 1, attackSpeed: 0.7, maxMana: 100, manaPerAttack: 14, moveSpeed: 0.9, traits: ['Isengard', 'Defender'] },

    
    { name: 'Easterling Tank', faction: 'east', type: 'tank', health: 22, attack: 1.0, range: 1, attackSpeed: 0.9, maxMana: 100, manaPerAttack: 12, moveSpeed: 1.0, traits: ['East', 'Spearman'] }
     
];
// Create a unit element with all properties
function createUnitElement(unitData, container, isShop = false) {
    const unit = document.createElement('div');
    unit.className = `unit ${unitData.faction} ${unitData.type}`;
    unit.dataset.name = unitData.name;
    unit.dataset.faction = unitData.faction;
    unit.dataset.type = unitData.type;
    unit.dataset.health = unitData.health;
    unit.dataset.maxHealth = unitData.health;// NOT AN ERROR? Max hp and cur hp work!? 0.0
    unit.dataset.attack = unitData.attack;
    unit.dataset.range = unitData.range;
    unit.dataset.moveSpeed = unitData.moveSpeed || 1.0; // Default to 1.0 if not specified
    
    // Add mana and attack speed properties
    unit.dataset.attackSpeed = unitData.attackSpeed || 1.0;
    unit.dataset.attackTimer = 0; // Will track time until next attack
    unit.dataset.maxMana = unitData.maxMana || 100;
    unit.dataset.mana = 0; // Start with 0 mana
    unit.dataset.manaPerAttack = unitData.manaPerAttack || 10;
    
    if (unitData.isEnemy) { unit.dataset.isEnemy = 'true'; }
    
    if (isShop) {
        unit.dataset.cost = unitData.cost;
        unit.title = `${unitData.name} (${unitData.cost} Gold)`;
    } else { unit.title = unitData.name; }
    
    // Add unit name above the unit
    const unitName = document.createElement('div');
    unitName.className = 'unit-name';
    unitName.textContent = unitData.name;
    unitName.style.position = 'absolute';
    unitName.style.top = '-2px';
    unitName.style.left = '61%';
    unitName.style.transform = 'translateX(-50%)';
    unitName.style.fontSize = '10px';
    unitName.style.color = '#fff';
    unitName.style.fontWeight = 'normal';

    // Add health bar
    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    healthBar.style.position = 'absolute';
    healthBar.style.bottom = '0';
    healthBar.style.left = '0';
    healthBar.style.width = '100%';
    healthBar.style.height = '4px';
    healthBar.style.backgroundColor = '#333';
    
    const healthFill = document.createElement('div');
    healthFill.className = 'health-fill';
    healthFill.style.width = '100%';
    healthFill.style.height = '100%';
    healthFill.style.backgroundColor = '#3f3';
    
    healthBar.appendChild(healthFill);
    
    // Add mana bar
    const manaBar = document.createElement('div');
    manaBar.className = 'mana-bar';
    manaBar.style.position = 'absolute';
    manaBar.style.bottom = '5px';
    manaBar.style.left = '0';
    manaBar.style.width = '100%';
    manaBar.style.height = '3px';
    manaBar.style.backgroundColor = '#333';
    
    const manaFill = document.createElement('div');
    manaFill.className = 'mana-fill';
    manaFill.style.width = '0%'; // Start empty
    manaFill.style.height = '100%';
    manaFill.style.backgroundColor = '#33f'; // Blue for mana
    
    manaBar.appendChild(manaFill);
    
    unit.appendChild(unitName);
    unit.appendChild(healthBar);
    unit.appendChild(manaBar);
    
    container.appendChild(unit);
    
    return unit;
}

// Get random unit data from unit types
function getRandomUnitData() {
    return unitTypes[Math.floor(Math.random() * unitTypes.length)];
}

// Export objects and functions for other modules
window.UnitInfo = {
    unitTypes,
    enemyUnits,
    createUnitElement,
    getRandomUnitData
};