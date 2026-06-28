

export const ALL_RULES = [
    // Negative Rules (Detrimental to player)
    { id: 'DEAD', name: 'Dead', description: 'Enemies have a 20% chance to resurrect once upon death.', cost: 10, isPositive: false },
    { id: 'LUCK', name: 'Luck', description: 'Enemies have a 20% chance to deal double damage on their attacks.', cost: 15, isPositive: false },
    { id: 'CHANGING', name: 'Changing', description: 'Destructible obstacles and walls become completely indestructible.', cost: 20, isPositive: false },
    { id: 'MOVE', name: 'Move', description: 'Standing still for more than 2 seconds will damage you.', cost: 15, isPositive: false },
    { id: 'SEEN', name: 'Seen', description: 'Enemies become invisible when they are far away from any player.', cost: 25, isPositive: false },
    { id: 'TOUCHABLE', name: 'Touchable', description: 'Enemies are invulnerable for 3 seconds after spawning.', cost: 30, isPositive: false },
    { id: 'BREAKABLE', name: 'Breakable', description: 'All enemies spawn with double their normal health.', cost: 50, isPositive: false },
    { id: 'FADE', name: 'Fade', description: 'Enemies do not despawn or lose aggro, no matter how far they wander.', cost: 35, isPositive: false },
    { id: 'BURN', name: 'Burn', description: 'Standard enemies leave a dangerous trail of fire on the ground.', cost: 25, isPositive: false },
    { id: 'POISON', name: 'Poison', description: 'Minibosses and Bosses are surrounded by a toxic aura that poisons nearby players.', cost: 30, isPositive: false },
    
    // Positive Rules (Beneficial to player)
    { id: 'UNLUCK', name: 'Un-Luck', description: 'You have a 10% chance to deal a critical hit for double damage.', cost: 15, isPositive: true },
    { id: 'UNCHANGING', name: 'Un-Changing', description: 'Your attacks can now destroy certain weak obstacles and walls.', cost: 20, isPositive: true },
    { id: 'UNMOVE', name: 'Un-Move', description: 'Standing still for 2 seconds will begin to rapidly regenerate your health.', cost: 15, isPositive: true },
    { id: 'UNSEEN', name: 'Un-Seen', description: 'You become invisible while standing still, causing most enemies to ignore you.', cost: 25, isPositive: true },
    { id: 'UNTOUCHABLE', name: 'Un-Touchable', description: 'You are invulnerable for 3 seconds after being hit.', cost: 30, isPositive: true },
    { id: 'UNSTOPPABLE', name: 'Un-Stoppable', description: 'Your magic projectiles pierce through enemies instead of being destroyed on impact.', cost: 40, isPositive: true },
    { id: 'UNDEAD', name: 'Undead', description: 'Your maximum health is doubled.', cost: 50, isPositive: true },
    { id: 'UNFADE', name: 'Un-Fade', description: 'Enemies that wander too far away from you will despawn.', cost: 35, isPositive: true },
    { id: 'UNBURN', name: 'Un-Burn', description: 'You are immune to all fire-based damage.', cost: 20, isPositive: true },
    { id: 'UNPOISON', name: 'Un-Poison', description: 'You are immune to all poison-based damage.', cost: 30, isPositive: true },
    { id: 'UNUSE', name: 'Un-Use', description: 'Your magic abilities no longer consume mana.', cost: 100, isPositive: true },
];

export const GameState = {
    currentLoop: 1,
    currentWave: 1,
    activeRules: [], 
    maxLoops: 101,
    points: 0,
    saveSlot: 0,
    numPlayers: 1,
    highScore: 0,
    bestScore: localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0,

    /**
     * Checks whether a specific rule string identifier is currently active.
     */
    hasRule(rule) {
        return this.activeRules.includes(rule);
    },

    /**
     * Advances the loop counter when the player dies and resets wave progression.
     */
    triggerDeathLoop() {
        this.currentLoop++;
        this.currentWave = 1; // Wave resets on death
        this.save();
    },
    
    /**
     * Compares and saves a new best score locally to the browser.
     */ // This seems to be for a low-score-is-better system, which might be what you want for "points"
    saveBestScore(score) {
        if (this.bestScore === null || score < this.bestScore) {
            this.bestScore = score;
            localStorage.setItem('bestScore', this.bestScore);
        }
    },
    
    /**
     * Updates and saves the high score if the current score is greater.
     */
    updateAndSaveHighScore() {
        if (this.highScore > this.bestScore) {
            this.bestScore = this.highScore;
            localStorage.setItem('bestScore', this.bestScore);
        }
    },

    /**
     * Resets the entire run progression including waves, loops, points, and rules.
     */
    resetRun() {
        this.currentLoop = 1;
        this.currentWave = 1;
        this.points = 0;
        this.highScore = 0;
        this.activeRules = [];
        this.clearSave();
    },

    /**
     * Saves the current game state to local storage.
     */
    save(players = []) {
        const playerData = players?.map(p => ({
            health: p.health,
            mana: p.mana,
            isDead: p.isDead
        }));

        const saveState = {
            currentLoop: this.currentLoop,
            currentWave: this.currentWave,
            points: this.points,
            highScore: this.highScore,
            activeRules: this.activeRules,
            numPlayers: this.numPlayers,
            playerData: playerData,
            saveSlot: this.saveSlot
        };
        localStorage.setItem(`saveGame_${this.saveSlot}`, JSON.stringify(saveState));
    },

    /**
     * Clears the saved game from local storage.
     */
    clearSave() {
        localStorage.removeItem(`saveGame_${this.saveSlot}`);
    }



};