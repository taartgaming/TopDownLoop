import { Scene, Timer, vec, Color } from 'excalibur';
import { GameState } from './gamestate.js';
import { Player } from './player.js'; 
import { Shadow } from './shadow.js';
import { generateRandomLevel } from './levelgenerator.js';
import { createMinimap } from './minimap.js';
import { Resources } from './resources.js';
import { UI } from './ui.js';

export class ArenaScene extends Scene {
    waveTimer;
    player;

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
        
        if (!Resources.bgMusic.isPlaying()) {
            Resources.bgMusic.loop = true;
            Resources.bgMusic.play(0.5);
        }

        this.add(this.waveTimer);
        this.waveTimer.start();
        
        generateRandomLevel();
        Resources.Level1.addToScene(this);

        this.player = new Player();
        this.player.pos = vec(640, 640); 
        this.applyRulesToEntity(this.player);
        this.add(this.player);

        this.camera.clearAllStrategies();
        this.camera.strategy.radiusAroundActor(this.player, 20);

        for (let i = 0; i < 5; i++) {
            const enemy = new Shadow();
            const spawnRadius = 300 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            enemy.pos = this.player.pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
            this.applyRulesToEntity(enemy);
            this.add(enemy);
        }

        const minimap = createMinimap(engine);
        this.add(minimap);
        
        const ui = new UI();
        this.add(ui);
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
        if (!this.player || this.player.isDead) return;

        GameState.points += 1;

        if (GameState.currentWave === 20) {
            const boss = new Shadow({ health: 10 + GameState.currentLoop * 10, attackDamage: 99 });
            boss.scale = vec(3, 3);
            this.applyRulesToEntity(boss);
            boss.pos = this.player.pos.add(vec(400, 0));
            this.add(boss);
            
            boss.on('kill', () => {
                console.log('Boss Defeated! You won the run!');
                GameState.saveBestLoop(GameState.currentLoop);
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
                customTint: tintColor
            });
            miniboss.scale = vec(2, 2);
            
            const spawnRadius = 300 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            miniboss.pos = this.player.pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
            this.applyRulesToEntity(miniboss);
            this.add(miniboss);
            
            GameState.currentWave++;
        } else {
            const spawnCount = GameState.currentWave + (GameState.currentLoop * 2); 
            
            for (let i = 0; i < spawnCount; i++) {
                const zombie = new Shadow();
                const spawnRadius = 300 + Math.random() * 200;
                const angle = Math.random() * Math.PI * 2;
                zombie.pos = this.player.pos.add(vec(Math.cos(angle) * spawnRadius, Math.sin(angle) * spawnRadius));
                this.applyRulesToEntity(zombie);
                this.add(zombie);
            }
            
            GameState.currentWave++;
        }
    }

    /**
     * Applies active game rules (like FIRE or POISON) to a given entity.
     */
    applyRulesToEntity(entity) {
        if (GameState.hasRule('FIRE')) {
            entity.addFireDamage(); 
        }
        if (GameState.hasRule('POISON')) {
            entity.addPoisonAura(); 
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