import { ScreenElement, Label, vec, Font, Color } from 'excalibur';
import { GameState, ALL_RULES } from './gamestate.js';

export class UI extends ScreenElement{
    constructor() {
        super({ x: 0, y: 0, z: 999 });   
    }
    
    onInitialize(engine) {
        this.healthLabel = new Label({
            text: 'Lives: ',
            pos: vec(20, 30),
            font: new Font({ size: 24, color: Color.White, family: 'sans-serif' })
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
        this.rulesLabel = new Label({
            text: 'Active Rules:\nNone',
            pos: vec(20, 70),
            font: new Font({ size: 16, color: Color.Yellow, family: 'sans-serif' })
        });

        this.addChild(this.healthLabel);
        this.addChild(this.waveLabel);
        this.addChild(this.loopLabel);
        this.addChild(this.rulesLabel);
    }

    onPreUpdate(engine) {
        const player = engine.currentScene.player;
        if (player) {
            let healthText = '';
            for(let i = 0; i < player.health; i++) healthText += '❤️';
            this.healthLabel.text = `Lives: ${healthText}`;
        }
        
        this.waveLabel.text = `Wave: ${GameState.currentWave}`;
        this.loopLabel.text = `Loop: ${GameState.currentLoop}`;
        
        const activeRuleNames = GameState.activeRules.map(ruleId => {
            const rule = ALL_RULES.find(r => r.id === ruleId);
            return rule ? rule.name : ruleId;
        });
        this.rulesLabel.text = `Active Rules:\n${activeRuleNames.length > 0 ? activeRuleNames.join('\n') : 'None'}`;
    }
}