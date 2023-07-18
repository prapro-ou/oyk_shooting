const SCREEN_WIDTH  = 1024;
const SCREEN_HEIGHT = 576;
const GAME_SPEED = 1000/60;
const scene = 1;

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

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

