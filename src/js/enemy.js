import { Shape, Vector, vec, range, SpriteSheet, Animation, CollisionType, Color } from "excalibur"
import { Resources } from "./resources.js";
import { Entity } from "./entity.js";
import { ManaDrop } from "./manadrop.js";
import { GameState } from "./gamestate.js";
import { FireHazard } from "./firehazard.js";

const Facing = Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP_LEFT: 'UP-LEFT',
    UP_RIGHT: 'UP-RIGHT',
    DOWN_LEFT: 'DOWN-LEFT',
    DOWN_RIGHT: 'DOWN-RIGHT',
    IDLE: 'IDLE'
});

export class Enemy extends Entity {

    moveSpeed = 100;
    touching = false;
    /**
     * Initializes base stats, bounding box, timing for attacks, and appearance settings.
     */
    constructor(options = {}) {
        super({ width: 64, height: 64, health: options.health ?? 1, collisionType: CollisionType.Active, ...options });
        this.collider.set(Shape.Circle(16)); 
        this.baseHealth = options.health ?? 1;
   
        this.moveSpeed = options.moveSpeed ?? 100;
        this.isAttacking = false;
        this.attackDuration = options.attackDuration ?? 720;
        this.attackTimer = 0;
        this.animationFrameSpeed = options.animationFrameSpeed ?? 60;
        this.attackHitFrame = options.attackHitFrame ?? 6;
        this.attackHitDelay = this.animationFrameSpeed * (this.attackHitFrame - 1);
        this.hasAppliedAttackDamage = false;
        this.currentFacing = 'DOWN'; 
        this.attackDamage = options.attackDamage ?? 1;
        this.customTint = options.customTint ?? null;
        this.pointValue = options.pointValue ?? 1;
        
        // UNBREAKABLE Rule: Double armor/health
        if (GameState.hasRule('BREAKABLE')) {
            this.health = this.baseHealth * 2;
        }

        // Add random size and speed variation, but not for bosses/minibosses
        if (!options.health) { // A simple way to check if it's a regular enemy
            const sizeVariation = 0.8 + Math.random() * 0.7; // 80% to 150%
            this.scale = vec(sizeVariation, sizeVariation);
            
            // Smaller are faster, larger are slower
            this.moveSpeed = this.moveSpeed / sizeVariation;
            this.health = Math.ceil(this.health * sizeVariation);
        }
    }

    /**
     * Initializes the enemy into the engine, randomizing its spawn position and generating animations.
     */
    onInitialize(engine) {
        console.log("initializing enemy");
        this.pos = new Vector(Math.random() * engine.drawWidth, Math.random() * engine.drawHeight);
        this.setupAnimations();
        
        // UNTOUCHABLE Rule: Spawn with a 3 second forcefield
        if (GameState.hasRule('UNTOUCHABLE')) {
            this.invulnTimer = 3000; 
        }

        // FIRE Rule: Add a red hue to enemies that will leave a fire trail
        if (GameState.hasRule('FIRE') && this.scale.x <= 1.5 && !this.customTint) { // Affects normal enemies
            this.customTint = new Color(255, 150, 150);
        }
        
    }


    /**
     * Updates the enemy's logic every frame, checking ranges to the player and managing attacks.
     */
    onPreUpdate(engine, delta) {
        if (this.isDead) return;
        
        const players = engine.currentScene?.players || [];
        let closestPlayer = null;
        let minDistance = Infinity;
        
        for (let p of players) {
            if (p.isDead) continue;
            const dist = p.pos.distance(this.pos);
            if (dist < minDistance) {
                minDistance = dist;
                closestPlayer = p;
            }
        }
        
        // UNSEEN Rule: Player is invisible when standing still
        if (GameState.hasRule('UNSEEN') && closestPlayer && closestPlayer.vel.size === 0) {
            this.vel = vec(0, 0); // Stop moving
            this.playAnimationBasedOnState();
            return; // Ignore player
        }

        // If there are no alive players, do nothing
        if (!closestPlayer) {
            this.vel = vec(0, 0);
            return;
        }

        let direction = closestPlayer.pos.sub(this.pos);
        const distance = direction.size; 
        const attackRange = 60; 

        this.touching = distance <= attackRange;

        // UNSEEN Rule: Invisible if too far away
        if (GameState.hasRule('UNSEEN')) {
            this.graphics.opacity = distance > 200 ? 0 : 1;
        }
        
        // POISON Rule: Minibosses/Bosses emit toxic aura
        if (GameState.hasRule('POISON') && this.scale.x > 1) {
            if (distance < 120) {
                closestPlayer.addPoisonDamage();
            }
        }
        
        // FIRE Rule: Normal enemies leave fire trails
        if (GameState.hasRule('FIRE') && this.scale.x === 1) {
            if (Math.random() < 0.005) { // Roughly 30% chance every 1 sec
                this.scene.add(new FireHazard(this.pos.clone()));
            }
        }

        if (this.isAttacking) {
   
            this.attackTimer -= delta;

            if (!this.hasAppliedAttackDamage && this.attackTimer <= (this.attackDuration - this.attackHitDelay)) {
                if (this.touching) {
                    // LUCK Rule: Random Enemy Crits
                    const finalDmg = (GameState.hasRule('LUCK') && Math.random() < 0.2) ? this.attackDamage * 2 : this.attackDamage;
                    closestPlayer.takeDamage(finalDmg);
                }
                this.hasAppliedAttackDamage = true;
            }
            
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
            this.vel = new Vector(0, 0);

            this.playAnimationBasedOnState();
         
            return; 
        }

        
        if (this.touching) {
            this.updateFacingState(); 
            this.startAttack();

            return; 
        } 

        
        this.vel = direction.normalize().scale(this.moveSpeed);

        this.updateFacingState();   
        this.playAnimationBasedOnState();
    }

    /**
     * Triggers the attack state, stopping the enemy and playing the attack animation.
     */
    startAttack() {
        this.isAttacking = true;
        this.attackTimer = this.attackDuration;
        this.hasAppliedAttackDamage = false;
        this.vel = vec(0, 0); 
        
        this.playAnimationBasedOnState();


        const activeGraphic = this.graphics.current;
        if (activeGraphic && typeof activeGraphic.reset === 'function') {
            activeGraphic.reset(); 
        }
        

        console.log("Whack! Dealt damage to the player!");
    }

    /**
     * Overrides the Entity death to have a chance to drop mana.
     */
    die() {
        if (!this.isDead && this.scene) {
            
            // UNDEAD Rule: 20% chance to resurrect
            if (GameState.hasRule('DEAD') && Math.random() < 0.20) {
                this.health = this.baseHealth;
                this.invulnTimer = 1000;
                return; // Prevent death
            }
            
            GameState.points += this.pointValue;
            if (Math.random() < 0.35) { // 35% chance to drop mana
                this.scene.add(new ManaDrop(this.pos.clone()));
            }
        }
        super.die(); // Call original entity kill code
    }

    /**
     * Constructs and registers the SpriteSheets and Animations based on the definition settings.
     */
    setupAnimations() {
        const animationDefinition = this.getAnimationDefinition();
        const gridConfig = animationDefinition.gridConfig ?? {
            rows: 1,
            columns: 12,
            spriteWidth: 64,
            spriteHeight: 64
        };
        const frameSpeed = animationDefinition.frameSpeed ?? this.animationFrameSpeed;
        const frameIndices = animationDefinition.frameIndices ?? range(0, gridConfig.columns - 1);

        const sheetWalkLeft = SpriteSheet.fromImageSource({ image: animationDefinition.walkLeft, grid: gridConfig });
        const sheetWalkRight = SpriteSheet.fromImageSource({ image: animationDefinition.walkRight, grid: gridConfig });
        const sheetWalkUp = SpriteSheet.fromImageSource({ image: animationDefinition.walkUp, grid: gridConfig });
        const sheetWalkDown = SpriteSheet.fromImageSource({ image: animationDefinition.walkDown, grid: gridConfig });
        const sheetWalkDownLeft = SpriteSheet.fromImageSource({ image: animationDefinition.walkDownLeft, grid: gridConfig });
        const sheetWalkDownRight = SpriteSheet.fromImageSource({ image: animationDefinition.walkDownRight, grid: gridConfig });
        const sheetWalkUpLeft = SpriteSheet.fromImageSource({ image: animationDefinition.walkUpLeft, grid: gridConfig });
        const sheetWalkUpRight = SpriteSheet.fromImageSource({ image: animationDefinition.walkUpRight, grid: gridConfig });
        const sheetAttackLeft = SpriteSheet.fromImageSource({ image: animationDefinition.attackLeft, grid: gridConfig });
        const sheetAttackRight = SpriteSheet.fromImageSource({ image: animationDefinition.attackRight, grid: gridConfig });
        const sheetAttackUp = SpriteSheet.fromImageSource({ image: animationDefinition.attackUp, grid: gridConfig });  
        const sheetAttackDown = SpriteSheet.fromImageSource({ image: animationDefinition.attackDown, grid: gridConfig });
        const sheetAttackDownLeft = SpriteSheet.fromImageSource({ image: animationDefinition.attackDownLeft, grid: gridConfig });
        const sheetAttackDownRight = SpriteSheet.fromImageSource({ image: animationDefinition.attackDownRight, grid: gridConfig });
        const sheetAttackUpLeft = SpriteSheet.fromImageSource({ image: animationDefinition.attackUpLeft, grid: gridConfig });
        const sheetAttackUpRight = SpriteSheet.fromImageSource({ image: animationDefinition.attackUpRight, grid: gridConfig });  

        const animLeft = Animation.fromSpriteSheet(sheetWalkLeft, frameIndices, frameSpeed);
        const animRight = Animation.fromSpriteSheet(sheetWalkRight, frameIndices, frameSpeed);
        const animUp = Animation.fromSpriteSheet(sheetWalkUp, frameIndices, frameSpeed);
        const animDown = Animation.fromSpriteSheet(sheetWalkDown, frameIndices, frameSpeed);
        const animDownLeft = Animation.fromSpriteSheet(sheetWalkDownLeft, frameIndices, frameSpeed);
        const animDownRight = Animation.fromSpriteSheet(sheetWalkDownRight, frameIndices, frameSpeed);
        const animUpLeft = Animation.fromSpriteSheet(sheetWalkUpLeft, frameIndices, frameSpeed);
        const animUpRight = Animation.fromSpriteSheet(sheetWalkUpRight, frameIndices, frameSpeed);
        const animAttackLeft = Animation.fromSpriteSheet(sheetAttackLeft, frameIndices, frameSpeed);
        const animAttackRight = Animation.fromSpriteSheet(sheetAttackRight, frameIndices, frameSpeed);
        const animAttackUp = Animation.fromSpriteSheet(sheetAttackUp, frameIndices, frameSpeed);
        const animAttackDown = Animation.fromSpriteSheet(sheetAttackDown, frameIndices, frameSpeed);
        const animAttackDownLeft = Animation.fromSpriteSheet(sheetAttackDownLeft, frameIndices, frameSpeed);
        const animAttackDownRight = Animation.fromSpriteSheet(sheetAttackDownRight, frameIndices, frameSpeed);
        const animAttackUpLeft = Animation.fromSpriteSheet(sheetAttackUpLeft, frameIndices, frameSpeed);
        const animAttackUpRight = Animation.fromSpriteSheet(sheetAttackUpRight, frameIndices, frameSpeed);

        const animIdle = Animation.fromSpriteSheet(sheetWalkDown, [0], frameSpeed);

        this.graphics.add('walk-left', animLeft);
        this.graphics.add('walk-right', animRight);
        this.graphics.add('walk-up', animUp);
        this.graphics.add('walk-down', animDown);
        this.graphics.add('walk-down-left', animDownLeft);
        this.graphics.add('walk-down-right', animDownRight);
        this.graphics.add('walk-up-left', animUpLeft);
        this.graphics.add('walk-up-right', animUpRight);
        this.graphics.add('attack-left', animAttackLeft);
        this.graphics.add('attack-right', animAttackRight);
        this.graphics.add('attack-up', animAttackUp);
        this.graphics.add('attack-down', animAttackDown);
        this.graphics.add('attack-down-left', animAttackDownLeft);
        this.graphics.add('attack-down-right', animAttackDownRight);
        this.graphics.add('attack-up-left', animAttackUpLeft);
        this.graphics.add('attack-up-right', animAttackUpRight);

        this.graphics.add('idle', animIdle);
        this.graphics.use('idle');
    }

    /**
     * Retrieves the specific sprite resources for this enemy's animations. Must be overridden.
     */
    getAnimationDefinition() {
        return {
            frameSpeed: this.animationFrameSpeed,
            walkLeft: Resources.enemyWalkLeft,
            walkRight: Resources.enemyWalkRight,
            walkUp: Resources.enemyWalkUp,
            walkDown: Resources.enemyWalkDown,
            walkDownLeft: Resources.enemyWalkDown_left,
            walkDownRight: Resources.enemyWalkDown_right,
            walkUpLeft: Resources.enemyWalkUp_left,
            walkUpRight: Resources.enemyWalkUp_right,
            attackLeft: Resources.enemyAttackLeft,
            attackRight: Resources.enemyAttackRight,
            attackUp: Resources.enemyAttackUp,
            attackDown: Resources.enemyAttackDown,
            attackDownLeft: Resources.enemyAttackDown_left,
            attackDownRight: Resources.enemyAttackDown_right,
            attackUpLeft: Resources.enemyAttackUp_left,
            attackUpRight: Resources.enemyAttackUp_right
        };
    }

    

   /**
    * Evaluates the current velocity mapping to 8-directional facing states.
    */
   updateFacingState() {

        if(this.vel.x === 0 && this.vel.y === 0) {
            return;
        }
        const sx = Math.sign(this.vel.x); 
        const sy = Math.sign(this.vel.y);

        if (sx === 0 && sy === -1) {
            this.currentFacing = Facing.UP;
        } else if (sx === 0 && sy === 1) {
            this.currentFacing = Facing.DOWN;
        } else if (sx === -1 && sy === 0) {
            this.currentFacing = Facing.LEFT;
        } else if (sx === 1 && sy === 0) {
            this.currentFacing = Facing.RIGHT;
        } else if (sx === -1 && sy === -1) {
            this.currentFacing = Facing.UP_LEFT;
        } else if (sx === 1 && sy === -1) {
            this.currentFacing = Facing.UP_RIGHT;
        } else if (sx === -1 && sy === 1) {
            this.currentFacing = Facing.DOWN_LEFT;
        } else if (sx === 1 && sy === 1) {
            this.currentFacing = Facing.DOWN_RIGHT;
        }
    }

    /**
     * Plays the appropriate animation from the defined state and applies custom tints.
     */
    playAnimationBasedOnState() {

        const directionString = this.currentFacing.toLowerCase();
        let activeAnim;

        if (this.isAttacking) {
            activeAnim = this.graphics.use('attack-' + directionString);
        } else if (this.vel.x === 0 && this.vel.y === 0) {
            activeAnim = this.graphics.use('idle'); 
        } else {
            activeAnim = this.graphics.use('walk-' + directionString);
        }
        
        if (this.customTint && activeAnim) {
            activeAnim.tint = this.customTint;
        }
    }
   
}
