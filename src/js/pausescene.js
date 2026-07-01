import { Scene, Label, vec, Font, Color, TextAlign, Keys, Actor } from 'excalibur';

export class PauseScene extends Scene {
    onInitialize(engine) {
        const background = new Actor({
            pos: vec(engine.halfDrawWidth, engine.halfDrawHeight),
            width: engine.drawWidth,
            height: engine.drawHeight,
            color: new Color(0, 0, 0, 0.5)
        });
        this.add(background);

        const pauseLabel = new Label({
            text: 'Paused',
            pos: vec(engine.halfDrawWidth, 200),
            font: new Font({
                family: 'sans-serif',
                size: 60,
                color: Color.White,
                textAlign: TextAlign.Center
            })
        });
        this.add(pauseLabel);

        const resumeButton = new Label({
            text: 'Resume (Esc)',
            pos: vec(engine.halfDrawWidth, 350),
            font: new Font({
                family: 'sans-serif',
                size: 40,
                color: Color.Green,
                textAlign: TextAlign.Center
            })
        });
        resumeButton.on('pointerup', () => this.resumeGame());
        this.add(resumeButton);

        const settingsButton = new Label({
            text: 'Settings',
            pos: vec(engine.halfDrawWidth, 450),
            font: new Font({
                family: 'sans-serif',
                size: 40,
                color: Color.Yellow,
                textAlign: TextAlign.Center
            })
        });
        settingsButton.on('pointerup', () => this.engine.goToScene('SettingsScene'));
        this.add(settingsButton);

        const menuButton = new Label({
            text: 'Main Menu',
            pos: vec(engine.halfDrawWidth, 550),
            font: new Font({
                family: 'sans-serif',
                size: 40,
                color: Color.Red,
                textAlign: TextAlign.Center
            })
        });
        menuButton.on('pointerup', () => this.engine.goToScene('MenuScene'));
        this.add(menuButton);
    }

    resumeGame() {
        this.engine.goToScene('ArenaScene');
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Escape)) {
            this.resumeGame();
        }
    }
}