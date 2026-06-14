import { Shape, SpriteSheet, Animation, Keys, Vector } from "excalibur"
import { Resources } from "./resources.js";
import { GameState } from "./gamestate.js";
import { Entity } from "./entity.js";
import { Enemy } from "./enemy.js";
import { MagicProjectile } from "./magicprojectile.js";

const Facing = Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT',
    IDLE: 'IDLE'
});

export class Player extends Entity {
    constructor() {
       
        const startingHealth = GameState.hasRule('UNDEAD') ? 1 : 1;
        
        super({ width: 64, height: 64, health: startingHealth });
        this.collider.set(Shape.Circle(24));
        

        this.speed = GameState.hasRule('UNTOUCHABLE') ? 75 : 150;
        this.attackCooldown = GameState.hasRule('UNTOUCHABLE') ? 1000 : 300; 
        this.attackTimer = 0;
        
        this.shootCooldown = GameState.hasRule('UNTOUCHABLE') ? 800 : 400; 
        this.shootTimer = 0;
        
        this.currentFacing = Facing.DOWN;

        this.setupAnimations();
    }

    onInitialize(engine) {
        console.log("initializing player");
        engine.currentScene.camera.strategy.radiusAroundActor(this, 20);  
    }


    setupAnimations() {
        //Define the shared grid structure
        const gridConfig = {
            rows: 1, 
            columns: 6, 
            spriteWidth: 64, 
            spriteHeight: 64 
        };

        //Create 8 separate SpriteSheets 
        const sheetLeft      = SpriteSheet.fromImageSource({ image: Resources.playerLeft, grid: gridConfig });
        const sheetRight     = SpriteSheet.fromImageSource({ image: Resources.playerRight, grid: gridConfig });
        const sheetUp        = SpriteSheet.fromImageSource({ image: Resources.playerUp, grid: gridConfig });
        const sheetDown      = SpriteSheet.fromImageSource({ image: Resources.playerDown, grid: gridConfig });
        const sheetDownLeft  = SpriteSheet.fromImageSource({ image: Resources.playerDown_left, grid: gridConfig });
        const sheetDownRight = SpriteSheet.fromImageSource({ image: Resources.playerDown_right, grid: gridConfig });
        const sheetUpLeft    = SpriteSheet.fromImageSource({ image: Resources.playerUp_left, grid: gridConfig });
        const sheetUpRight   = SpriteSheet.fromImageSource({ image: Resources.playerUp_right, grid: gridConfig });

        // Define animation speed and the frame indices 
        const frameSpeed = 150;
        const frameIndices = [0, 1, 2, 3, 4, 5];

        //Create the Animations
        const animLeft      = Animation.fromSpriteSheet(sheetLeft, frameIndices, frameSpeed);
        const animRight     = Animation.fromSpriteSheet(sheetRight, frameIndices, frameSpeed);
        const animUp        = Animation.fromSpriteSheet(sheetUp, frameIndices, frameSpeed);
        const animDown      = Animation.fromSpriteSheet(sheetDown, frameIndices, frameSpeed);
        const animDownLeft  = Animation.fromSpriteSheet(sheetDownLeft, frameIndices, frameSpeed);
        const animDownRight = Animation.fromSpriteSheet(sheetDownRight, frameIndices, frameSpeed);
        const animUpLeft    = Animation.fromSpriteSheet(sheetUpLeft, frameIndices, frameSpeed);
        const animUpRight   = Animation.fromSpriteSheet(sheetUpRight, frameIndices, frameSpeed);

        const animIdle      = Animation.fromSpriteSheet(sheetDown, [0], frameSpeed);

        //Register to the Actor's graphics component
        this.graphics.add('left', animLeft);
        this.graphics.add('right', animRight);
        this.graphics.add('up', animUp);
        this.graphics.add('down', animDown);
        this.graphics.add('down-left', animDownLeft);
        this.graphics.add('down-right', animDownRight);
        this.graphics.add('up-left', animUpLeft);
        this.graphics.add('up-right', animUpRight);
        this.graphics.add('idle', animIdle);

        // Set default
        this.graphics.use('idle');
    }

   onPreUpdate(engine, delta) {
        //Reset input variables
        if (this.isDead) {
            return;
        }

        if (this.attackTimer > 0) {
            this.attackTimer -= delta;
        }

        if (this.shootTimer > 0) {
            this.shootTimer -= delta;
        }

        let vx = 0;
        let vy = 0;

        if (engine.input.keyboard.wasPressed(Keys.Space) && this.attackTimer <= 0) {
            this.attack();
            this.attackTimer = this.attackCooldown;
        }

        if (engine.input.keyboard.wasPressed(Keys.F) && this.shootTimer <= 0) {
            this.shoot();
            this.shootTimer = this.shootCooldown;
        }

        if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) vy -= 1;
        if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) vy += 1;
        if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) vx -= 1;
        if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) vx += 1;

        let moveDir = new Vector(vx, vy);
        if (moveDir > 0) {
            moveDir = moveDir.normalize();
        }
        this.vel = moveDir.scale(this.speed);

        // 4. Update Enum State based on Velocity
        this.updateFacingState();

        // 5. Use the Enum (e.g., to play animations)
        this.playAnimationBasedOnState();
   }

    attack() {
        const attackRange = 80;
        // Filter for any active enemies in the current scene
        const enemies = this.scene.actors.filter(a => a instanceof Enemy && !a.isDead);
        for (let enemy of enemies) {
            if (this.pos.distance(enemy.pos) <= attackRange) {
                enemy.takeDamage(1);
                console.log("Player attacked enemy!");
                
                // Power-Up logic: UNBURN causes enemies to burn!
                if (GameState.hasRule('UNBURN')) {
                    enemy.addFireDamage();
                }
            }
        }
    }

    shoot() {
        let dir = new Vector(0, 1);
        switch (this.currentFacing) {
            case Facing.UP: dir = new Vector(0, -1); break;
            case Facing.DOWN: dir = new Vector(0, 1); break;
            case Facing.LEFT: dir = new Vector(-1, 0); break;
            case Facing.RIGHT: dir = new Vector(1, 0); break;
            case Facing.UP_LEFT: dir = new Vector(-1, -1).normalize(); break;
            case Facing.UP_RIGHT: dir = new Vector(1, -1).normalize(); break;
            case Facing.DOWN_LEFT: dir = new Vector(-1, 1).normalize(); break;
            case Facing.DOWN_RIGHT: dir = new Vector(1, 1).normalize(); break;
            case Facing.IDLE: 
                // If idle, try to use last velocity or default down
                if (this.vel.size > 0) {
                    dir = this.vel.normalize();
                }
                break;
        }
        
        // Spawn slightly ahead of the player to avoid immediate self-collision
        const spawnPos = this.pos.add(dir.scale(35));
        const projectile = new MagicProjectile(spawnPos, dir);
        
        this.scene.add(projectile);
        console.log("Player shot a magic projectile!");
    }

    takeDamage(amount = 1) {
        super.takeDamage(amount);
        console.log(`Player hit! Health remaining: ${this.health}`);
    }

    die() {
        this.isDead = true;
        console.log("Player died!");
        const engine = this.scene.engine;
        
        if (GameState.currentLoop >= GameState.maxLoops) {
            engine.goToScene('GameOverScene'); 
        } else {
            GameState.triggerDeathLoop();
            engine.goToScene('DeathRealmScene');
        }
    }

   updateFacingState() {
        // Math.sign reduces velocity to 1, -1, or 0 regardless of your actual speed
        const sx = Math.sign(this.vel.x); 
        const sy = Math.sign(this.vel.y);

        if (sx === 0 && sy === 0) {
            this.currentFacing = Facing.IDLE;
        } else if (sx === 0 && sy === -1) {
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

    playAnimationBasedOnState() {
        // 6. Tell the graphics component which animation to "use" based on the enum!
        switch (this.currentFacing) {
            case Facing.IDLE:
                this.graphics.use('idle');
                break;
            case Facing.UP:
                this.graphics.use('up');
                break;
            case Facing.DOWN:
                this.graphics.use('down');
                break;
            case Facing.LEFT:
                this.graphics.use('left');
                break;
            case Facing.RIGHT:
                this.graphics.use('right');
                break;
            case Facing.UP_LEFT:
                this.graphics.use('up-left');
                break;
            case Facing.UP_RIGHT:
                this.graphics.use('up-right');
                break;
            case Facing.DOWN_LEFT:
                this.graphics.use('down-left');
                break;
            case Facing.DOWN_RIGHT:
                this.graphics.use('down-right');
                break;
        }
    }
   
}
