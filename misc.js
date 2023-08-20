//
//misc.js  その他いろいろ、共通関数
//

//キャラクターのベースクラス
class CharaBase
{
	constructor( snum, x,y, vx,vy, size )
	{
		this.sn    = snum;
		this.x     = x;
		this.y     = y;
		this.vx    = vx;
		this.vy    = vy;
		this.kill  = false;
		this.count = 0;
		this.size = size;
		this.ang = 0; //自機への方向
	}
	
	update()
	{
		this.count++;
		
		this.x += this.vx;
		this.y += this.vy;
		
		if( this.x+(100<<8)<0 || this.x-(100<<8) >CANVAS_W<<8 
				|| this.y+(100<<8)<0 || this.y-(100<<8)>CANVAS_H<<8 )this.kill = true;
	}
	
	draw()
	{
		drawSprite( this.sn, this.x , this.y , this.size, this.ang);
	}
}

//スプライトを描画する
function drawSprite( snum, x, y ,size, r)
{
	// コンテキストを保存する
    con.save();
    
	// 回転の中心に原点を移動する
    con.translate(x>>8, y>>8);
	
    // canvasを回転する
    con.rotate(r);
	
	let sx = sprite[snum].x;
	let sy = sprite[snum].y;
	let sw = sprite[snum].w;
	let sh = sprite[snum].h;
	
	//スプライトに倍率をかけたもの
	let ww = sw * size;
	let hh = sh * size;

	let px =-(sw/2)*size;
	let py =-(sh/2)*size;
	
	/*
	if( px+sw <0 || px >=CANVAS_W || py+sh <0 || py >=CANVAS_H ){
		con.restore();			
		return;
	}
	*/

	con.drawImage( spriteImage,sx,sy,sw,sh,px,py,ww,hh);
	// コンテキストを元に戻す
    con.restore();
}

//整数のランダムを作る
function rand(min,max)
{
	return Math.floor( Math.random()*(max-min+1) )+min;
}

//当たり判定
function checkHit( x1,y1,r1,  x2,y2,r2 )
{
	// 円同士の当たり判定
	
	let a = (x2-x1)>>8;
	let b = (y2-y1)>>8;
	let r = r1+r2;
	
	return r*r >= a*a + b*b ;
	
	//矩形同士の当たり判定
	
	/*
	let left1   = x1>>8;
	let right1  = left1+w1;
	let top1    = y1>>8;
	let bottom1 = top1 +h1;
	
	let left2   = x2>>8;
	let right2  = left2+w2;
	let top2    = y2>>8;
	let bottom2 = top2 +h2;
	
	return (  left1 <= right2 &&
			right1 >= left2  &&
			  top1 <= bottom2 &&
	   	bottom1 >= top2 );
	*/
	
	
}

//1から見た2のラジアン取得
function getrad(x1, y1, x2, y2)
{
	let an;
	an= Math.atan2( y1-y2 , x1 - x2 ) - Math.PI/2 ;
	return an;
}

//キーボードが押されたとき
document.onkeydown = function(e)
{
	key[ e.keyCode ] = true;
	if(e.keyCode==82||e.keyCode==116)return true;
	return false;
}

//キーボードが離されたとき
document.onkeyup = function(e)
{
	key[ e.keyCode ] = false;
}

//マウスの座標取得
document.onmousemove = function(e) 
{
    mouse[0] = e.pageX - 207;
    mouse[1] = e.pageY - 27;
}

//マウスのクリック
document.onmousedown = function (e) {
	if( e.button == 0 ){
		mouse_click = true;
	}
}

document.onmouseup = function (e) {
	if( e.button == 0 ){
		mouse_click = false;
	}
}
