import { Enemy } from "./enemy.js";
import { Resources } from "./resources.js";

export class Orc extends Enemy {
    constructor(options = {}) {
        super({ moveSpeed: 80, animationFrameSpeed: 70, attackHitFrame: 6, ...options });
    }

    getAnimationDefinition() {
        return {
            frameSpeed: 70,
            walkLeft: Resources.orcWalkLeft,
            walkRight: Resources.orcWalkRight,
            walkUp: Resources.orcWalkUp,
            walkDown: Resources.orcWalkDown,
            walkDownLeft: Resources.orcWalkDownLeft,
            walkDownRight: Resources.orcWalkDownRight,
            walkUpLeft: Resources.orcWalkUpLeft,
            walkUpRight: Resources.orcWalkUpRight,
            attackLeft: Resources.orcAttackLeft,
            attackRight: Resources.orcAttackRight,
            attackUp: Resources.orcAttackUp,
            attackDown: Resources.orcAttackDown,
            attackDownLeft: Resources.orcAttackDownLeft,
            attackDownRight: Resources.orcAttackDownRight,
            attackUpLeft: Resources.orcAttackUpLeft,
            attackUpRight: Resources.orcAttackUpRight
        };
    }
}
