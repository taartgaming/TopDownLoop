import { Actor, Vector, ParticleEmitter, EmitterType, Color, ParticleTransform, Shape, CollisionType } from "excalibur";
import { Enemy } from "./enemy.js";

export class MagicProjectile extends Actor {
    constructor(pos, direction) {
        super({
            pos: pos,
            width: 16,
            height: 16,
            collider: Shape.Circle(8),
            collisionType: CollisionType.Passive
        });
        this.direction = direction;
        this.speed = 400;
        this.damage = 1;
        this.life = 3000; // 3 seconds lifespan to avoid memory leaks
    }

    onInitialize(engine) {
        this.vel = this.direction.scale(this.speed);

        // Magic Particle Trail
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

        this.on('collisionstart', (evt) => {
            if (evt.other instanceof Enemy && !evt.other.isDead) {
                evt.other.takeDamage(this.damage);
                this.kill(); // Destroy projectile on impact
            }
        });
    }

    onPostUpdate(engine, delta) {
        this.life -= delta;
        if (this.life <= 0) {
            this.kill();
        }
    }
}