import { Scene, Timer, vec, Color, Actor, CollisionType, Keys } from 'excalibur';
import { GameState } from './gamestate.js';
import { GameSettings } from './gamesettings.js';
import { Player } from './player.js'; 
import { Shadow } from './shadow.js';
import { generateRandomLevel } from './levelgenerator.js';
import { createMinimap } from './minimap.js';
import { Resources } from './resources.js';
import { UI } from './ui.js';

export class ArenaScene extends Scene {
    waveTimer;
    players;
    cameraTarget;

    /**
     * Initializes the scene, loads scenery, and sets up the main wave spawning timer.
     */
    onInitialize(engine) {
        this.loadTimePeriodScenery();

        this.waveTimer = new Timer({
            fcn: () => this.spawnWave(engine),
            interval: 15000, 
            repeats: true
        });
    }

    /**
     * Activates the scene, clearing previous runs, starting music, setting up the map,
     * spawning the player and initial enemies, and initializing UI/minimap.
     */
    onActivate(context) { 
        const engine = context.engine;
        this.clear();
        
        const loadSave = context.data?.loadSave;
        const slot = context.data?.slot;

        if (loadSave) {
            const savedState = JSON.parse(localStorage.getItem('saveGame'));
            if (savedState) {
                GameState.currentLoop = savedState.currentLoop;
                GameState.currentWave = savedState.currentWave;
                GameState.points = savedState.points;
                GameState.highScore = savedState.highScore;
                GameState.activeRules = savedState.activeRules;
                GameState.numPlayers = savedState.numPlayers;
                GameState.saveSlot = savedState.saveSlot;
                // Player data will be applied after players are created
            }
        } else {
            // This is a new game, reset score but keep points from death realm
            GameState.highScore = 0;
        }

        // Reset wave timer interval based on loop
        const waveInterval = Math.max(5000, 15000 - (GameState.currentLoop * 500));
        this.waveTimer.interval = waveInterval;

        if (!Resources.bgMusic.isPlaying()) {
            Resources.bgMusic.loop = true;
            Resources.bgMusic.play(GameSettings.musicVolume);
        }

        this.add(this.waveTimer);
        this.waveTimer.start();
        
        // 1. Create invisible actor for camera to track the midpoint of players
        this.cameraTarget = new Actor({ pos: vec(640, 640), width: 1, height: 1, collisionType: CollisionType.PreventCollision });
        this.add(this.cameraTarget);

        // 2. Clear old strategies and set up tracking BEFORE adding the map.
        // This ensures the map's limitCameraBounds strategy is applied AFTER our tracking strategy.
        this.camera.clearAllStrategies();
        this.camera.strategy.radiusAroundActor(this.cameraTarget, 20);

        // 3. Setup the Map (which automatically adds the limitCameraBounds strategy!)
        generateRandomLevel();
        Resources.Level1.addToScene(this);

        this.players = [];
        const startX = 640 - ((GameState.numPlayers - 1) * 40);
        const savedPlayerData = loadSave ? JSON.parse(localStorage.getItem('saveGame'))?.playerData : null;

        for (let i = 1; i <= GameState.numPlayers; i++) {
            const p = new Player(i);
            p.pos = vec(startX + (i - 1) * 80, 640); 
            this.add(p);
            this.players.push(p);

            if (savedPlayerData && savedPlayerData[i-1]) {
                const data = savedPlayerData[i-1];
                p.health = data.health;
                p.mana = data.mana;
                if (data.isDead) p.die();
            }
        }

        for (let i = 0; i < 5; i++) {
            const enemy = new Shadow();
            const spawnRadius = 300 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            enemy.pos = this.players[0].pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
            this.add(enemy);
        }

        const minimap = createMinimap(engine);
        this.add(minimap);
        
        const ui = new UI();
        this.add(ui);
    }

    /**
     * Updates the camera to lock onto the midpoint of all alive players.
     */
    onPreUpdate(engine, delta) {
        const alivePlayers = this.players.filter(p => !p.isDead);
        if (alivePlayers.length > 0) {
            let sumX = 0; let sumY = 0;
            for (let p of alivePlayers) { sumX += p.pos.x; sumY += p.pos.y; }
            this.cameraTarget.pos = vec(sumX / alivePlayers.length, sumY / alivePlayers.length);
        }

        // Pause Menu
        if (engine.input.keyboard.wasPressed(Keys.Escape)) {
            engine.goToScene('PauseScene');
        }
    }

    /**
     * Clears the scene and stops the wave timer when transitioning away.
     */
    onDeactivate() {
        this.waveTimer.stop();
        this.clear(); 
    }

    /**
     * Handles wave spawning logic, rewarding points and managing
     * normal waves, minibosses (every 10 waves), and the final boss (wave 20).
     */
    spawnWave(engine) {
        if (!this.players || this.players.every(p => p.isDead)) return;
        
        const alivePlayers = this.players.filter(p => !p.isDead);
        const targetPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)]; // Randomly choose a player to spawn around

        GameState.points += 5; // 5 points per wave!
        GameState.save(this.players);

        if (GameState.currentWave === 20) {
            const boss = new Shadow({ health: 10 + GameState.currentLoop * 10, attackDamage: 99, pointValue: 0 });
            boss.scale = vec(3, 3);
            boss.pos = targetPlayer.pos.add(vec(400, 0));
            this.add(boss);
            
            boss.on('kill', () => {
                console.log('Boss Defeated! You won the run!');
                GameState.updateAndSaveHighScore();
                engine.goToScene('MenuScene');
            });

            this.waveTimer.stop(); 
        } else if (GameState.currentWave % 10 === 0) {
            let tintColor = null;
            if (GameState.hasRule('FIRE')) tintColor = Color.Red;
            else if (GameState.hasRule('POISON')) tintColor = Color.Magenta;
            else if (GameState.hasRule('UNDEAD')) tintColor = Color.Green;
            else tintColor = Color.DarkGray;
            
            const miniboss = new Shadow({ 
                health: 15 + GameState.currentLoop * 5, 
                attackDamage: 5,
                customTint: tintColor,
                pointValue: 20 // 20 points for the Miniboss!
            });
            miniboss.scale = vec(2, 2);
            
            const spawnRadius = 300 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            miniboss.pos = targetPlayer.pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
            this.add(miniboss);
            
            GameState.currentWave++;
        } else {
            const spawnCount = GameState.currentWave + (GameState.currentLoop * 2); 
            
            for (let i = 0; i < spawnCount; i++) {
                const zombie = new Shadow();
                const spawnRadius = 300 + Math.random() * 200;
                const angle = Math.random() * Math.PI * 2;
                zombie.pos = targetPlayer.pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
                this.add(zombie);
            }
            
            GameState.currentWave++;
        }
    }

    /**
     * Loads specific map scenery based on the current loop's era.
     * Handles toggling between Modern Day and Medieval eras.
     */
    loadTimePeriodScenery() {
        const eraIndex = Math.floor(GameState.currentLoop / 10);
        
        if (eraIndex === 0) {
        } else if (eraIndex === 1) {
        }
    }
}