import { Vector2, TilePos, MoveKeyboard, MoveState } from "./gameInterfaces";
import { SpriteFrame } from "./gameParameters";

export function getTileToPos(tilePos: TilePos): Vector2{
    return { x: tilePos.tx * SpriteFrame.w, y: tilePos.ty * SpriteFrame.h }
}

export function increaseTilePos(tilePos: TilePos, itx: number, ity: number): TilePos{
  return { tx: tilePos.tx + itx , ty: tilePos.ty + ity }
}

export function addSprite(scene: Phaser.Scene, pos: Vector2, texture: string, frame: string | number): Phaser.GameObjects.Sprite{
  return scene.add.sprite(pos.x, pos.y, texture, frame)
}

export function getMoveKeyboard(scene: Phaser.Scene, front: string, back: string, left: string, right: string): MoveKeyboard{
  return {
    front: scene.input.keyboard.addKey(front[0]),
    back: scene.input.keyboard.addKey(back[0]),
    left: scene.input.keyboard.addKey(left[0]),
    right: scene.input.keyboard.addKey(right[0]),
  }
}

export function addGridWalkTween(scene: Phaser.Scene, target: any, moveDistance: number, moveState: MoveState, onComplete: () => void){
  if(target.x === false) return 
  if(target.y === false) return

  let tween: Phaser.Tweens.Tween = scene.add.tween({
    targets: [target],
    x: {
      getStart: () => target.x,
      getEnd: () => target.x + (moveDistance * moveState.x)
    },
    y: {
      getStart: () => target.y,
      getEnd: () => target.y + (moveDistance * moveState.y)
    },
    duration: 200,
    onComplete: () => {
      tween.stop()
      onComplete()
    }
  })
}