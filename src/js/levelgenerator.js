import { Resources } from './resources.js'

// Scale factor for upscaling tiles (16px base * 4 = 64px in-game)
const TILE_SCALE = 4;
let isScaled = false;

export function generateRandomLevel() {
    
    if (!isScaled) {
        // Upscale tile size safely only once
        Resources.Level1.tileWidth *= TILE_SCALE;
        Resources.Level1.tileHeight *= TILE_SCALE;
        isScaled = true;
    }
    
    // Set collision on specific tileIDs if needed.
    // Update tilesets in your TMX editor to mark solid tiles,
    // or set collision here by tile index.
    
    
}