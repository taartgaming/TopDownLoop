// arenaScene.js
import { Scene, Timer, vec } from 'excalibur';
import { GameState } from './gamestate.js';
import { Player } from './player.js'; 
import { Shadow } from './shadow.js';
import { generateRandomLevel } from './levelgenerator.js';
import { createMinimap } from './minimap.js';
import { Resources } from './resources.js';
import { UI } from './ui.js';

export class ArenaScene extends Scene {
    // Standard JS class properties
    waveTimer;
    player;

    onInitialize(engine) {
        this.loadTimePeriodScenery();

        this.waveTimer = new Timer({
            fcn: () => this.spawnWave(engine),
            interval: 15000, 
            repeats: true
        });
    }

    onActivate(context) {
        const engine = context.engine;
        this.clear(); // Clear previous runs fully

        this.add(this.waveTimer);
        this.waveTimer.start();
        
        // Setup the Map
        generateRandomLevel();
        Resources.Level1.addToScene(this);

        // Setup Player
        this.player = new Player();
        this.player.pos = vec(640, 640); 
        this.applyRulesToEntity(this.player);
        this.add(this.player);

        // Tell the camera to track the player
        this.camera.clearAllStrategies();
        this.camera.strategy.radiusAroundActor(this.player, 20);

        for (let i = 0; i < 5; i++) {
            const enemy = new Shadow();
            // Spawn enemies in a ring outside the player's immediate view
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

    onDeactivate() {
        this.waveTimer.stop();
        this.clear(); 
    }

    spawnWave(engine) {
        if (!this.player || this.player.isDead) return;

        if (GameState.currentWave === 2) {
            // Boss Wave
            const boss = new Shadow({ health: 10 + GameState.currentLoop * 10, attackDamage: 99 });
            boss.scale = vec(3, 3);
            this.applyRulesToEntity(boss);
            boss.pos = this.player.pos.add(vec(400, 0));
            this.add(boss);
            
            boss.on('kill', () => {
                console.log('Boss Defeated! You won the run!');
            });

            this.waveTimer.stop(); 
        } else {
            // Normal Wave
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

    applyRulesToEntity(entity) {
        if (GameState.hasRule('FIRE')) {
            entity.addFireDamage(); 
        }
        if (GameState.hasRule('POISON')) {
            entity.addPoisonAura(); 
        }
    }

    loadTimePeriodScenery() {
        const eraIndex = Math.floor(GameState.currentLoop / 10);
        
        if (eraIndex === 0) {
            // Modern Day Map logic
        } else if (eraIndex === 1) {
            // Medieval Map logic
        }
    }
}