import player from "~/.player";
import enemy from "~./enemy";
import map from "./map";

const SCREEN_WIDTH  = 1024;
const SCREEN_HEIGHT = 576;
const GAME_SPEED = 1000/60;

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

//ゲーム初期化
function gameInit()
{
	setInterval( gameLoop , GAME_SPEED );
}
//ゲームループ
function gameLoop()
{
    
}

window.onload=function()
{
	gameInit();
}

