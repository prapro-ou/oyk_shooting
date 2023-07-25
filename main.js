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
const scene = 1; //ゲームのシーンを管理する
const gameFlag = 0; //ゲームの進行を管理する

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

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

//キーボードの状態
let key = [];

//各オブジェクト
let enemy = [];
let bullet = [];
let player = new Player();

//ファイル読み込み
let playerImage = new Image();
playerImage.src = "assets/image/player.png";

let bulletImage = new Image();
bulletImage.src = "assets/image/bullet.png";

//オブジェクトのアップデート
function updateObj(obj)
{
    for(let i=0; i>=0; i--)
    {
        obj[i].update();
        if(obj[i].kill) obj.splice(i, 1);
    }
}

//オブジェクトの描画
function drawObj(obj)
{
    for(let i=0;i<obj.length;i++) obj[i].draw();
}

//アップデート処理
function updateAll()
{
    updateObj(bullet);
    updateObj(enemy);
    player.update();
}

//描画処理
function drawAll()
{
    
    drawObj(wall);
    drawObj(bullet);
    drawObj(enemy);
    player.draw();
}

//ゲーム初期化
function gameInit()
{
    scene = 1;
    gameFlag = 0;
	setInterval( gameLoop , GAME_SPEED );
}
//ゲームループ
function gameLoop()
{
    
    if(scene==1) //タイトル
    {
        scene = 2;
    }
    else if(scene==2) //ゲームの部分
    {
        if(gameFlag==0)
        {
            //setTimeout(function() {gameFlag=1}, 3000)
            gameFlag=1;
            //敵や壁の生成をする
        }
        if(gameFlag==1)
        {
            updateAll();
            drawAll();
        }
        
    }

}

window.onload=function()
{
	gameInit();
}

