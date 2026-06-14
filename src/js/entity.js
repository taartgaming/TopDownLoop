import { Actor } from 'excalibur';

export class Entity extends Actor {
    constructor(options) {
        super(options);
        this.health = options?.health ?? 1;
        this.isDead = false;
        this.invulnTimer = 0;
        this.fireTicks = 0;
        this.fireTimer = 0;
    }

    onPostUpdate(engine, delta) {
        if (this.invulnTimer > 0) {
            this.invulnTimer -= delta;
            // Create a blinking effect every 100ms
            this.graphics.opacity = (Math.floor(this.invulnTimer / 100) % 2 === 0) ? 0.5 : 1.0;
            if (this.invulnTimer <= 0) this.graphics.opacity = 1.0;
        }

        // Damage Over Time Logic for Burn Rules
        if (this.fireTicks > 0 && !this.isDead) {
            this.fireTimer -= delta;
            if (this.fireTimer <= 0) {
                this.health -= 1;
                console.log(`${this.constructor.name} took Fire Damage! Health: ${this.health}`);
                if (this.health <= 0) {
                    this.die();
                }
                
                this.fireTicks--;
                this.fireTimer = 1000; // Reset timer for the next 1s tick
            }
        }
    }

    takeDamage(amount = 1) {
        if (this.isDead || this.invulnTimer > 0) return;
        this.health -= amount;
        this.invulnTimer = 1000; // 1 second of invulnerability
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.kill();
    }

    addFireDamage() {
        this.fireTicks = 3;
        this.fireTimer = 1000;
    }

    addPoisonAura() {
        // Placeholder logic to be expanded on based on ALL_RULES
    }
}