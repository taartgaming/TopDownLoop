import { Scene, Label, vec, Font, Color, TextAlign, Actor, Rectangle, Keys } from 'excalibur';
import { GameState } from './gamestate.js';

export class SaveSlotScene extends Scene {
    isNewGame;
    hasSaves;

    onActivate(context) {
        this.isNewGame = context.data?.isNewGame;
        this.hasSaves = context.data?.hasSaves;
        this.clear();
        this.createUI();
    }

    createUI() {
        const titleText = this.isNewGame ? 'Select a Slot for Your New Game' : (this.hasSaves ? 'Select a Game to Continue' : 'No Saved Games Found');
        const title = new Label({
            text: titleText,
            pos: vec(this.engine.halfDrawWidth, 100),
            font: new Font({
                family: 'sans-serif', size: 40, color: Color.White, textAlign: TextAlign.Center
            })
        });
        this.add(title);

        for (let i = 0; i < 4; i++) {
            this.createSlotButton(i);
        }

        if (!this.isNewGame && !this.hasSaves) {
            const newGameButton = new Label({
                text: 'Start a New Game',
                pos: vec(this.engine.halfDrawWidth, 450),
                font: new Font({
                    family: 'sans-serif', size: 30, color: Color.Green, textAlign: TextAlign.Center
                })
            });
            newGameButton.on('pointerup', () => {
                this.isNewGame = true;
                this.createUI(); // Redraw UI for new game
            });
            this.add(newGameButton);
        }

        const backButton = new Label({
            text: 'Back to Main Menu',
            pos: vec(this.engine.halfDrawWidth, 650),
            font: new Font({
                family: 'sans-serif', size: 30, color: Color.Yellow, textAlign: TextAlign.Center
            })
        });
        backButton.on('pointerup', () => this.engine.goToScene('MenuScene'));
        this.add(backButton);
    }

    createSlotButton(slotIndex) {
        const slotWidth = 400;
        const slotHeight = 80;
        const posX = this.engine.halfDrawWidth;
        const posY = 200 + slotIndex * 100;

        const savedData = this.getSlotData(slotIndex);

        const slotButton = new Actor({
            pos: vec(posX, posY),
            width: slotWidth,
            height: slotHeight,
            color: savedData ? new Color(50, 50, 100) : new Color(30, 30, 30)
        });

        let slotText;
        if (savedData) {
            slotText = `Slot ${slotIndex + 1}: Loop ${savedData.currentLoop}, Wave ${savedData.currentWave}`;
        } else {
            slotText = `Slot ${slotIndex + 1}: Empty`;
        }

        const label = new Label({
            text: slotText,
            font: new Font({
                family: 'sans-serif', size: 24, color: Color.White, textAlign: TextAlign.Center
            })
        });

        slotButton.graphics.use(label);

        slotButton.on('pointerup', () => this.onSlotSelected(slotIndex));

        this.add(slotButton);
    }

    getSlotData(slotIndex) {
        const data = localStorage.getItem(`saveGame_${slotIndex}`);
        return data ? JSON.parse(data) : null;
    }

    onSlotSelected(slotIndex) {
        GameState.saveSlot = slotIndex;
        const savedData = this.getSlotData(slotIndex);

        if (this.isNewGame) {
            this.startNewGame(slotIndex);
        } else {
            if (savedData) {
                this.continueGame(slotIndex);
            }
            // If no saved data, do nothing on click when not in new game mode
        }
    }

    startNewGame(slotIndex) {
        GameState.saveSlot = slotIndex;
        GameState.resetRun();
        this.engine.goToScene('ArenaScene');
    }

    continueGame(slotIndex) {
        const savedState = this.getSlotData(slotIndex);
        if (savedState) {
            GameState.currentLoop = savedState.currentLoop;
            GameState.currentWave = savedState.currentWave;
            GameState.points = savedState.points;
            GameState.highScore = savedState.highScore;
            GameState.activeRules = savedState.activeRules;
            GameState.numPlayers = savedState.numPlayers;
            GameState.saveSlot = savedState.saveSlot;

            this.engine.goToScene('ArenaScene', {
                loadSave: true,
                playerData: savedState.playerData
            });
        }
    }
}