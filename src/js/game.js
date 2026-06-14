import '../css/style.css'
import { Engine, DisplayMode } from "excalibur"
import { ResourceLoader, Resources } from './resources.js'
import { Player } from './player.js'
import { generateRandomLevel } from './levelgenerator.js'
import { createMinimap } from './minimap.js'
import { Shadow } from './shadow.js'
import { DeathRealmScene } from './deathrealmscene.js'
import { ArenaScene } from './arenascene.js'

export class Game extends Engine {
    player;
    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
         })
        this.addScene('ArenaScene', new ArenaScene())
        this.addScene('DeathRealmScene', new DeathRealmScene())
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        console.log("start de game!")
        this.goToScene('ArenaScene');
    }

}

new Game()
