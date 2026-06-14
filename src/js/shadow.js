import { Enemy } from "./enemy.js";
import { Resources } from "./resources.js";

export class Shadow extends Enemy {

    constructor(options = {}) {
        super({ moveSpeed: 120, animationFrameSpeed: 60, attackHitFrame: 6, ...options });
    }

    getAnimationDefinition() {
        return {
            frameSpeed: 60,
            walkLeft: Resources.shadowWalkLeft,
            walkRight: Resources.shadowWalkRight,
            walkUp: Resources.shadowWalkUp,
            walkDown: Resources.shadowWalkDown,
            walkDownLeft: Resources.shadowWalkDownLeft,
            walkDownRight: Resources.shadowWalkDownRight,
            walkUpLeft: Resources.shadowWalkUpLeft,
            walkUpRight: Resources.shadowWalkUpRight,
            attackLeft: Resources.shadowAttackLeft,
            attackRight: Resources.shadowAttackRight,
            attackUp: Resources.shadowAttackUp,
            attackDown: Resources.shadowAttackDown,
            attackDownLeft: Resources.shadowAttackDownLeft,
            attackDownRight: Resources.shadowAttackDownRight,
            attackUpLeft: Resources.shadowAttackUpLeft,
            attackUpRight: Resources.shadowAttackUpRight
        };
    }
}