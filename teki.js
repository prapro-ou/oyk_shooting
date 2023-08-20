//
//teki.js 敵関連
//

//敵弾クラス
class Teta extends CharaBase
{
	constructor(sn,x,y,vx,vy,size,t)
	{
		super(sn,x,y,vx,vy,size);
		this.r = 3;
		if( t==undefined )this.timer =0;
		else this.timer = t;

	}
	
	update()
	{
		if( this.timer )
		{
			this.timer--;
			return;
		}
		super.update();
		
		if(!gameOver && !jiki.muteki && checkHit(this.x, this.y, this.r,
					jiki.x, jiki.y, jiki.r) )
		{
			this.kill   =true;
			if( (jiki.hp -= 30)<=0 )
			{
				gameOver=true;
			}
			else
			{
				jiki.damage = 10;
				jiki.muteki = 60;
			}

			jikiOutSE.currentTime = 0;
			jikiOutSE.play();
		}
		
		//this.sn=2;
	}
	
	
}

//敵クラス
class Teki extends CharaBase
{
	constructor( t,x,y,vx,vy,size )
	{
		super( 0,x,y,vx,vy,size );
		this.tnum = tekiMaster[t].tnum;
		this.r    = tekiMaster[t].r;
		this.mhp  = tekiMaster[t].hp;
		this.hp   = this.mhp;
		this.score= tekiMaster[t].score;
		this.flag = false;
		
		this.dr   = 90;
		this.relo = 0;
		this.rotate = 0;	//tekiMove5用
	}
	
	update()
	{
		//自機の方向取得
		this.ang = getrad(this.x>>8,this.y>>8,jiki.x>>8,jiki.y>>8);

		//共通のアップデート
		if(this.relo)this.relo--;
		super.update();
		
		//個別のアップデート
		
		tekiFunc[this.tnum](this);
		
		// 当たり判定
		if(!gameOver && !jiki.muteki && checkHit(this.x, this.y, this.r,
					jiki.x, jiki.y, jiki.r) )
		{
			
			if( this.mhp<500) this.kill   =true;
			
			if( (jiki.hp -= 30)<=0 )
			{
				gameOver=true;
			}
			else
			{
				jiki.damage = 10;
				jiki.muteki = 60;
			}
		}
		
	}
}

//弾を自機に向けて発射する
function tekiShot(obj,speed)
{
	if(gameOver)return;
	
	let px = (obj.x>>8);
	let py = (obj.y>>8);
	
	/*
	if( px-40 <0 || px+40 >=CANVAS_W 
			|| py-40 <0 || py+40 >=CANVAS_H )return;
			*/
	
	let an,dx,dy;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	dx = Math.cos( an )* speed;
	dy = Math.sin( an )* speed;
	teta.push( new Teta( 2,obj.x, obj.y, dx, dy, basic_size) );
}

//回転しつつ弾を打つ
function tekiShot_random(obj,speed, an)
{
	if(gameOver)return;
	
	let px = (obj.x>>8);
	let py = (obj.y>>8);
	
	/*
	if( px-40 <0 || px+40 >=CANVAS_W 
			|| py-40 <0 || py+40 >=CANVAS_H )return;
			*/
	
	let dx,dy;
	dx = Math.cos( an )* speed;
	dy = Math.sin( an )* speed;

	//let pushX = obj.x + Math.cos(an) * 40<<8;
	//let pushY = obj.y + Math.sin(an) * 40<<8;
	teta.push( new Teta( 2, obj.x, obj.y, dx, dy, basic_size) );
}

// ボスの移動パターン
function bossMove(obj)
{
	if(!gameOver)
	{
		if(!obj.flag && (obj.y>>8)>=60 )obj.flag=1;
		
		if(obj.flag==1)
		{
			if( (obj.vy-=2)<=0 )
			{
				obj.flag=2;
				obj.vy =0;
			}
		}
		else if(obj.flag==2)
		{
			if( obj.vx<300 )obj.vx+=10;
			if( (obj.x>>8) > (CANVAS_W-100) )obj.flag=3;
		}
		else if(obj.flag==3)
		{
			if( obj.vx>-300 )obj.vx-=10;
			if( (obj.x>>8) < 100 )obj.flag=2;
		}
		
		//弾の発射
		
		if( obj.flag>1 )
		{
			let an,dx,dy;
			an= obj.dr * Math.PI/180;
			dx = Math.cos( an )* 300;
			dy = Math.sin( an )* 300;
			let x2 = (Math.cos( an )*70)<<8;
			let y2 = (Math.sin( an )*70)<<8;

			obj.ang = an;

			if(obj.relo == 0)
			{
				obj.relo = 4;
				teta.push( new Teta( 2,obj.x+x2, obj.y+y2, dx, dy , basic_size, 60) );
			}

			if( (obj.dr+=12) >=360 )obj.dr=0;
		}
		
		// 追加攻撃
		if( obj.hp< obj.mhp/2 )
		{
			
			let c = obj.count%(60*5);
			if( c/10<4 && c%10==0 )
			{
				let an,dx,dy;
				an= (90+45-(c/10)*30) * Math.PI/180;
				dx = Math.cos( an )* 300;
				dy = Math.sin( an )* 300;
				let x2 = (Math.cos( an )*70)<<8;
				let y2 = (Math.sin( an )*70)<<8;
				teki.push( new Teki( 6,obj.x+x2, obj.y+y2, dx, dy, basic_size) );
			}
		}
	}

	if(gameOver)
	{
		obj.vx = 0;
		obj.vy = -100;
	}
	
	//スプライトの変更
	obj.sn = 6;
}

//敵1（三角）の動き
function tekiMove1(obj)
{
	if(!gameOver && !jiki.muteki && checkHit(obj.x, obj.y, obj.r,
		jiki.x, jiki.y, jiki.r) )
	{
		obj.kill   =true;
		if( (jiki.hp -= 30)<=0 )
		{
			gameOver=true;
		}
		else
		{
			jiki.damage = 10;
			jiki.muteki = 60;
		}

		jikiOutSE.currentTime = 0;
		jikiOutSE.play();
	}

	//以下は移動速度
	obj.speed = 500;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	obj.vx = Math.cos( an )* obj.speed;
	obj.vy = Math.sin( an )* obj.speed;

	//ゲームオーバー時の処理
	if(gameOver)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);

		obj.ang += Math.PI;
	}

	obj.sn = 3;
}

//敵2（正方形）の動き
function tekiMove2(obj)
{
	if(!gameOver && !jiki.muteki && checkHit(obj.x, obj.y, obj.r,
		jiki.x, jiki.y, jiki.r) )
	{
		obj.kill   =true;
		if( (jiki.hp -= 30)<=0 )
		{
			gameOver=true;
		}
		else
		{
			jiki.damage = 10;
			jiki.muteki = 60;
		}

		jikiOutSE.currentTime = 0;
		jikiOutSE.play();
	}

	//以下は移動
	obj.speed = 350;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	obj.vx = Math.cos( an )* obj.speed;
	obj.vy = Math.sin( an )* obj.speed;

	//弾発射
	if(!gameOver)
	{
		if(obj.relo == 0 )
		{
			obj.relo = 60;

			let saveX = obj.x;
			let saveY = obj.y;

			obj.x += Math.cos(an) * 40<<8;
			obj.y += Math.sin(an) * 40<<8;
			
			tekiShot(obj, 500);

			obj.x = saveX;
			obj.y = saveY;
		}
	}

	//自機との距離を保とうとする
	let distance = Math.pow(200<<8, 2);
	if(!gameOver && (Math.pow(jiki.x - obj.x, 2) + Math.pow(jiki.y - obj.y, 2)) < distance)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);
	}

	//画面橋より向こうにいかない時のフラグ
	let flag_canvs_edge = 50<<8;
	if(!obj.flag)
	{
		if(obj.x < CANVAS_W<<8 - flag_canvs_edge &&
		   obj.x > flag_canvs_edge               &&
		   obj.y < CANVAS_H<<8 - flag_canvs_edge &&
		   obj.y > flag_canvs_edge)
		{
			obj.flag = true;
		}
	}

	//画面端より向こうにはいかない
	let canvs_edge = 30<<8;
	if(!gameOver && obj.flag)
	{
		if(obj.x > CANVAS_W<<8 - canvs_edge) obj.x = CANVAS_W<<8 - canvs_edge;
		if(obj.x < canvs_edge)               obj.x = canvs_edge;
		if(obj.y > CANVAS_H<<8 - canvs_edge) obj.y = CANVAS_H<<8 - canvs_edge;
		if(obj.y < canvs_edge)               obj.y = canvs_edge;
	}

	//ゲームオーバー時に離れる
	if(gameOver)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);

		obj.ang += Math.PI;
	}

	obj.sn = 4;
}

//敵3（長方形）の動き
function tekiMove3(obj)
{
	if(!gameOver && !jiki.muteki && checkHit(obj.x, obj.y, obj.r,
		jiki.x, jiki.y, jiki.r) )
	{
		obj.kill   =true;
		if( (jiki.hp -= 30)<=0 )
		{
			gameOver=true;
		}
		else
		{
			jiki.damage = 10;
			jiki.muteki = 60;
		}

		jikiOutSE.currentTime = 0;
		jikiOutSE.play();
	}

	//以下は移動
	obj.speed = 200;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	obj.vx = Math.cos( an )* obj.speed;
	obj.vy = Math.sin( an )* obj.speed;

	//弾発射
	if(!gameOver)
	{
		if(obj.relo == 0)
		{
			obj.relo = 300;
		}
		else if(obj.relo == 150)
		{
			let saveX = obj.x;
			let saveY = obj.y;

			obj.x += Math.cos(an) * 40<<8;
			obj.y += Math.sin(an) * 40<<8;

			tekiShot(obj, 2000);

			obj.x = saveX;
			obj.y = saveY;
		}
	}

	//自機との距離を保とうとする
	let distance = Math.pow(300<<8, 2);
	if(!gameOver && (Math.pow(jiki.x - obj.x, 2) + Math.pow(jiki.y - obj.y, 2)) < distance)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);
	}

	//画面橋より向こうにいかない時のフラグ
	let flag_canvs_edge = 50<<8;
	if(!obj.flag)
	{
		if(obj.x < CANVAS_W<<8 - flag_canvs_edge &&
		   obj.x > flag_canvs_edge               &&
		   obj.y < CANVAS_H<<8 - flag_canvs_edge &&
		   obj.y > flag_canvs_edge)
		{
			obj.flag = true;
		}
	}

	//画面端より向こうにはいかない
	if(!gameOver)
	{
		let canvs_edge = 30<<8;
		if(obj.x > CANVAS_W<<8 - canvs_edge) obj.x = CANVAS_W<<8 - canvs_edge;
		if(obj.x < canvs_edge)               obj.x = canvs_edge;
		if(obj.y > CANVAS_H<<8 - canvs_edge) obj.y = CANVAS_H<<8 - canvs_edge;
		if(obj.y < canvs_edge)               obj.y = canvs_edge;
	}

	//ゲームオーバー時に離れる
	if(gameOver)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);

		obj.ang += Math.PI;
	}

	obj.sn = 5;
}

//敵4動き（回転しながら発射）
function tekiMove4(obj)
{
	if(!gameOver && !jiki.muteki && checkHit(obj.x, obj.y, obj.r,
		jiki.x, jiki.y, jiki.r) )
	{
		obj.kill   =true;
		if( (jiki.hp -= 30)<=0 )
		{
			gameOver=true;
		}
		else
		{
			jiki.damage = 10;
			jiki.muteki = 60;
		}

		jikiOutSE.currentTime = 0;
		jikiOutSE.play();
	}

	//弾発射,回転のための角度変更
	if(!gameOver)
	{
		let rote_an = (obj.count/2)%360 * (Math.PI/180);
		obj.ang += rote_an;

		if(obj.relo == 0 )
		{
			obj.relo = 20;
			tekiShot_random(obj, 600, rote_an);
		}
	}

	//以下は移動
	obj.speed = 100;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	obj.vx = Math.cos( an )* obj.speed;
	obj.vy = Math.sin( an )* obj.speed;

	//自機との距離を保とうとする
	let distance = Math.pow(300<<8, 2);
	if(!gameOver && (Math.pow(jiki.x - obj.x, 2) + Math.pow(jiki.y - obj.y, 2)) < distance)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);
	}

	//画面端より向こうにいかない時のフラグ
	let flag_canvs_edge = 50<<8;
	if(!obj.flag)
	{
		if(obj.x < CANVAS_W<<8 - flag_canvs_edge &&
		   obj.x > flag_canvs_edge               &&
		   obj.y < CANVAS_H<<8 - flag_canvs_edge &&
		   obj.y > flag_canvs_edge)
		{
			obj.flag = true;
		}
	}

	//画面端より向こうにはいかない
	if(!gameOver)
	{
		let canvs_edge = 30<<8;
		if(obj.x > CANVAS_W<<8 - canvs_edge) obj.x = CANVAS_W<<8 - canvs_edge;
		else if(obj.x < canvs_edge)          obj.x = canvs_edge;
		if(obj.y > CANVAS_H<<8 - canvs_edge) obj.y = CANVAS_H<<8 - canvs_edge;
		else if(obj.y < canvs_edge)          obj.y = canvs_edge;
	}

	//ゲームオーバー時に離れる
	if(gameOver)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);

		obj.ang += Math.PI;
	}

	obj.sn = 7;
}

//敵5の動き（突進）
function tekiMove5(obj)
{
	if(!gameOver && !jiki.muteki && checkHit(obj.x, obj.y, obj.r,
		jiki.x, jiki.y, jiki.r) )
	{
		obj.kill   =true;
		if( (jiki.hp -= 30)<=0 )
		{
			gameOver=true;
		}
		else
		{
			jiki.damage = 10;
			jiki.muteki = 60;
		}

		jikiOutSE.currentTime = 0;
		jikiOutSE.play();
	}

	obj.speed = 300;
	an= Math.atan2( jiki.y-obj.y , jiki.x - obj.x );
	obj.vx = Math.cos( an )* obj.speed;
	obj.vy = Math.sin( an )* obj.speed;

	//画面内に入った時のフラグ
	let flag_canvs_edge = 50<<8;
	if(!obj.flag)
	{
		if(obj.x < CANVAS_W<<8 - flag_canvs_edge &&
		   obj.x > flag_canvs_edge               &&
		   obj.y < CANVAS_H<<8 - flag_canvs_edge &&
		   obj.y > flag_canvs_edge)
		{
			obj.flag = true;
		}
	}

	//突進の処理
	if(!gameOver && obj.flag)
	{
		if(obj.relo < 200 && obj.relo > 150)
		{
			obj.speed = 0;
		}
		else if(obj.relo == 150)
		{
			obj.rotate = an;
			obj.speed = 1600;
			obj.ang = obj.rotate+Math.PI/2;
		}
		else if(obj.relo < 150 && obj.relo > 50)
		{
			obj.speed = 1600;
			an = obj.rotate;
			obj.ang = obj.rotate+Math.PI/2;
		}
		else if(obj.relo >0)
		{
			obj.speed = 0;
			an = obj.rotate;
			obj.ang = obj.rotate+Math.PI/2;
		}
		else if(obj.relo == 0)
		{
			obj.speed = 0;
			obj.relo = 200;
		}
		obj.vx = Math.cos( an )* obj.speed;
		obj.vy = Math.sin( an )* obj.speed;

		//画面外にいかないようにする
		if(obj.x > CANVAS_W<<8 - flag_canvs_edge) obj.x = CANVAS_W<<8 - flag_canvs_edge;
		else if(obj.x < flag_canvs_edge)          obj.x = flag_canvs_edge;
		if(obj.y > CANVAS_H<<8 - flag_canvs_edge) obj.y = CANVAS_H<<8 - flag_canvs_edge;
		else if(obj.y < flag_canvs_edge)          obj.y = flag_canvs_edge;
	
	}

	//ゲームオーバー時の処理
	if(gameOver)
	{
		obj.vx = obj.vx * (-1);
		obj.vy = obj.vy * (-1);

		obj.ang += Math.PI;
	}

	obj.sn = 8;
}

let tekiFunc = [
	tekiMove1,
	tekiMove2,
	tekiMove3,
	tekiMove4,
	tekiMove5,
	bossMove,
];