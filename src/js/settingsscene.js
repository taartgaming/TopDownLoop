import { Scene, Label, vec, Font, Color, TextAlign, Actor, Keys } from 'excalibur';
import { GameSettings } from './gamesettings.js';
import { Resources } from './resources.js';

export class SettingsScene extends Scene {
    musicVolumeLabel;
    sfxVolumeLabel;
    selectedOption = 'music';

    onInitialize(engine) {
        const background = new Actor({
            pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: new Color(0, 0, 0, 0.7)
        });
        this.add(background);

        const title = new Label({
            text: 'Settings',
            pos: vec(engine.halfDrawWidth, 100),
            font: new Font({ family: 'sans-serif', size: 60, color: Color.White, textAlign: TextAlign.Center })
        });
        this.add(title);

        // Volume Controls
        this.createMusicVolumeSlider();
        this.createSfxVolumeSlider();

        const backButton = new Label({
            text: 'Back (Esc)',
            pos: vec(engine.halfDrawWidth, 600),
            font: new Font({ family: 'sans-serif', size: 40, color: Color.Green, textAlign: TextAlign.Center })
        });
        backButton.on('pointerup', () => this.engine.goToScene('PauseScene'));
        this.add(backButton);
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Escape)) {
            this.engine.goToScene('PauseScene');
        }

        if (engine.input.keyboard.wasPressed(Keys.Up) || engine.input.keyboard.wasPressed(Keys.Down)) {
            this.selectedOption = this.selectedOption === 'music' ? 'sfx' : 'music';
            this.updateSelector();
        }

        if (this.selectedOption === 'music') {
            if (engine.input.keyboard.isHeld(Keys.Left)) {
                GameSettings.musicVolume = Math.max(0, GameSettings.musicVolume - 0.01);
            }
            if (engine.input.keyboard.isHeld(Keys.Right)) {
                GameSettings.musicVolume = Math.min(1, GameSettings.musicVolume + 0.01);
            }
            this.musicVolumeLabel.text = `Music Volume: ${Math.round(GameSettings.musicVolume * 100)}%`;
            if (Resources.bgMusic) {
                Resources.bgMusic.volume = GameSettings.musicVolume;
            }
        } else { // sfx
            if (engine.input.keyboard.isHeld(Keys.Left)) {
                GameSettings.sfxVolume = Math.max(0, GameSettings.sfxVolume - 0.01);
            }
            if (engine.input.keyboard.isHeld(Keys.Right)) {
                GameSettings.sfxVolume = Math.min(1, GameSettings.sfxVolume + 0.01);
            }
            this.sfxVolumeLabel.text = `SFX Volume: ${Math.round(GameSettings.sfxVolume * 100)}%`;
        }

        if (engine.input.keyboard.wasReleased(Keys.Left) || engine.input.keyboard.wasReleased(Keys.Right)) {
            GameSettings.save();
            if (this.selectedOption === 'sfx') {
                Resources.hitSound.play(GameSettings.sfxVolume); // Play a sound to test
            }
        }
    }

    createMusicVolumeSlider() {
        this.musicVolumeLabel = new Label({
            text: `Music Volume: ${Math.round(GameSettings.musicVolume * 100)}%`,
            pos: vec(this.engine.halfDrawWidth, 250),
            font: new Font({ family: 'sans-serif', size: 32, color: Color.White, textAlign: TextAlign.Center })
        });
        this.add(this.musicVolumeLabel);

        const instructions = new Label({
            text: '< Use Up/Down to Select, Left/Right to Adjust >',
            pos: vec(this.engine.halfDrawWidth, 450),
            font: new Font({ family: 'sans-serif', size: 24, color: Color.Yellow, textAlign: TextAlign.Center })
        });
        this.add(instructions);
        this.updateSelector();
    }

    createSfxVolumeSlider() {
        this.sfxVolumeLabel = new Label({
            text: `SFX Volume: ${Math.round(GameSettings.sfxVolume * 100)}%`,
            pos: vec(this.engine.halfDrawWidth, 350),
            font: new Font({ family: 'sans-serif', size: 32, color: Color.White, textAlign: TextAlign.Center })
        });
        this.add(this.sfxVolumeLabel);
    }

    updateSelector() {
        if (this.selectedOption === 'music') {
            this.musicVolumeLabel.color = Color.Yellow;
            this.sfxVolumeLabel.color = Color.White;
        } else {
            this.musicVolumeLabel.color = Color.White;
            this.sfxVolumeLabel.color = Color.Yellow;
        }
    }
}