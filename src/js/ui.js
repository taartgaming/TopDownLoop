import { ScreenElement, Label, vec, Font, Color } from 'excalibur';
import { GameState, ALL_RULES } from './gamestate.js';

export class UI extends ScreenElement{
    /**
     * Sets up the UI container to display overlaid information for the user.
     */
    constructor() {
        super({ x: 0, y: 0, z: 999 });   
    }
    
    /**
     * Configures the labels for lives, wave, loops, points, and active rules.
     */
    onInitialize(engine) {
        this.healthLabel = new Label({
            text: 'Lives: ',
            pos: vec(20, 140),
            font: new Font({ size: 24, color: Color.White, family: 'sans-serif' })
        });
        this.manaLabel = new Label({
            text: 'Mana: 100/100',
            pos: vec(20, 175),
            font: new Font({ size: 24, color: Color.Cyan, family: 'sans-serif' })
        });
        this.waveLabel = new Label({
            text: 'Wave: 1',
            pos: vec(1280 / 2 - 50, 30),
            font: new Font({ size: 24, color: Color.White, family: 'sans-serif' })
        });
        this.loopLabel = new Label({
            text: 'Loop: 1',
            pos: vec(1280 - 150, 30),
            font: new Font({ size: 24, color: Color.White, family: 'sans-serif' })
        });
        this.pointsLabel = new Label({
            text: 'Points: 0',
            pos: vec(1280 - 150, 70),
            font: new Font({ size: 24, color: Color.Yellow, family: 'sans-serif' })
        });
        this.rulesLabel = new Label({
            text: 'Active Rules:\nNone',
            pos: vec(20, 210),
            font: new Font({ size: 16, color: Color.Yellow, family: 'sans-serif' })
        });

        this.addChild(this.healthLabel);
        this.addChild(this.waveLabel);
        this.addChild(this.loopLabel);
        this.addChild(this.pointsLabel);
        this.addChild(this.manaLabel);
        this.addChild(this.rulesLabel);
    }

    /**
     * Updates the UI text elements to reflect the current GameState data on every frame.
     */
    onPreUpdate(engine) {
        const players = engine.currentScene.players;
        if (players) {
            let healthText = '';
            let manaText = '';
            players.forEach((p, idx) => {
                if (!p.isDead) {
                    healthText += `P${idx+1}: ${'❤️'.repeat(p.health)}   `;
                    manaText += `P${idx+1}: ${Math.floor(p.mana)}/${p.maxMana}   `;
                } else {
                    healthText += `P${idx+1}: DEAD   `;
                    manaText += `P${idx+1}: 0/${p.maxMana}   `;
                }
            });
            this.healthLabel.text = healthText;
            this.manaLabel.text = manaText;
        }
        
        this.waveLabel.text = `Wave: ${GameState.currentWave}`;
        this.loopLabel.text = `Loop: ${GameState.currentLoop}`;
        this.pointsLabel.text = `Points: ${GameState.points}`;
        
        const activeRuleNames = GameState.activeRules.map(ruleId => {
            const rule = ALL_RULES.find(r => r.id === ruleId);
            return rule ? rule.name : ruleId;
        });
        this.rulesLabel.text = `Active Rules:\n${activeRuleNames.length > 0 ? activeRuleNames.join('\n') : 'None'}`;
    }
}