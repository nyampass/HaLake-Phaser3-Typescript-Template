import * as Phaser from "phaser";

export class Game extends Phaser.Scene {
  init() {
    console.log('Initializing.')
  }

  preload() {
    console.log('Load assets.')
  }

  create() {
    console.log('Draw objects to canvas.')
  }

  update() {
    console.log('Call at every frames.')
  }
}