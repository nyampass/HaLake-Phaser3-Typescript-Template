import * as Phaser from "phaser";

type WalkAnimState = 'walk_front' | 'walk_back' | 'walk_left' | 'walk_right' | ''
type MoveDir = -1 | 0 | 1

export class Game extends Phaser.Scene {
  private map?: Phaser.Tilemaps.Tilemap
  private tiles?: Phaser.Tilemaps.Tileset
  private map_ground_layer?: Phaser.Tilemaps.StaticTilemapLayer
  private hero?: Phaser.GameObjects.Sprite
  private heroAnimState: WalkAnimState
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private heroIsWalking: boolean
  private heroWalkSpeed: number = 40
  private heroTilePos: {tx: number, ty: number}

  private heroAnims: {key: string, frameStart: number, frameEnd: number}[] = [
    {key: 'walk_front', frameStart: 0, frameEnd: 2},
    {key: 'walk_back', frameStart: 9, frameEnd: 11},
    {key: 'walk_left', frameStart: 3, frameEnd: 5},
    {key: 'walk_right',frameStart: 6, frameEnd: 8},
  ]

  private map_ground: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  ] // 20 * 15

  init() {
    console.log('Initializing.')

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heroAnimState = ''
    
    this.heroIsWalking = false

    this.heroTilePos = {tx: 10, ty: 8}
  }

  preload() {
    console.log('Load assets.')

    this.load.image('mapTiles', `../../assets/images/map_tile.png`)
    this.load.spritesheet('hero', '../../assets/images/hero.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    console.log('Draw objects to canvas.')

    let heroPos: Phaser.Math.Vector2

    this.map = this.make.tilemap({ data: this.map_ground, tileWidth: 40, tileHeight: 40 })
    this.tiles = this.map.addTilesetImage(`mapTiles`)
    this.map_ground_layer = this.map.createStaticLayer(0, this.tiles, 0, 0)

    heroPos = this.map_ground_layer.tileToWorldXY(this.heroTilePos.tx, this.heroTilePos.ty)

    this.hero = this.add.sprite(heroPos.x, heroPos.y, 'hero', 0)
    this.hero.setOrigin(0)
    this.hero.setDisplaySize(40, 40)

    for(let heroAnim of this.heroAnims){
      if(this.anims.create(this.heroAnimConfig(heroAnim)) === false) continue
        
      this.hero.anims.load(heroAnim.key)
    }

    this.hero.anims.play('walk_front')
  }

  update() {
    console.log('Call at every frames.')

    if(this.heroIsWalking) return

    let heroAnimState: WalkAnimState = ''
    let heroXDir: MoveDir = 0
    let heroYDir: MoveDir = 0

    if(this.cursors.up.isDown){ 
      heroAnimState = 'walk_back'
      heroYDir = -1
    }else if(this.cursors.down.isDown){
      heroAnimState = 'walk_front'
      heroYDir = 1
    }else if(this.cursors.left.isDown){
      heroAnimState = 'walk_left'
      heroXDir = -1
    }else if(this.cursors.right.isDown){
      heroAnimState = 'walk_right'
      heroXDir = 1
    }else{
      this.hero.anims.stop()
      this.heroAnimState = ''
      return
    }

    this.heroIsWalking = true
    this.gridWalkTween(this.hero, this.heroWalkSpeed, heroXDir, heroYDir, () => {this.heroIsWalking = false})

    if(this.heroAnimState != heroAnimState){
      this.hero.anims.play(heroAnimState)
      this.heroAnimState = heroAnimState
    }
  }

  private gridWalkTween(target: any, baseSpeed: number, xDir: MoveDir, yDir: MoveDir, onComplete: () => void){
    if(target.x === false) return 
    if(target.y === false) return

    let tween: Phaser.Tweens.Tween = this.add.tween({
      targets: [target],
      x: {
        getStart: () => target.x,
        getEnd: () => target.x + (baseSpeed * xDir)
      },
      y: {
        getStart: () => target.y,
        getEnd: () => target.y + (baseSpeed * yDir)
      },
      duration: 300,
      onComplete: () => {
        tween.stop()
        onComplete()
      }
    })
  }

  private heroAnimConfig(config: {key: string, frameStart: number, frameEnd: number}): Phaser.Types.Animations.Animation{
    return {
      key: config.key,
      frames: this.anims.generateFrameNumbers(
        `hero`, 
        {
          start: config.frameStart,
          end: config.frameEnd
        }
      ),
      frameRate: 8,
      repeat: -1
    }
  }
}