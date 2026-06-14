import { Actor } from 'excalibur';
import { GameState } from './gamestate.js';

export class Entity extends Actor {
    /**
     * Initializes base entity configurations such as health and z-index priority.
     */
    constructor(options) {
        super({ z: 100, ...options });
        this.health = options?.health ?? 1;
        this.isDead = false;
        this.invulnTimer = 0;
        this.fireTicks = 0;
        this.fireTimer = 0;
        this.poisonTicks = 0;
        this.poisonTimer = 0;
    }

    /**
     * Updates invulnerability animations and processes status effects like burning.
     */
    onPostUpdate(engine, delta) {
        if (this.invulnTimer > 0) {
            this.invulnTimer -= delta;
            this.graphics.opacity = (Math.floor(this.invulnTimer / 100) % 2 === 0) ? 0.5 : 1.0;
            if (this.invulnTimer <= 0) this.graphics.opacity = 1.0;
        }

        if (this.fireTicks > 0 && !this.isDead) {
            this.fireTimer -= delta;
            if (this.fireTimer <= 0) {
                this.health -= 1;
                console.log(`${this.constructor.name} took Fire Damage! Health: ${this.health}`);
                if (this.health <= 0) {
                    this.die();
                }
                
                this.fireTicks--;
                this.fireTimer = 1000; 
            }
        }

        if (this.poisonTicks > 0 && !this.isDead) {
            this.poisonTimer -= delta;
            if (this.poisonTimer <= 0) {
                this.health -= 1;
                if (this.health <= 0) {
                    this.die();
                }
                this.poisonTicks--;
                this.poisonTimer = 1000; 
            }
        }
    }

    /**
     * Decreases entity health and triggers invulnerability or death appropriately.
     */
    takeDamage(amount = 1) {
        if (this.isDead || this.invulnTimer > 0) return;
        this.health -= amount;
        this.invulnTimer = 1000; 
        
        if (this.health <= 0) {
            this.die();
        }
    }

    /**
     * Marks the entity as dead and removes it from the game scene.
     */
    die() {
        this.isDead = true;
        this.kill();
    }

    /**
     * Applies a fire damage-over-time status effect.
     */
    addFireDamage() {
        // UNBURN rule: Enemies take 0 fire damage
        if (GameState.hasRule('UNBURN') && this.constructor.name !== 'Player') return;
        
        this.fireTicks = 3;
        this.fireTimer = 1000;
    }

    /**
     * Applies a poison damage-over-time status effect.
     */
    addPoisonDamage() {
        this.poisonTicks = 3;
        this.poisonTimer = 1000;
    }
}