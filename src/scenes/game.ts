import * as Phaser from "phaser"
import { groundLayer } from "../gameLayers"
import { Player } from "../objects/player"
import { SpriteFrame } from "../gameParameters"

export class Game extends Phaser.Scene {
  private player: Player
  private camera: Phaser.Cameras.Scene2D.Camera

  public init(){
    this.player = new Player​​(this, { tx: 10, ty: 10 })
  }

  public preload(){
    this.load.spritesheet('map_1', '../assets/extruded/map_1.png', { frameWidth: SpriteFrame.w + 2, frameHeight: SpriteFrame.h + 2 })
    this.player.preload()
  }

  public create(){
    for(let row in groundLayer){
      for(let col in groundLayer[row]){
        this.add.sprite(parseInt(col) * SpriteFrame.w, parseInt(row) * SpriteFrame.h, 'map_1', groundLayer[row][col])
          .setOrigin(0, 0)
      }
    }

    this.player.create()
    this.camera = this.cameras.main
    this.camera.startFollow(this.player.gameObject())
  }

  public update(){
    this.player.update()
  }
}