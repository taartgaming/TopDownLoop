import '../css/style.css'
import { Engine, DisplayMode } from "excalibur"
import { ResourceLoader, Resources } from './resources.js'
import { Player } from './player.js'
import { generateRandomLevel } from './levelgenerator.js'
import { createMinimap } from './minimap.js'
import { Shadow } from './shadow.js'
import { DeathRealmScene } from './deathrealmscene.js'
import { ArenaScene } from './arenascene.js'
import { MenuScene } from './menuscene.js'
import { PauseScene } from './pausescene.js'
import { GameSettings } from './gamesettings.js';
import { SettingsScene } from './settingsscene.js'
import { SaveSlotScene } from './saveslotscene.js';

export class Game extends Engine {
    player;
    /**
     * Initializes the Excalibur Engine, registers scenes, and starts the resource loader.
     */
    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
        })
        GameSettings.load(); // Load settings at the start
        this.addScene('MenuScene', new MenuScene())
        this.addScene('ArenaScene', new ArenaScene())
        this.addScene('PauseScene', new PauseScene())
        this.addScene('SettingsScene', new SettingsScene())
        this.addScene('SaveSlotScene', new SaveSlotScene())
        this.addScene('DeathRealmScene', new DeathRealmScene())
        this.start(ResourceLoader).then(() => this.startGame())
    }

    /**
     * Triggers the transition to the menu scene once initialization and loading is complete.
     */
    startGame() {
        console.log("start de game!")
        this.goToScene('MenuScene');
        
    }

}

new Game()
