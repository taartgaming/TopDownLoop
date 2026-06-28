import { Actor, Shape, CollisionType, Color, Circle } from "excalibur";
import { Player } from "./player.js";
import { GameSettings } from "./gamesettings.js";
import { Resources } from "./resources.js";

export class ManaDrop extends Actor {
    constructor(pos) {
        super({
            pos: pos,
            width: 12,
            height: 12,
            collider: Shape.Circle(6),
            collisionType: CollisionType.Passive,
            z: 50 // Render slightly below the player/enemies
        });
        this.manaAmount = 10; // How much a single drop restores
    }

    onInitialize(engine) {
        // A simple glowing cyan circle for the mana drop
        const circle = new Circle({
            radius: 6,
            color: Color.Cyan
        });
        this.graphics.use(circle);
    }

    onCollisionStart(self, other, side, contact) {
        if (other.owner instanceof Player) {
            other.owner.restoreMana(this.manaAmount);
            Resources.collectSound.play(GameSettings.sfxVolume);
            this.kill(); // Consume the drop
        }
    }
}