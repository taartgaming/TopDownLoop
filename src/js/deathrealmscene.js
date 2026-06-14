import { Scene, Label, vec, Font, Color, TextAlign, ScreenElement, Rectangle, Text, Actor } from 'excalibur';
import { GameState, ALL_RULES } from './gamestate.js';

export class DeathRealmScene extends Scene {
    onActivate(context) {
        this.clear();

        // Display Title
        const title = new Label({
            text: `Death Realm - Choose a new Rule (Points: ${GameState.points})`,
            pos: vec(1280 / 2, 100),
            font: new Font({
                family: 'sans-serif',
                size: 40,
                color: Color.White,
                textAlign: TextAlign.Center
            })
        });
        this.add(title);

        // Filter out rules that the player already has
        const availableRules = ALL_RULES.filter(r => !GameState.hasRule(r.id));
        
        // Shuffle and pick up to 3 rules
        availableRules.sort(() => Math.random() - 0.5);
        const choices = availableRules.slice(0, 3);

        const cardWidth = 300;
        const cardHeight = 400;
        const gapX = 350;
        
        // Center the whole group of cards on the screen
        const startX = (1280 / 2) - (((choices.length - 1) * gapX) / 2) - (cardWidth / 2);

        choices.forEach((rule, index) => {
            const card = new ScreenElement({
                x: startX + (index * gapX),
                y: (720 / 2) - (cardHeight / 2) + 50,
                width: cardWidth,
                height: cardHeight
            });

            const bgRect = new Rectangle({
                width: cardWidth,
                height: cardHeight,
                color: new Color(40, 40, 40),
                strokeColor: Color.White,
                thickness: 2
            });
            card.graphics.use(bgRect);

            // Rule Name Label
            const titleLabel = new Label({
                text: rule.name,
                pos: vec(cardWidth / 2, 50),
                font: new Font({
                    family: 'sans-serif',
                    size: 30,
                    color: Color.Red,
                    textAlign: TextAlign.Center,
                    bold: true
                })
            });
            card.addChild(titleLabel);

            // Rule Description Text 
            const descText = new Text({
                text: rule.description,
                maxWidth: 260,
                font: new Font({
                    family: 'sans-serif',
                    size: 18,
                    color: Color.LightGray,
                    textAlign: TextAlign.Center
                })
            });
            
            // Wrap the text graphic in a standard actor child
            const descActor = new Actor({ x: cardWidth / 2, y: 130 });
            descActor.graphics.use(descText);
            card.addChild(descActor);
            
            const canAfford = GameState.points >= rule.cost;
            const costLabel = new Label({
                text: `Cost: ${rule.cost} pts`,
                pos: vec(cardWidth / 2, cardHeight - 40),
                font: new Font({
                    family: 'sans-serif',
                    size: 22,
                    color: canAfford ? Color.Yellow : Color.Red,
                    textAlign: TextAlign.Center,
                    bold: true
                })
            });
            card.addChild(costLabel);

            // Interactive Hover & Click Events
            card.on('pointerenter', () => {
                if(canAfford) bgRect.color = new Color(70, 70, 70); 
            });
            card.on('pointerleave', () => {
                bgRect.color = new Color(40, 40, 40); 
            });
            
            card.on('pointerup', () => {
                if (canAfford) {
                    GameState.points -= rule.cost;
                    GameState.activeRules.push(rule.id);
                    console.log(`Rule added: ${rule.name}. Current active rules:`, GameState.activeRules);
                    
                    context.engine.goToScene('ArenaScene'); 
                }
            });

            this.add(card);
        });
        
        const skipBtn = new ScreenElement({
            x: 1280 / 2 - 100,
            y: 650,
            width: 200,
            height: 50
        });
        const skipBg = new Rectangle({
            width: 200, height: 50, color: Color.DarkGray
        });
        skipBtn.graphics.use(skipBg);
        skipBtn.addChild(new Label({
            text: 'Skip / Continue',
            pos: vec(100, 25),
            font: new Font({ family: 'sans-serif', size: 20, color: Color.White, textAlign: TextAlign.Center })
        }));
        skipBtn.on('pointerenter', () => skipBg.color = Color.Gray);
        skipBtn.on('pointerleave', () => skipBg.color = Color.DarkGray);
        skipBtn.on('pointerup', () => {
            context.engine.goToScene('ArenaScene');
        });
        this.add(skipBtn);
    }
}