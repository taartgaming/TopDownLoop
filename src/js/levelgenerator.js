import { Resources } from './resources.js'

const TILE_SCALE = 4;
let isScaled = false;

/**
 * Sets up scaling generation metrics for the map safely avoiding repeated scaling.
 */
export function generateRandomLevel() {
    
    if (!isScaled) {
        Resources.Level1.tileWidth *= TILE_SCALE;
        Resources.Level1.tileHeight *= TILE_SCALE;
        isScaled = true;
    }
}