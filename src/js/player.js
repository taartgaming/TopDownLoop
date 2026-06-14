import { Shape, SpriteSheet, Animation, Keys, Vector, CollisionType, Buttons, Axes, Actor } from "excalibur"
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
    /**
     * Initializes the player entity, setting up health, speed, colliders, and cooldowns.
     */
    constructor(playerIndex = 1) {
       
        const startingHealth = GameState.hasRule('UNDEAD') ? 6 : 3;
        
        super({ width: 64, height: 64, health: startingHealth, collisionType: CollisionType.Active });
        this.collider.set(Shape.Circle(24));
        this.playerIndex = playerIndex;
        this.isPlayer = true;
        

        this.speed = 150;
        this.attackCooldown = 300; 
        this.attackTimer = 0;
        
        this.shootCooldown = 400; 
        this.shootTimer = 0;
        
        this.currentFacing = Facing.DOWN;
        
        this.maxMana = 100;
        this.mana = 100;
        this.manaCost = 5; // Magic costs 20 mana per shot
        this.standStillTimer = 0;

        this.setupAnimations();
    }

    /**
     * Initializes the player in the engine and sets the camera strategy to follow the player.
     */
    onInitialize(engine) {
        console.log(`initializing player ${this.playerIndex}`);
    }

    /**
     * Generates and registers all the directional sprite animations.
     */
    setupAnimations() {
        const gridConfig = {
            rows: 1, 
            columns: 6, 
            spriteWidth: 64, 
            spriteHeight: 64 
        };

        const sheetLeft      = SpriteSheet.fromImageSource({ image: Resources.playerLeft, grid: gridConfig });
        const sheetRight     = SpriteSheet.fromImageSource({ image: Resources.playerRight, grid: gridConfig });
        const sheetUp        = SpriteSheet.fromImageSource({ image: Resources.playerUp, grid: gridConfig });
        const sheetDown      = SpriteSheet.fromImageSource({ image: Resources.playerDown, grid: gridConfig });
        const sheetDownLeft  = SpriteSheet.fromImageSource({ image: Resources.playerDown_left, grid: gridConfig });
        const sheetDownRight = SpriteSheet.fromImageSource({ image: Resources.playerDown_right, grid: gridConfig });
        const sheetUpLeft    = SpriteSheet.fromImageSource({ image: Resources.playerUp_left, grid: gridConfig });
        const sheetUpRight   = SpriteSheet.fromImageSource({ image: Resources.playerUp_right, grid: gridConfig });

        const frameSpeed = 150;
        const frameIndices = [0, 1, 2, 3, 4, 5];

        const animLeft      = Animation.fromSpriteSheet(sheetLeft, frameIndices, frameSpeed);
        const animRight     = Animation.fromSpriteSheet(sheetRight, frameIndices, frameSpeed);
        const animUp        = Animation.fromSpriteSheet(sheetUp, frameIndices, frameSpeed);
        const animDown      = Animation.fromSpriteSheet(sheetDown, frameIndices, frameSpeed);
        const animDownLeft  = Animation.fromSpriteSheet(sheetDownLeft, frameIndices, frameSpeed);
        const animDownRight = Animation.fromSpriteSheet(sheetDownRight, frameIndices, frameSpeed);
        const animUpLeft    = Animation.fromSpriteSheet(sheetUpLeft, frameIndices, frameSpeed);
        const animUpRight   = Animation.fromSpriteSheet(sheetUpRight, frameIndices, frameSpeed);

        const animIdle      = Animation.fromSpriteSheet(sheetDown, [0], frameSpeed);

        this.graphics.add('left', animLeft);
        this.graphics.add('right', animRight);
        this.graphics.add('up', animUp);
        this.graphics.add('down', animDown);
        this.graphics.add('down-left', animDownLeft);
        this.graphics.add('down-right', animDownRight);
        this.graphics.add('up-left', animUpLeft);
        this.graphics.add('up-right', animUpRight);
        this.graphics.add('idle', animIdle);

        this.graphics.use('idle');
    }

    /**
     * Handles input, movement, and combat cooldowns for the player every frame.
     */
   onPreUpdate(engine, delta) {
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
        let attackPressed = false;
        let shootPressed = false;
        
        // UNMOVE Rule: Take damage if standing still for > 2 seconds
        if (GameState.hasRule('UNMOVE')) {
            if (this.vel.x === 0 && this.vel.y === 0) {
                this.standStillTimer += delta;
                if (this.standStillTimer > 2000) {
                    this.takeDamage(1);
                    this.standStillTimer = 0;
                }
            } else {
                this.standStillTimer = 0;
            }
        }

        const gamepad = engine.input.gamepads.at(this.playerIndex - 1);

        // Keyboard Inputs based on Player Index
        if (this.playerIndex === 1) {
            if (engine.input.keyboard.isHeld(Keys.A)) vx -= 1;
            if (engine.input.keyboard.isHeld(Keys.D)) vx += 1;
            if (engine.input.keyboard.isHeld(Keys.W)) vy -= 1;
            if (engine.input.keyboard.isHeld(Keys.S)) vy += 1;
            if (engine.input.keyboard.wasPressed(Keys.Space)) attackPressed = true;
            if (engine.input.keyboard.wasPressed(Keys.F) || engine.input.pointers.primary.isDown) shootPressed = true;
        } else {
            if (engine.input.keyboard.isHeld(Keys.Left)) vx -= 1;
            if (engine.input.keyboard.isHeld(Keys.Right)) vx += 1;
            if (engine.input.keyboard.isHeld(Keys.Up)) vy -= 1;
            if (engine.input.keyboard.isHeld(Keys.Down)) vy += 1;
            if (engine.input.keyboard.wasPressed(Keys.Enter)) attackPressed = true;
            if (engine.input.keyboard.wasPressed(Keys.ShiftRight)) shootPressed = true;
        }

        // Gamepad Inputs
        if (gamepad && gamepad.connected) {
            if (gamepad.isButtonHeld(Buttons.DpadLeft) || gamepad.getAxes(Axes.LeftStickX) < -0.5) vx -= 1;
            if (gamepad.isButtonHeld(Buttons.DpadRight) || gamepad.getAxes(Axes.LeftStickX) > 0.5) vx += 1;
            if (gamepad.isButtonHeld(Buttons.DpadUp) || gamepad.getAxes(Axes.LeftStickY) < -0.5) vy -= 1;
            if (gamepad.isButtonHeld(Buttons.DpadDown) || gamepad.getAxes(Axes.LeftStickY) > 0.5) vy += 1;
            
            if (gamepad.wasButtonPressed(Buttons.Face1)) attackPressed = true; // A or Cross
            if (gamepad.wasButtonPressed(Buttons.Face2) || gamepad.wasButtonPressed(Buttons.RightTrigger)) shootPressed = true; // B or Circle or Right Trigger
        }

        if (attackPressed && this.attackTimer <= 0) {
            this.attack();
            this.attackTimer = this.attackCooldown;
        }

        if (shootPressed && this.shootTimer <= 0) {
            this.shoot(engine, gamepad);
            this.shootTimer = this.shootCooldown;
        }

        let moveDir = new Vector(vx, vy);
        if (moveDir > 0) {
            moveDir = moveDir.normalize();
        }
        this.vel = moveDir.scale(this.speed);

        this.updateFacingState();
        this.playAnimationBasedOnState();
   }

    /**
     * Triggers a melee attack within a short range, damaging enemies and applying powerups.
     */
    attack() {
        const attackRange = 80;
        const enemies = this.scene.actors.filter(a => a instanceof Enemy && !a.isDead);
        for (let enemy of enemies) {
            if (this.pos.distance(enemy.pos) <= attackRange) {
                enemy.takeDamage(1);
                console.log("Player attacked enemy!");
            }
        }
    }

    /**
     * Shoots a magic projectile toward the current mouse position.
     */
    shoot(engine, gamepad) {
        // UNUSE Rule: Mana does not deplete and is not required
        if (!GameState.hasRule('UNUSE')) {
            if (this.mana < this.manaCost) {
                return; // Not enough mana!
            }
            this.mana -= this.manaCost;
        }

        Resources.shootSound.play();

        let dir = new Vector(0, 1);
        
        // Aim with controller right stick if being used, otherwise use mouse for P1, or just facing direction
        const rightX = gamepad && gamepad.connected ? gamepad.getAxes(Axes.RightStickX) : 0;
        const rightY = gamepad && gamepad.connected ? gamepad.getAxes(Axes.RightStickY) : 0;
        
        if (Math.abs(rightX) > 0.2 || Math.abs(rightY) > 0.2) {
            dir = new Vector(rightX, rightY).normalize();
        } else if (this.playerIndex === 1 && engine.input.pointers.primary.isDown) {
            const mousePos = engine.input.pointers.primary.lastWorldPos;
            const mouseDir = mousePos.sub(this.pos);
            if (mouseDir.size > 0) dir = mouseDir.normalize();
        } else {
            switch (this.currentFacing) {
                case Facing.UP: dir = new Vector(0, -1); break;
                case Facing.DOWN: dir = new Vector(0, 1); break;
                case Facing.LEFT: dir = new Vector(-1, 0); break;
                case Facing.RIGHT: dir = new Vector(1, 0); break;
                case Facing.UP_LEFT: dir = new Vector(-1, -1).normalize(); break;
                case Facing.UP_RIGHT: dir = new Vector(1, -1).normalize(); break;
                case Facing.DOWN_LEFT: dir = new Vector(-1, 1).normalize(); break;
                case Facing.DOWN_RIGHT: dir = new Vector(1, 1).normalize(); break;
            }
        }
        
        const spawnPos = this.pos.add(dir.scale(35));
        const projectile = new MagicProjectile(spawnPos, dir);
        
        this.scene.add(projectile);
        console.log("Player shot a magic projectile!");
    }

    /**
     * Restores player mana up to the maximum.
     */
    restoreMana(amount) {
        this.mana = Math.min(this.maxMana, this.mana + amount);
    }

    /**
     * Reduces the player's health by a specific amount.
     */
    takeDamage(amount = 1) {
        const prevHealth = this.health;
        super.takeDamage(amount);
        if (this.health < prevHealth) {
            Resources.hitSound.play();
        }
        console.log(`Player hit! Health remaining: ${this.health}`);
    }

    /**
     * Triggers player death sequence and transitions to the Death Realm or Game Over.
     */
    die() {
        this.isDead = true;
        console.log(`Player ${this.playerIndex} died!`);
        
        const scene = this.scene;
        this.kill(); // Removes them from the screen entirely

        // Check if ALL players are dead
        if (scene && scene.players.every(p => p.isDead)) {
            const engine = scene.engine;
            if (GameState.currentLoop >= GameState.maxLoops) {
                engine.goToScene('GameOverScene'); 
            } else {
                GameState.triggerDeathLoop();
                engine.goToScene('DeathRealmScene');
            }
        }
    }

    /**
     * Updates the facing direction state based on the current velocity vectors.
     */
   updateFacingState() {
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

    /**
     * Applies the appropriate graphic animation based on the current facing state.
     */
    playAnimationBasedOnState() {
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
