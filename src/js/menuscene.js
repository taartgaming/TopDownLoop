import { Scene, Label, vec, Font, Color, TextAlign, Keys, Buttons } from 'excalibur';
import { GameState } from './gamestate.js';
import { Resources } from './resources.js';
import { Player } from './player.js';

export class MenuScene extends Scene {
    playersLabel;

    /**
     * Activates the menu scene, resets the background music,
     * and displays the game title and high score.
     */
    onActivate() {
        this.clear();
        
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

        const bestScoreText = GameState.bestScore !== null ? `Best Score: ${GameState.bestScore} Pts (Lowest Wins)` : 'Best Score: None';
        const bestScoreLabel = new Label({
            text: bestScoreText,
            pos: vec(1280 / 2, 350),
            font: new Font({
                family: 'sans-serif', size: 30, color: Color.Yellow, textAlign: TextAlign.Center
            })
        });
        this.add(bestScoreLabel);

        this.playersLabel = new Label({
            text: `Players: ${GameState.numPlayers}  < Use Left/Right >`,
            pos: vec(1280 / 2, 430),
            font: new Font({
                family: 'sans-serif', size: 30, color: Color.Cyan, textAlign: TextAlign.Center
            })
        });
        this.add(this.playersLabel);

        const startLabel = new Label({
            text: 'Press SPACE or A to Start',
            pos: vec(1280 / 2, 520),
            font: new Font({
                family: 'sans-serif', size: 40, color: Color.Green, textAlign: TextAlign.Center
            })
        });
        this.add(startLabel);
    }

    /**
     * Checks for input to start the game and transition to the Arena.
     */
    onPreUpdate(engine) {
        let started = false;
        const gamepad = engine.input.gamepads.at(0);
        
        if (engine.input.keyboard.wasPressed(Keys.Left) || (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.DpadLeft))) {
            GameState.numPlayers = Math.max(1, GameState.numPlayers - 1);
            this.playersLabel.text = `Players: ${GameState.numPlayers}  < Use Left/Right >`;
        }
        
        if (engine.input.keyboard.wasPressed(Keys.Right) || (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.DpadRight))) {
            GameState.numPlayers = Math.min(4, GameState.numPlayers + 1); // Max 4 players
            this.playersLabel.text = `Players: ${GameState.numPlayers}  < Use Left/Right >`;
        }

        if (engine.input.keyboard.wasPressed(Keys.Space)) started = true;
        if (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.Face1)) started = true;
        
        if (started) {
            GameState.resetRun();
            engine.goToScene('ArenaScene');
        }
    }
}