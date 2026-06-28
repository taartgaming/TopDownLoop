import { Scene, Label, vec, Font, Color, TextAlign, Keys, Buttons, Actor } from 'excalibur';
import { GameState } from './gamestate.js';
import { Resources } from './resources.js';
import { Player } from './player.js';

export class MenuScene extends Scene {
    playersLabel;
    continueButton;

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

        const bestScoreText = `High Score: ${GameState.bestScore || 0}`;
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

        const startButton = new Actor({
            pos: vec(1280 / 2, 520),
            width: 300,
            height: 60
        });
        startButton.graphics.use(new Label({
            text: 'New Game',
            pos: vec(1280 / 2, 520),
            font: new Font({
                family: 'sans-serif', size: 40, color: Color.Green, textAlign: TextAlign.Center,
            })
        }));
        startButton.on('pointerup', () => this.engine.goToScene('SaveSlotScene', { isNewGame: true }));
        this.add(startButton);

        this.continueButton = new Actor({
            pos: vec(1280 / 2, 600),
            width: 300,
            height: 60
        });
        const continueLabel = new Label({
            text: 'Continue',
            pos: vec(1280 / 2, 600),
            font: new Font({
                family: 'sans-serif', size: 40, color: Color.Gray, textAlign: TextAlign.Center
            })
        })
        this.continueButton.graphics.use(continueLabel);
        this.continueButton.on('pointerup', () => this.onContinue());
        this.add(this.continueButton);

        this.updateContinueButton();
    }

    /**
     * Checks for input to start the game or change player count.
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

        if (engine.input.keyboard.wasPressed(Keys.Space) || (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.Face1))) {
            this.engine.goToScene('SaveSlotScene', { isNewGame: true });
        }

        if (engine.input.keyboard.wasPressed(Keys.C) || (gamepad && gamepad.connected && gamepad.wasButtonPressed(Buttons.Face2))) {
            this.onContinue();
        }
    }

    onContinue() {
        if (this.hasAnySave()) {
            this.engine.goToScene('SaveSlotScene', { isNewGame: false, hasSaves: true });
        }
    }

    hasAnySave() {
        for (let i = 0; i < 4; i++) {
            if (localStorage.getItem(`saveGame_${i}`)) return true;
        }
        return false;
    }

    updateContinueButton() {
        const label = this.continueButton.graphics.current;
        if (label instanceof Label) {
            label.color = this.hasAnySave() ? Color.Cyan : Color.Gray;
        }
    }
}