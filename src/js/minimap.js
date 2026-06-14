import { ScreenElement, CollisionType, Rectangle, Color, vec, GraphicsGroup, Circle } from 'excalibur';

const MAP_WIDTH = 120;
const MAP_HEIGHT = 120;
const SCALE = 0.05;

export class Minimap extends ScreenElement {
    /**
     * Initializes the Minimap UI element, configuring its size and overlay location.
     */
    constructor(game) {
        super({
            x: 10,
            y: 10,
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            z: 999
        });
        this.game = game;
        
        this.collisionType = CollisionType.Passive;

        const members = [
            {
                graphic: new Rectangle({
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    color: new Color(0, 0, 0, 0.6)
                }),
                offset: vec(0, 0)
            },
            {
                graphic: new Rectangle({
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    color: Color.Transparent,
                    strokeColor: Color.White,
                    thickness: 2
                }),
                offset: vec(0, 0)
            }
        ];

        this.graphics.use(new GraphicsGroup({ members }));
    }

    /**
     * Redraws all dots accurately referencing entity world positions every frame.
     */
    onPostUpdate() {
        const members = [
            {
                graphic: new Rectangle({
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    color: new Color(0, 0, 0, 0.6)
                }),
                offset: vec(0, 0)
            },
            {
                graphic: new Rectangle({
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    color: Color.Transparent,
                    strokeColor: Color.White,
                    thickness: 2
                }),
                offset: vec(0, 0)
            }
        ];

        const players = this.game.currentScene.players || [];
        for (let p of players) {
            if (p.isDead) continue;
            const px = Math.max(0, Math.min(MAP_WIDTH, p.pos.x * SCALE));
            const py = Math.max(0, Math.min(MAP_HEIGHT, p.pos.y * SCALE));
            const playerDot = new Circle({
                radius: 3,
                color: Color.Green
            });
            members.push({
                graphic: playerDot,
                offset: vec(px, py)
            });
        }

        for (let actor of this.game.currentScene.actors) {
            if (actor.constructor.name === 'Enemy' || 
                actor.constructor.name === 'Orc' || 
                actor.constructor.name === 'Shadow') {
                const ax = Math.max(0, Math.min(MAP_WIDTH, actor.pos.x * SCALE));
                const ay = Math.max(0, Math.min(MAP_HEIGHT, actor.pos.y * SCALE));
                const enemyDot = new Circle({
                    radius: 2,
                    color: Color.Red
                });
                members.push({
                    graphic: enemyDot,
                    offset: vec(ax, ay)
                });
            }
        }

        this.graphics.use(new GraphicsGroup({ members }));
    }
}

/**
 * Instantiates and returns a new Minimap element pointing to the given game.
 */
export function createMinimap(game) {
    return new Minimap(game);
}
