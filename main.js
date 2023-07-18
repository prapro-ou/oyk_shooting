class DanmakuStgMainScene extends Scene {
    constructor(renderingTarget) {
        super('メイン', 'black', renderingTarget);
        const shooter = new Player(150, 300);
        this.add(shooter);
    }
}

const SCREEN_WIDTH  = 1024;
const SCREEN_HEIGHT = 576;
const GAME_SPEED = 1000/60;
const scene = 1;


class DanamkuStgGame extends Game {
    constructor() {
        super('弾幕STG', 300, 400, 60);
        const mainScene = new DanmakuStgMainScene(this.screenCanvas);
        this.changeScene(mainScene);
    }
}

assets.addImage('sprite', 'assets/image/sprite.png');
assets.addImage('sprite2', 'assets/image/sprite2.png');
assets.loadAll().then((a) => {
    const game = new DanamkuStgGame();
    document.body.appendChild(game.screenCanvas);
    game.start();
});

//ゲーム初期化
function gameInit()
{
    scene = 1;
	setInterval( gameLoop , GAME_SPEED );
}
//ゲームループ
function gameLoop()
{
    
    if(scene==1) //タイトル
    {

    }
    else if(scene==2) //ゲームの部分
    {

    }

}

window.onload=function()
{
	gameInit();
}

