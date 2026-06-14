import { Actor, Shape, CollisionType, Color, Circle } from "excalibur";

export class FireHazard extends Actor {
    /**
     * Initializes a dangerous fire trail left by enemies.
     */
    constructor(pos) {
        super({
            pos: pos,
            width: 24,
            height: 24,
            collider: Shape.Circle(12),
            collisionType: CollisionType.Passive,
            z: 50 // Render slightly below the player/enemies
        });
        this.life = 3500; // Trail stays for 3.5 seconds
    }

    onInitialize() {
        this.graphics.use(new Circle({ radius: 12, color: Color.Orange }));
    }

    onCollisionStart(self, other, side, contact) {
        if (other.owner.constructor.name === 'Player') {
            other.owner.addFireDamage();
        }
    }

    onPostUpdate(engine, delta) {
        this.life -= delta;
        if (this.life <= 0) this.kill();
    }
}