import { Scene, Label, vec, Font, Color, TextAlign, ScreenElement, Rectangle, Text, Actor, Buttons, Keys, Vector, BaseAlign } from 'excalibur';
import { GameState, ALL_RULES } from './gamestate.js';

export class DeathRealmScene extends Scene {
    /**
     * Activates the death realm scene, offering the player a choice of rules
     * to purchase using points earned during their run.
     */
    onActivate(context) {
        this.clear();

        const title = new Label({
            text: `You are Dead!`,
            pos: vec(1280 / 2, 100),
            font: new Font({
                family: 'sans-serif',
                size: 40,
                color: Color.White,
                textAlign: TextAlign.Center
            })
        });
        this.add(title);

        // Calculate score multiplier
        const baseScore = GameState.points;
        const multiplier = 1 + (GameState.activeRules.length * 0.1);
        const finalScore = Math.floor(baseScore * multiplier);
        GameState.highScore = finalScore; // Set the final score for this run
        GameState.updateAndSaveHighScore();

        const scoreText = new Label({
            text: `Run Score: ${finalScore}\n(Points: ${baseScore} x${multiplier.toFixed(1)} Multiplier)`,
            pos: new Vector(1280 - 20, 20),
            font: new Font({
                family: 'sans-serif', size: 24, color: Color.Yellow, textAlign: TextAlign.Right
            }),
            baseAlign: BaseAlign.Top
        });
        this.add(scoreText);

        const pointsTitle = new Label({
            text: `Available Points: ${GameState.points}`,
            pos: vec(20, 20),
            font: new Font({
                family: 'sans-serif', size: 24, color: Color.White, textAlign: TextAlign.Left
            }),
            baseAlign: BaseAlign.Top
        });
        this.add(pointsTitle);

        const availableRules = ALL_RULES.filter(r => !GameState.hasRule(r.id));
        // Simple logic to offer one positive and two negative rules
        const positiveRules = availableRules.filter(r => r.isPositive);
        positiveRules.sort(() => Math.random() - 0.5);
        const negativeRules = availableRules.filter(r => !r.isPositive);
        negativeRules.sort(() => Math.random() - 0.5);

        const choices = [];
        if (positiveRules.length > 0) {
            choices.push(positiveRules[0]);
        }
        choices.push(...negativeRules.slice(0, Math.max(0, 3 - choices.length)));

        const cardWidth = 300;
        const cardHeight = 400;
        const gapX = 350;
        
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

            let buttonName = '';
            let buttonCode = null;
            let keyCode = null;
            if (index === 0) { buttonName = 'X'; buttonCode = Buttons.Face3; keyCode = Keys.X; }
            if (index === 1) { buttonName = 'Y'; buttonCode = Buttons.Face4; keyCode = Keys.Y; }
            if (index === 2) { buttonName = 'B'; buttonCode = Buttons.Face2; keyCode = Keys.B; }

            if (buttonName) {
                const btnLabel = new Label({
                    text: `[ ${buttonName} ]`,
                    pos: vec(cardWidth / 2, 20),
                    font: new Font({ family: 'sans-serif', size: 24, color: Color.Cyan, textAlign: TextAlign.Center, bold: true })
                });
                card.addChild(btnLabel);
            }

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
            
            const descActor = new Actor({ x: cardWidth / 2, y: 130, anchor: vec(0, 0) });
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
                    GameState.save(context.engine.currentScene.players);
                    console.log(`Rule added: ${rule.name}. Current active rules:`, GameState.activeRules);
                    
                    context.engine.goToScene('ArenaScene'); 
                }
            });

            card.on('preupdate', (evt) => {
                const engine = evt.engine;
                const gamepad = engine.input.gamepads.at(0);
                let pressed = false;
                
                if (keyCode && engine.input.keyboard.wasPressed(keyCode)) pressed = true;
                if (buttonCode !== null && gamepad && gamepad.connected && gamepad.wasButtonPressed(buttonCode)) pressed = true;

                if (pressed && canAfford) {
                    GameState.points -= rule.cost;
                    GameState.activeRules.push(rule.id);
                    GameState.save(engine.currentScene.players);
                    console.log(`Rule added: ${rule.name}. Current active rules:`, GameState.activeRules);
                    engine.goToScene('ArenaScene'); 
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
            text: '[A] Skip / Continue',
            pos: vec(100, 25),
            font: new Font({ family: 'sans-serif', size: 20, color: Color.White, textAlign: TextAlign.Center })
        }));
        skipBtn.on('pointerenter', () => skipBg.color = Color.Gray);
        skipBtn.on('pointerleave', () => skipBg.color = Color.DarkGray);
        skipBtn.on('pointerup', () => {
            context.engine.goToScene('ArenaScene');
        });
        skipBtn.on('preupdate', (evt) => {
            const engine = evt.engine;
            const gamepad = engine.input.gamepads.at(0);
            let pressed = false;
            
            if (engine.input.keyboard.wasPressed(Keys.Space) || engine.input.keyboard.wasPressed(Keys.Enter)) pressed = true;
            if (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.Face1)) pressed = true;
            
            if (pressed) {
                engine.goToScene('ArenaScene');
            }
        });
        this.add(skipBtn);
    }
}