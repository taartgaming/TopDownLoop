import { Scene, Label, vec, Font, Color, TextAlign, Keys } from 'excalibur';
import { GameState } from './gamestate.js';
import { Resources } from './resources.js';

export class MenuScene extends Scene {
    onActivate() {
        this.clear();
        
        // Ensure music isn't playing on the menu screen
        if (Resources.bgMusic.isPlaying()) {
            Resources.bgMusic.stop();
        }

        const title = new Label({
            text: 'Top Down Loop',
            pos: vec(1280 / 2, 200),
            font: new Font({
                family: 'sans-serif', size: 60, color: Color.White, textAlign: TextAlign.Center
            })
        });
        this.add(title);

        const bestLoopText = GameState.bestLoop ? `Best Run: Defeated Boss in ${GameState.bestLoop} Loops` : 'Best Run: None';
        const bestLoopLabel = new Label({
            text: bestLoopText,
            pos: vec(1280 / 2, 350),
            font: new Font({
                family: 'sans-serif', size: 30, color: Color.Yellow, textAlign: TextAlign.Center
            })
        });
        this.add(bestLoopLabel);

        const startLabel = new Label({
            text: 'Press SPACE to Start',
            pos: vec(1280 / 2, 500),
            font: new Font({
                family: 'sans-serif', size: 40, color: Color.Green, textAlign: TextAlign.Center
            })
        });
        this.add(startLabel);
    }

    onPreUpdate(engine) {
        // Wait for player to press Space, then jump straight into the Arena
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            GameState.resetRun();
            engine.goToScene('ArenaScene');
        }
    }
}