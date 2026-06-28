import { Actor, Vector, ParticleEmitter, EmitterType, Color, ParticleTransform, Shape, CollisionType, Circle } from "excalibur";
import { Enemy } from "./enemy.js";
import { GameState } from "./gamestate.js";
import { GameSettings } from "./gamesettings.js";

export class MagicProjectile extends Actor {
    /**
     * Sets up the magic projectile's initial velocity, hit box, and properties.
     */
    constructor(pos, direction) {
        super({
            pos: pos,
            width: 16,
            height: 16,
            collider: Shape.Circle(8),
            collisionType: CollisionType.Passive,
            z: 100
        });
        this.direction = direction;
        this.speed = 400;

        // UNLUCK Rule: 10% chance for double damage
        if (GameState.hasRule('UNLUCK') && Math.random() < 0.1) {
            this.damage = 2;
        } else {
            this.damage = 1;
        }
        this.life = 3000; 
    }

    /**
     * Instantiates the projectile, assigning velocity, collision handling, and the particle emitter.
     */
    onInitialize(engine) {
        this.vel = this.direction.scale(this.speed);

        // Render a core circle graphic to guarantee it displays even if the particle emitter delays
        this.graphics.use(new Circle({
            radius: 8,
            color: Color.Cyan
        }));

        const emitter = new ParticleEmitter({
            pos: new Vector(0, 0),
            emitterType: EmitterType.Circle,
            radius: 6,
            emitRate: 300,
            isEmitting: true,
            particle: {
                life: 400,
                opacity: 0.8,
                beginColor: Color.Cyan,
                endColor: Color.Blue,
                startSize: 12,
                endSize: 2,
                minSpeed: 10,
                maxSpeed: 30,
                transform: ParticleTransform.Global,
                fade: true
            }
        });
        this.addChild(emitter);
    }

    /**
     * Excalibur lifecycle method for collisions.
     */
    onCollisionStart(self, other, side, contact) {
        if (other.owner instanceof Enemy && !other.owner.isDead) {
            other.owner.takeDamage(this.damage);
            
            const kbDir = this.vel.normalize();
            other.owner.pos = other.owner.pos.add(kbDir.scale(15));
            
            if (!GameState.hasRule('UNSTOPPABLE')) {
                this.kill(); 
            }
        }
    }

    /**
     * Destroys the projectile when its lifespan runs out to prevent memory leaks.
     */
    onPostUpdate(engine, delta) {
        this.life -= delta;
        if (this.life <= 0) {
            this.kill();
        }
    }
}