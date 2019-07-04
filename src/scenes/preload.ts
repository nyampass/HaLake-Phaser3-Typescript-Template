import * as Phaser from "phaser";

export class Preload extends Phaser.Scene {
  private startText?: Phaser.GameObjects.Text

  private bk_color: string = '0xe08734'
  private fontStyle: Phaser.Types.GameObjects.Text.TextSyle = {
    color: 'red',
    fontSize: '70px'
  }

  init() {
    console.log("Preloading");
  }

  preload () {
    console.log("Load things necessary for Game scene")
  }

  create() {
    this.cameras.main.setBackgroundColor(this.bk_color)
    this.startText = this.add.text(400, 300, 'START', this.fontStyle)

    this.startText.setOrigin(0.5)

    this.startText.setInteractive()
    this.startText.on('pointerdown', () => {
      this.scene.start('game')
    })
  }
}