

export const ALL_RULES = [
    { id: 'UNDEAD', name: 'Undead', description: 'Enemies occasionally resurrect after being killed.', cost: 10 },
    { id: 'UNLUCK', name: 'Unluck', description: 'Your critical hit chance drops to zero. Enemies deal random criticals.', cost: 15 },
    { id: 'UNCHANGING', name: 'Unchange', description: 'Obstacles and walls become completely indestructible.', cost: 20 },
    { id: 'UNMOVE', name: 'Unmove', description: 'Standing still for too long slowly drains your health.', cost: 15 },
    { id: 'UNSEEN', name: 'Unseen', description: 'Enemies turn invisible when outside a close radius.', cost: 25 },
    { id: 'UNTOUCHABLE', name: 'Untouchable', description: 'Enemies gain a temporary forcefield when they spawn.', cost: 30 },
    { id: 'UNSTOPPABLE', name: 'Unstoppable', description: 'Enemies are immune to knockback and slowing effects.', cost: 40 },
    { id: 'UNBREAKABLE', name: 'Unbreakable', description: 'Enemy armor is doubled, greatly increasing their health.', cost: 50 },
    { id: 'UNFADE', name: 'Unfade', description: 'Enemies do not despawn or lose aggro if they wander far away.', cost: 35 },
    { id: 'UNBURN', name: 'Unburn', description: 'Fire rules or weapons deal zero damage to enemies.', cost: 20 },
    { id: 'FIRE', name: 'Burn', description: 'Certain enemies leave a dangerous trail of fire.', cost: 25 },
    { id: 'POISON', name: 'Decay', description: 'A toxic aura surrounds the most powerful enemies.', cost: 30 }
];

export const GameState = {
    currentLoop: 1,
    currentWave: 1,
    activeRules: [], 
    maxLoops: 101,

    hasRule(rule) {
        return this.activeRules.includes(rule);
    },

    triggerDeathLoop() {
        this.currentLoop++;
        this.currentWave = 1;
    }
};