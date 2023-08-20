//デバッグのフラグ
const DEBUG = false;

let drawCount=0;
let fps=0;
let lastTime=Date.now();

// スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
const GAME_SPEED = 1000/60;

//キャンバスサイズ
const CANVAS_W = 1024;//16
const CANVAS_H =576;//9

//キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width  = CANVAS_W;
can.height = CANVAS_H;
con.mozimageSmoothingEnagbled   = SMOOTHING;
con.webkitimageSmoothingEnabled = SMOOTHING;
con.msimageSmoothingEnabled     = SMOOTHING;
con.imageSmoothingEnabled       = SMOOTHING;
//con.font="20px 'Impact'";

//
let gameOver = false;
let titleFlag = true;
let score = 0;

//
let bossHP =0;
let bossMHP =0;

//基本のサイズ
let basic_size = .35;

//ボスのサイズ
let boss_size = .7;

//マウスの状態
let mouse = [];

//マウスのクリック状態
let mouse_click = false;

//キーボードの状態
let key=[];

//オブジェクト達
let teki=[];
let teta=[];
let tama=[];
let jiki = new Jiki();
//teki[0]= new Teki( 75, 200<<8,200<<8, 0,0);

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";

let BGM = new Audio("bgm_8bit02.mp3");
let jikiShotSE = new Audio("soundeffects01.mp3");
let jikiOutSE = new Audio("game_explosion8.mp3");
let tekiOutSE = new Audio("game_explosion6.mp3");

BGM.volume        = .1;
jikiShotSE.volume = .2;
jikiOutSE.volume  = .2;
tekiOutSE.volume  = .2;


//ゲーム初期化
function gameInit()
{
	setInterval( gameLoop , GAME_SPEED );
}

//オブジェクトをアップデート
function updateObj( obj )
{
	for(let i=obj.length-1;i>=0;i--)
	{
		obj[i].update();
		if(obj[i].kill)obj.splice( i,1 );
	}
}

//オブジェクトを描画
function drawObj( obj )
{
	for(let i=0;i<obj.length;i++)obj[i].draw();
}


//移動の処理
function updateAll()
{
	updateObj(tama);
	updateObj(teta);
	updateObj(teki);
	if(!gameOver)jiki.update();
}

//描画の処理
function drawAll()
{
	//描画の処理
	
	con.fillStyle=(jiki.damage)?"red":"black";
	con.fillRect(0,0,CANVAS_W,CANVAS_H);
	
	drawObj( tama );
	if(!gameOver)jiki.draw();
	
	drawObj( teki );
	drawObj( teta );
	
	

	//ボスのHPを表示する
	
	if( bossHP>0 )
	{
		let sz  = (CANVAS_W-20)*bossHP/bossMHP;
		let sz2 = (CANVAS_W-20);
		
		con.fillStyle="rgba(255,0,0,0.5)";
		con.fillRect(10,10,sz,10);
		con.strokeStyle="rgba(255,0,0,0.9)";
		con.strokeRect(10,10,sz2,10);
	}
	
	//自機のHPを表示する
	
	if( jiki.hp>0 )
	{
		let sz  = (CANVAS_W-20)*jiki.hp/jiki.mhp;
		let sz2 = (CANVAS_W-20);
		
		con.fillStyle="rgba(0,0,255,0.5)";
		con.fillRect(10,CANVAS_H-14,sz,10);
		con.strokeStyle="rgba(0,0,255,0.9)";
		con.strokeRect(10,CANVAS_H-14,sz2,10);
	}
	
	//スコア表示
	
	con.fillStyle ="white";
	con.fillText("SCORE "+score,10,14 );
	
	
}

//配列に入ったオブジェクトを削除
function deleteObj(obj)
{
	let objLength = obj.length;
	for(let i=0;i<objLength;i++) obj.splice(0,1);
}

//全てのオブジェクトを削除
function deleteAll()
{
	deleteObj(teki);
	deleteObj(tama);
	deleteObj(teta);
}

//情報の表示
function putInfo()
{
	con.fillStyle ="white";
	
	if( gameOver )
	{
		let s = "GAME OVER";
		let w = con.measureText(s).width;
		let x = CANVAS_W/2 - w/2;
		let y = CANVAS_H/2 - 20;
		con.fillText(s,x,y);
		s = "Push 'R' key to restart !";
		w = con.measureText(s).width;
		x = CANVAS_W/2 - w/2;
		y = CANVAS_H/2 - 20+20;
		con.fillText(s,x,y);
	}
	
	if(DEBUG)
	{
		drawCount++;
		if( lastTime +1000 <= Date.now() )
		{
			fps=drawCount;
			drawCount=0;
			lastTime=Date.now();
		}
		
		
		con.fillText("FPS :"+fps,20,20);
		con.fillText("Tama:"+tama.length,20,40);
		con.fillText("Teki:"+teki.length,20,60);
		con.fillText("Teta:"+teta.length,20,80);
		con.fillText("X:"+(jiki.x>>8),20,120);
		con.fillText("Y:"+(jiki.y>>8),20,140);
		con.fillText("HP:"+jiki.hp,20,160);
		con.fillText("SCORE:"+score,20,180);
		con.fillText("COUNT:"+gameCount,20,200);
		con.fillText("WAVE:" +gameWave,20,220);
		con.fillText("mouse_X" + mouse[0] + ", mouse_Y" + mouse[1], 20, 240);
		con.fillText("RADIAN" + getrad(jiki.x>>8,jiki.y>>8,mouse[0],mouse[1]), 20, 260);
	}
}
let gameCount  =0;
let gameWave   =0;
let gameRound  =0;

//ゲームループ
function gameLoop()
{
	if(titleFlag)
	{
		//タイトルを表示
		con.fillStyle="black";
		con.fillRect(0,0,CANVAS_W,CANVAS_H);

		con.fillStyle ="white";

		con.font = '48px Meiryo';
		let gameTitle   = "OYK_SHOOTING"
		let gameTitle_W = con.measureText(gameTitle).width;
		let gameTitle_X = CANVAS_W/2 - gameTitle_W/2;
		let gameTitle_Y = CANVAS_H/2 - 20;
		con.fillText(gameTitle, gameTitle_X, gameTitle_Y, 400);

		con.font = '20px Meiryo';
		let message1   = "Click or push space to start !";
		let message1_W = con.measureText(message1).width;
		let message1_X = CANVAS_W/2 - message1_W/2;
		let message1_Y = CANVAS_H/2 - 20+80;
		con.fillText(message1, message1_X, message1_Y);
		
		con.font = '16px Meiryo';

		//タイトルから抜ける
		if(key[32] || mouse_click)
		{
			titleFlag = false;

			BGM.currentTime = 0;
			BGM.play();
			BGM.loop = true;
		}
	}
	
	if(!titleFlag)
	{
		//初期化処理
		if( gameOver && key[82] )
		{
			deleteAll();

			delete jiki;
			jiki = new Jiki();
			gameOver=false;
			score = 0;
			gameCount  =0;
			gameWave   =0;
			gameRound  =0;
			bossHP = 0;
			bossMHP = 0;

			BGM.currentTime = 0;
		}

		gameCount++;

		let randNum;

		if(gameRound < 5)
		{
			randNum = 260 - (gameRound*25);
		}
		else randNum = 130;

		if(gameRound!=0 && gameWave==0) gameWave=2; //チュートリアルスキップ
		
		if( gameWave == 0 && !gameOver)	//チュートリアル
		{
			if( rand(0,randNum/2)==1 )
			{
				let spawn=rand(0,3);
				if(spawn==0) teki.push( new Teki( 0,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
				else if(spawn==1) teki.push( new Teki( 0,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
				else if(spawn==2) teki.push( new Teki( 0, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
				else if(spawn==3) teki.push( new Teki( 0, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
			}
			if( gameCount >60*10 )
			{
				gameWave++;
				gameCount=0;
			}
		}
		else if( gameWave == 1 && !gameOver) //wave1
		{
			if( rand(0,2*randNum/3)==1 && teki.length < 10)
			{
				let r = rand(0,2);
				if(r = 0) //敵1
				{
					let spawn=rand(0,3);
					if(spawn==0) teki.push( new Teki( 0,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
					else if(spawn==1) teki.push( new Teki( 0,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
					else if(spawn==2) teki.push( new Teki( 0, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
					else if(spawn==3) teki.push( new Teki( 0, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
				};
				if(r = 1||2) //敵2
				{
					let spawn=rand(0,3);
					if(spawn==0) teki.push( new Teki( 1,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
					else if(spawn==1) teki.push( new Teki( 1,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
					else if(spawn==2) teki.push( new Teki( 1, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
					else if(spawn==3) teki.push( new Teki( 1, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
				}
			}
			if( gameCount >60*20 )
			{
				gameWave++;
				gameCount=0;
			}
		}
		else if( gameWave == 2 && !gameOver) //wave2
		{
			if( rand(0,randNum)==1 && teki.length <12) //敵1or2
			{
				let r=rand(0,1);
				let spawn=rand(0,3);
				if(spawn==0) teki.push( new Teki( r,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
				else if(spawn==1) teki.push( new Teki( r,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
				else if(spawn==2) teki.push( new Teki( r, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
				else if(spawn==3) teki.push( new Teki( r, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
			}
			if( rand(0,randNum)==2 && teki.length <12) //敵3
			{
				let spawn=rand(0,3);
				if(spawn==0) teki.push( new Teki( 2,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
				else if(spawn==1) teki.push( new Teki( 2,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
				else if(spawn==2) teki.push( new Teki( 2, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
				else if(spawn==3) teki.push( new Teki( 2, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
			}
			if( gameCount >60*20 )
			{
				gameWave++;
				gameCount=0;
			}
		}
		else if( gameWave == 3 && !gameOver) //wave3
		{
			if( rand(0,randNum)==1 && gameCount <=60*25 && teki.length <13) //敵2or3
			{
				let r=rand(1,2);
				let spawn=rand(0,3);
				if(spawn==0) teki.push( new Teki( r,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
				else if(spawn==1) teki.push( new Teki( r,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
				else if(spawn==2) teki.push( new Teki( r, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
				else if(spawn==3) teki.push( new Teki( r, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
			}
			if( (rand(0, randNum)==3 || rand(0, randNum)==4) && gameCount <=60*25 && gameCount >=60*10 && teki.length <13) //敵5
			{
				let spawn=rand(0,3);
				if(spawn==0) teki.push( new Teki( 4,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ) //上
				else if(spawn==1) teki.push( new Teki( 4,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
				else if(spawn==2) teki.push( new Teki( 4, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ) //左
				else if(spawn==3) teki.push( new Teki( 4, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
			}
			else if(teki.length==0 && gameCount>=60*25)
			{
				gameWave++;
				gameCount=0;
			}
		}
		else if( gameWave == 4 && !gameOver) //wave4
		{
			if(gameCount == 2)
			{
				for(let i=0;i<3+gameRound;i++)
				{
					let spawn=rand(0,3);
					if(spawn==0) teki.push( new Teki( 3,rand(0,CANVAS_W)<<8 ,0, 0, rand(300,1200), basic_size ) ); //上
					else if(spawn==1) teki.push( new Teki( 3,rand(0,CANVAS_W)<<8, CANVAS_H<<8, 0, rand(300,1200), basic_size )) //下
					else if(spawn==2) teki.push( new Teki( 3, 0 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size ) ); //左
					else if(spawn==3) teki.push( new Teki( 3, CANVAS_W<<8 ,rand(0, CANVAS_H)<<8, 0, rand(300,1200), basic_size )) //右
				}
			}
			if(teki.length==0 && gameCount>3)
			{
				gameWave++;
				gameCount=0;
				teki.push( new Teki( 5,(CANVAS_W/2)<<8 ,-(70<<8), 0,200, boss_size));
			}
		}
		else if(gameWave == 5 && !gameOver) //wave5
		{
			if( teki.length==0 )
			{
				gameWave=0;
				gameCount=0;
				gameRound++;
			}
		}
		
		updateAll();
		drawAll();
		putInfo();
	}
}

//オンロードでゲーム開始
window.onload=function()
{
	gameInit();
	//teki.push( new Teki(2,(FIELD_W/2)<<8 ,0, 0,200 ) );
}