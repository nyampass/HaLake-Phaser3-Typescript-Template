export interface Vector2{ x: number, y: number } 
export interface TilePos{ tx: number, ty: number }
export interface Size2{ w: number, y: number }

export type MoveDir = 0 | 1 | -1

export type MoveState = {
  x: MoveDir
  y: MoveDir
}

export interface MoveKeyboard{
  front: Phaser.Input.Keyboard.Key
  back: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
}