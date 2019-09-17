import 'phaser'
import { Objects } from './objects'
import { SpriteFrame } from '../gameParameters'
import { Vector2, TilePos, MoveKeyboard, MoveState, MoveDir } from '../gameInterfaces'
import { addSprite, getTileToPos, getMoveKeyboard, addGridWalkTween, increaseTilePos } from '../gameUtils'
import { collideLayer } from '../gameLayers'

type AnimState = 'walk_front' | 'walk_back' | 'walk_left' | 'walk_right' | ''

export class Player implements Objects{ 
  private scene: Phaser.Scene 
  private player: Phaser.GameObjects.Sprite
  private pos: Vector2
  private tilePos: TilePos
  private moveKey: MoveKeyboard
  private walkSpeed: number = 32
  private moveState: MoveState
  private animState: AnimState
  private isMoving: boolean

  private anims: {key: AnimState, frameStart: number, frameEnd: number, spriteKey: string}[] = [ 
    {key: 'walk_front', frameStart: 0, frameEnd: 2, spriteKey: 'player'},
    {key: 'walk_back', frameStart: 9, frameEnd: 11, spriteKey: 'player'},
    {key: 'walk_left',frameStart: 3, frameEnd: 5, spriteKey: 'player'},
    {key: 'walk_right', frameStart: 6, frameEnd: 8, spriteKey: 'player'},
  ]

  constructor(scene: Phaser.Scene, tilePos: TilePos){
    this.scene = scene
    this.pos = getTileToPos(tilePos)
    this.tilePos = tilePos
    this.moveKey = getMoveKeyboard(this.scene, 's', 'w', 'a', 'd')
    this.moveState = { x: 0, y: 0 }
    this.animState = ''
    this.isMoving = false
  }

  public preload(){
    this.scene.load.spritesheet('player', '../assets/sprites/hero.png', { frameWidth: SpriteFrame.w, frameHeight: SpriteFrame.h })
  }

  public create(){
    this.player = addSprite​​(this.scene, this.pos, 'player', 0)
    this.player.setOrigin(0)

    for(let a of this.anims){
      if(this.scene.anims.create(this.animConfig(a)) === false) continue
        
      this.player.anims.load(a.key)
    }
  }

  public update(){
    if(this.isMoving) return
    this.isMoving = true

    let animState: AnimState = ''
    let movedTilePos: TilePos = { tx: 0, ty: 0 }

    this.moveState.x = 0
    this.moveState.y = 0

    if(this.moveKey.front.isDown){
      this.moveState.y = 1
      animState = 'walk_front'
    }else if(this.moveKey.back.isDown){
      this.moveState.y = -1
      animState = 'walk_back'
    }else if(this.moveKey.left.isDown){
      this.moveState.x = -1
      animState = 'walk_left'
    }else if(this.moveKey.right.isDown){
      this.moveState.x = 1
      animState = 'walk_right'
    }else{
      this.isMoving = false
      this.moveState.x = 0
      this.moveState.y = 0
      if(this.animState == 'walk_front') this.player.setFrame(1)
      else if(this.animState == 'walk_back') this.player.setFrame(10)
      else if(this.animState == 'walk_left') this.player.setFrame(4)
      else if(this.animState == 'walk_right') this.player.setFrame(7)
      animState = ''
    }

    if(this.animState != animState){
      if(animState == '') this.player.anims.stop()
      else this.player.anims.play(animState)

      this.animState = animState
    }

    movedTilePos = increaseTilePos(this.tilePos, this.moveState.x, this.moveState.y)
    if(movedTilePos.tx < 0 || movedTilePos.ty < 0) { this.isMoving = false; return; }
    if(collideLayer​​[movedTilePos.ty][movedTilePos.tx] == 1 || collideLayer​​[movedTilePos.ty][movedTilePos.tx] == undefined) { this.isMoving = false; return; }
    this.tilePos = movedTilePos

    if(animState != '') addGridWalkTween​​(this.scene, this.player, this.walkSpeed, this.moveState, () => { this.isMoving = false; console.log('hoge') })
  }

  private animConfig(config: {key: AnimState, spriteKey: string, frameStart: number, frameEnd: number}): Phaser.Types.Animations.Animation{
    return {
      key: config.key,
      frames: this.scene.anims.generateFrameNumbers(
        config.spriteKey, 
        {
          start: config.frameStart,
          end: config.frameEnd
        }
      ),
      frameRate: 8,
      repeat: -1
    }
  }

  public gameObject(): Phaser.GameObjects.Sprite{
    return this.player
  }
}