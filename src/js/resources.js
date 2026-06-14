import { ImageSource, Sound, Resource, Loader } from 'excalibur'
import { TiledResource } from '@excaliburjs/plugin-tiled';

// voeg hier jouw eigen resources toe
const Resources = {
    //playerSheets
    playerLeft: new ImageSource('../../public/images/playerLeft.png'),
    playerRight: new ImageSource('../../public/images/playerRight.png'),
    playerUp: new ImageSource('../../public/images/playerUp.png'),
    playerDown: new ImageSource('../../public/images/playerDown.png'),
    playerDown_left: new ImageSource('../../public/images/playerDown_left.png'),
    playerDown_right: new ImageSource('../../public/images/playerDown_right.png'),
    playerUp_left: new ImageSource('../../public/images/playerUp_left.png'),
    playerUp_right: new ImageSource('../../public/images/playerUp_right.png'),
    //enemySheets
    enemyWalkLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-W.png'),
    enemyWalkRight: new ImageSource('../../public/images/Enemy-Melee-Idle-E.png'),
    enemyWalkUp: new ImageSource('../../public/images/Enemy-Melee-Idle-N.png'),
    enemyWalkDown: new ImageSource('../../public/images/Enemy-Melee-Idle-S.png'),
    enemyWalkDown_left: new ImageSource('../../public/images/Enemy-Melee-Idle-SW.png'),
    enemyWalkDown_right: new ImageSource('../../public/images/Enemy-Melee-Idle-SE.png'),
    enemyWalkUp_left: new ImageSource('../../public/images/Enemy-Melee-Idle-NW.png'),
    enemyWalkUp_right: new ImageSource('../../public/images/Enemy-Melee-Idle-NE.png'),
    //enemyAttackSheets
    enemyAttackLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-W.png'),
    enemyAttackRight: new ImageSource('../../public/images/Enemy-Melee-Attack-E.png'),
    enemyAttackUp: new ImageSource('../../public/images/Enemy-Melee-Attack-N.png'), 
    enemyAttackDown: new ImageSource('../../public/images/Enemy-Melee-Attack-S.png'),
    enemyAttackDown_left: new ImageSource('../../public/images/Enemy-Melee-Attack-SW.png'),
    enemyAttackDown_right: new ImageSource('../../public/images/Enemy-Melee-Attack-SE.png'),
    enemyAttackUp_left: new ImageSource('../../public/images/Enemy-Melee-Attack-NW.png'),
    enemyAttackUp_right: new ImageSource('../../public/images/Enemy-Melee-Attack-NE.png'),  
    shadowWalkLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-W.png'),
    shadowWalkRight: new ImageSource('../../public/images/Enemy-Melee-Idle-E.png'),
    shadowWalkUp: new ImageSource('../../public/images/Enemy-Melee-Idle-N.png'),
    shadowWalkDown: new ImageSource('../../public/images/Enemy-Melee-Idle-S.png'),
    shadowWalkDownLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-SW.png'),
    shadowWalkDownRight: new ImageSource('../../public/images/Enemy-Melee-Idle-SE.png'),
    shadowWalkUpLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-NW.png'),
    shadowWalkUpRight: new ImageSource('../../public/images/Enemy-Melee-Idle-NE.png'),
    shadowAttackLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-W.png'),
    shadowAttackRight: new ImageSource('../../public/images/Enemy-Melee-Attack-E.png'),
    shadowAttackUp: new ImageSource('../../public/images/Enemy-Melee-Attack-N.png'),
    shadowAttackDown: new ImageSource('../../public/images/Enemy-Melee-Attack-S.png'),
    shadowAttackDownLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-SW.png'),
    shadowAttackDownRight: new ImageSource('../../public/images/Enemy-Melee-Attack-SE.png'),
    shadowAttackUpLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-NW.png'),
    shadowAttackUpRight: new ImageSource('../../public/images/Enemy-Melee-Attack-NE.png'),
    orcWalkLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-W.png'),
    orcWalkRight: new ImageSource('../../public/images/Enemy-Melee-Idle-E.png'),
    orcWalkUp: new ImageSource('../../public/images/Enemy-Melee-Idle-N.png'),
    orcWalkDown: new ImageSource('../../public/images/Enemy-Melee-Idle-S.png'),
    orcWalkDownLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-SW.png'),
    orcWalkDownRight: new ImageSource('../../public/images/Enemy-Melee-Idle-SE.png'),
    orcWalkUpLeft: new ImageSource('../../public/images/Enemy-Melee-Idle-NW.png'),
    orcWalkUpRight: new ImageSource('../../public/images/Enemy-Melee-Idle-NE.png'),
    orcAttackLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-W.png'),
    orcAttackRight: new ImageSource('../../public/images/Enemy-Melee-Attack-E.png'),
    orcAttackUp: new ImageSource('../../public/images/Enemy-Melee-Attack-N.png'),
    orcAttackDown: new ImageSource('../../public/images/Enemy-Melee-Attack-S.png'),
    orcAttackDownLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-SW.png'),
    orcAttackDownRight: new ImageSource('../../public/images/Enemy-Melee-Attack-SE.png'),
    orcAttackUpLeft: new ImageSource('../../public/images/Enemy-Melee-Attack-NW.png'),
    orcAttackUpRight: new ImageSource('../../public/images/Enemy-Melee-Attack-NE.png'),
    //tiles
    Level1: new TiledResource('../../publicn/maps/grassland.tmx', {strict: false, useTilemapCameraStrategy: true},),
}






const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }