import * as Phaser from "phaser";
import { Preload } from "./scenes/preload";
import { Game } from "./scenes/game";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600
    };
    super(config);

    this.scene.add("preload", Preload, false);
    this.scene.add("game", Game, false);
    this.scene.start("preload");
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};