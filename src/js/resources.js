import { ImageSource, Sound, Resource, Loader } from 'excalibur'
import { TiledResource } from '@excaliburjs/plugin-tiled';

// voeg hier jouw eigen resources toe
const Resources = {
    //playerSheets
    playerLeft: new ImageSource('/images/playerLeft.png'),
    playerRight: new ImageSource('/images/playerRight.png'),
    playerUp: new ImageSource('/images/playerUp.png'),
    playerDown: new ImageSource('/images/playerDown.png'),
    playerDown_left: new ImageSource('/images/playerDown_left.png'),
    playerDown_right: new ImageSource('/images/playerDown_right.png'),
    playerUp_left: new ImageSource('/images/playerUp_left.png'),
    playerUp_right: new ImageSource('/images/playerUp_right.png'),
    //enemySheets
    enemyWalkLeft: new ImageSource('/images/Enemy-Melee-Idle-W.png'),
    enemyWalkRight: new ImageSource('/images/Enemy-Melee-Idle-E.png'),
    enemyWalkUp: new ImageSource('/images/Enemy-Melee-Idle-N.png'),
    enemyWalkDown: new ImageSource('/images/Enemy-Melee-Idle-S.png'),
    enemyWalkDown_left: new ImageSource('/images/Enemy-Melee-Idle-SW.png'),
    enemyWalkDown_right: new ImageSource('/images/Enemy-Melee-Idle-SE.png'),
    enemyWalkUp_left: new ImageSource('/images/Enemy-Melee-Idle-NW.png'),
    enemyWalkUp_right: new ImageSource('/images/Enemy-Melee-Idle-NE.png'),
    //enemyAttackSheets
    enemyAttackLeft: new ImageSource('/images/Enemy-Melee-Attack-W.png'),
    enemyAttackRight: new ImageSource('/images/Enemy-Melee-Attack-E.png'),
    enemyAttackUp: new ImageSource('/images/Enemy-Melee-Attack-N.png'), 
    enemyAttackDown: new ImageSource('/images/Enemy-Melee-Attack-S.png'),
    enemyAttackDown_left: new ImageSource('/images/Enemy-Melee-Attack-SW.png'),
    enemyAttackDown_right: new ImageSource('/images/Enemy-Melee-Attack-SE.png'),
    enemyAttackUp_left: new ImageSource('/images/Enemy-Melee-Attack-NW.png'),
    enemyAttackUp_right: new ImageSource('/images/Enemy-Melee-Attack-NE.png'),  
    shadowWalkLeft: new ImageSource('/images/Enemy-Melee-Idle-W.png'),
    shadowWalkRight: new ImageSource('/images/Enemy-Melee-Idle-E.png'),
    shadowWalkUp: new ImageSource('/images/Enemy-Melee-Idle-N.png'),
    shadowWalkDown: new ImageSource('/images/Enemy-Melee-Idle-S.png'),
    shadowWalkDownLeft: new ImageSource('/images/Enemy-Melee-Idle-SW.png'),
    shadowWalkDownRight: new ImageSource('/images/Enemy-Melee-Idle-SE.png'),
    shadowWalkUpLeft: new ImageSource('/images/Enemy-Melee-Idle-NW.png'),
    shadowWalkUpRight: new ImageSource('/images/Enemy-Melee-Idle-NE.png'),
    shadowAttackLeft: new ImageSource('/images/Enemy-Melee-Attack-W.png'),
    shadowAttackRight: new ImageSource('/images/Enemy-Melee-Attack-E.png'),
    shadowAttackUp: new ImageSource('/images/Enemy-Melee-Attack-N.png'),
    shadowAttackDown: new ImageSource('/images/Enemy-Melee-Attack-S.png'),
    shadowAttackDownLeft: new ImageSource('/images/Enemy-Melee-Attack-SW.png'),
    shadowAttackDownRight: new ImageSource('/images/Enemy-Melee-Attack-SE.png'),
    shadowAttackUpLeft: new ImageSource('/images/Enemy-Melee-Attack-NW.png'),
    shadowAttackUpRight: new ImageSource('/images/Enemy-Melee-Attack-NE.png'),
    orcWalkLeft: new ImageSource('/images/Enemy-Melee-Idle-W.png'),
    orcWalkRight: new ImageSource('/images/Enemy-Melee-Idle-E.png'),
    orcWalkUp: new ImageSource('/images/Enemy-Melee-Idle-N.png'),
    orcWalkDown: new ImageSource('/images/Enemy-Melee-Idle-S.png'),
    orcWalkDownLeft: new ImageSource('/images/Enemy-Melee-Idle-SW.png'),
    orcWalkDownRight: new ImageSource('/images/Enemy-Melee-Idle-SE.png'),
    orcWalkUpLeft: new ImageSource('/images/Enemy-Melee-Idle-NW.png'),
    orcWalkUpRight: new ImageSource('/images/Enemy-Melee-Idle-NE.png'),
    orcAttackLeft: new ImageSource('/images/Enemy-Melee-Attack-W.png'),
    orcAttackRight: new ImageSource('/images/Enemy-Melee-Attack-E.png'),
    orcAttackUp: new ImageSource('/images/Enemy-Melee-Attack-N.png'),
    orcAttackDown: new ImageSource('/images/Enemy-Melee-Attack-S.png'),
    orcAttackDownLeft: new ImageSource('/images/Enemy-Melee-Attack-SW.png'),
    orcAttackDownRight: new ImageSource('/images/Enemy-Melee-Attack-SE.png'),
    orcAttackUpLeft: new ImageSource('/images/Enemy-Melee-Attack-NW.png'),
    orcAttackUpRight: new ImageSource('/images/Enemy-Melee-Attack-NE.png'),
    //tiles
    Level1: new TiledResource('/maps/grassland.tmx', {strict: false, useTilemapCameraStrategy: true},),
}






const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }