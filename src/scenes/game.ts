import * as Phaser from "phaser";

type WalkAnimState = 'walk_front' | 'walk_back' | 'walk_left' | 'walk_right' | ''
type MoveDir = -1 | 0 | 1

export class Game extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap
  private mapEvent: Phaser.Tilemaps.Tilemap
  private tiles: Phaser.Tilemaps.Tileset
  private map_ground_layer: Phaser.Tilemaps.StaticTilemapLayer
  private map_event_layer: Phaser.Tilemaps.StaticTilemapLayer
  private hero: Phaser.GameObjects.Sprite 
  private heroAnimState: WalkAnimState
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private heroIsWalking: boolean
  private heroIsTalking: boolean
  private heroWalkSpeed: number = 40
  private heroTilePos: {tx: number, ty: number}
  private serifFrame: Phaser.GameObjects.Image
  private serif: Phaser.GameObjects.Text
  private serifArea: Phaser.GameObjects.Container

  private serifStyle: object = {
    fontSize: '40px',
    color: 'black',
    wordWrap: { 
      width: 730, 
      useAdvancedWrap: true 
    }
  }

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

  private map_event: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ] // 20 * 15

  init() {
    console.log('Initializing.')

    this.cursors = this.input.keyboard.createCursorKeys();
    this.heroAnimState = ''
    
    this.heroIsWalking = false
    this.heroIsTalking = false

    this.heroTilePos = {tx: 10, ty: 8}
  }

  preload() {
    console.log('Load assets.')

    this.load.image('mapTiles', `../../assets/images/map_tile.png`)
    this.load.image('mapEventTiles', `../../assets/images/npcs.png`)
    this.load.spritesheet('hero', '../../assets/images/hero.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('serifFrame', '../../assets/images/frame.png')
  }

  create() {
    console.log('Draw objects to canvas.')

    let heroPos: Phaser.Math.Vector2

    this.map = this.make.tilemap({ data: this.map_ground, tileWidth: 40, tileHeight: 40 })
    this.tiles = this.map.addTilesetImage(`mapTiles`)
    this.map_ground_layer = this.map.createStaticLayer(0, this.tiles, 0, 0)

    this.mapEvent = this.make.tilemap({ data: this.map_event, tileWidth:40, tileHeight: 40 })
    this.tiles = this.mapEvent.addTilesetImage(`mapEventTiles`)
    this.map_event_layer = this.mapEvent.createStaticLayer(0, this.tiles, 0, 0)

    heroPos = this.map_ground_layer.tileToWorldXY(this.heroTilePos.tx, this.heroTilePos.ty)

    this.hero = this.add.sprite(heroPos.x + 20, heroPos.y + 20, 'hero', 0)
    this.hero.setDisplaySize(40, 40)

    this.serifFrame = this.add.image(0, 0, 'serifFrame')
    this.serifFrame.setDisplaySize(800, 120)

    this.serif = this.add.text(-370, -50, '', this.serifStyle)

    this.serifArea = this.add.container(400, 540)
    this.serifArea.add([this.serifFrame, this.serif])
    this.serifArea.setVisible(false)

    for(let heroAnim of this.heroAnims){
      if(this.anims.create(this.heroAnimConfig(heroAnim)) === false) continue
        
      this.hero.anims.load(heroAnim.key)
    }

    this.hero.anims.play('walk_front')

    this.input.keyboard.addKey('Enter').on('down', () => {
      const heroFacing: {tx: number, ty: number} | undefined = this.getNowHeroFaceTilePos()
      const heroLastAnim: WalkAnimState | string = this.hero.anims.getCurrentKey()
      const eventIndex: number = this.map_event[heroFacing.ty][heroFacing.tx]
      let serif: string = ``

      if(heroFacing === undefined) return
      if(eventIndex <= 0) return

      if(this.heroIsTalking){
        this.heroIsTalking = false
        this.serifArea.setVisible(false)
      }else{

        this.heroIsTalking = true

        if(eventIndex == 2){
          if(heroLastAnim == 'walk_back') serif = 'にゃ〜'
          else serif = 'しょうめんからはなしかけてくれにゃ〜'
        }else if(eventIndex == 1){
          if(heroLastAnim == 'walk_back') serif = 'あらあら、こんにちわ'
          else serif = 'しょうめんからはなしかけてもらえるとうれしいんだけどねぇ〜'
        }else if(eventIndex == 3){
          if(heroLastAnim == 'walk_back') serif = 'よくきたな'
          else serif = 'しょうめんからはなしかけないとたましいをいただく'
        }else return

        this.serifArea.setVisible(true)
        this.serif.text = serif
      }
    })
  }

  update() {
    console.log('Call at every frames.')

    if(this.heroIsWalking) return
    if(this.heroIsTalking) return 

    let heroAnimState: WalkAnimState = ''
    let heroXDir: MoveDir = 0
    let heroYDir: MoveDir = 0
    let heroNewTilePos: {tx: number, ty: number} = this.heroTilePos

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

    if(this.heroAnimState != heroAnimState){
      this.hero.anims.play(heroAnimState)
      this.heroAnimState = heroAnimState
    }

    heroNewTilePos = {tx: heroNewTilePos.tx + heroXDir, ty: heroNewTilePos.ty + heroYDir}

    if(heroNewTilePos.tx < 0) return 
    if(heroNewTilePos.ty < 0) return
    if(heroNewTilePos.tx >= 20) return 
    if(heroNewTilePos.ty >= 15) return

    if(this.map_ground[heroNewTilePos.ty][heroNewTilePos.tx] == 1) return
    if(this.map_event[heroNewTilePos.ty][heroNewTilePos.tx] != 0) return

    this.heroTilePos = heroNewTilePos
    this.heroIsWalking = true
    this.gridWalkTween(this.hero, this.heroWalkSpeed, heroXDir, heroYDir, () => {this.heroIsWalking = false})
  }

  private getNowHeroFaceTilePos(): {tx: number, ty: number} | undefined{
    if(this.heroIsWalking) return undefined

    const heroLastAnim: WalkAnimState | string = this.hero.anims.getCurrentKey()
    let dir: {dx: MoveDir, dy: MoveDir} = {dx: 0, dy: 0}
    let nowPos: {tx: number, ty: number} = this.heroTilePos
    let facing: {tx: number, ty: number} = {tx: 0, ty: 0}

    if(heroLastAnim == 'walk_front')
      dir.dy = 1
    else if(heroLastAnim == 'walk_left')
      dir.dx = -1
    else if(heroLastAnim == 'walk_right')
      dir.dx = 1
    else if(heroLastAnim == 'walk_back')
      dir.dy = -1

    facing = {tx: nowPos.tx + dir.dx, ty: nowPos.ty + dir.dy}
    if(facing.tx > 20 || facing.tx < 0) return undefined
    if(facing.ty > 15 || facing.ty < 0) return undefined

    return facing
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