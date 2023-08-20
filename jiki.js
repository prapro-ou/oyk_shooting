//
//jiki.js  自機関連
//


//弾クラス
class Tama extends CharaBase
{
	constructor( x,y,vx,vy,size )
	{
		super( 1,x,y,vx,vy,size );
		this.r = 5;
		this.size = basic_size*.7;
	}
	
	update()
	{
		super.update();
		
		for( let i=0; i<teki.length ;i++)
		{
			if( !teki[i].kill )
			{
				
				if( checkHit(
				
					this.x, this.y, this.r,
					teki[i].x, teki[i].y, teki[i].r
				
				) )
				{
					this.kill=true;
					
					if(  (teki[i].hp-= 10)<=0 )
					{
						teki[i].kill=true;
						score += teki[i].score;
					}
					
					if( teki[i].mhp>=1000 )
					{
						bossHP = teki[i].hp;
						bossMHP = teki[i].mhp;
					}

					tekiOutSE.currentTime = 0;
					tekiOutSE.play();
					
					break;
				}
				
			}
		}
	}
	
	draw()
	{
		super.draw();
	}
}

//自機クラス
class Jiki
{
	constructor()
	{
		this.x   = (CANVAS_W/2)<<8;
		this.y   = (CANVAS_H/2)<<8;
		this.mhp = 100;
		this.hp  = this.mhp;
		
		this.speed  = 700;
		//this.anime  = 0;
		this.reload = 20;
		this.relo2  = 0;
		this.r      = 10;
		this.damage = 0;
		this.muteki = 0;
		this.count  = 0;
		
		this.ang = 0; //マウスへの向き
	}
	
	//自機の移動
	update()
	{
		this.count++;
		if(this.damage)this.damage--;
		if(this.muteki)this.muteki--;
		
		//マウスへの向きを取得（ラジアン）
		this.ang = getrad(this.x>>8,this.y>>8,mouse[0],mouse[1]);

		let doShot = key[32];
		if(!doShot) doShot = mouse_click;

		if( doShot && this.reload==0 && mouse[0]!=null)
		{
			let tama_v = 1600;
			let tama_vx = Math.cos(this.ang - Math.PI/2) * tama_v;
			let tama_vy = Math.sin(this.ang - Math.PI/2) * tama_v;

			tama.push( new Tama(this.x, this.y, tama_vx, tama_vy));

			jikiShotSE.currentTime = 0;
			jikiShotSE.play();
			
			
			this.reload=10;
			/*
			if(++this.relo2 ==4)
			{
				this.reload=20;
				this.relo2=0;
			}*/
		}
		//if( !doShot ) this.reload = this.relo2=0;
		
		if( this.reload>0 ) this.reload--;
		
		if( key[65] && this.x>this.speed )
		{
			this.x-=this.speed;
		}
		else if( key[68] && this.x<= (CANVAS_W<<8)-this.speed )
		{
			this.x+=this.speed;
		}
		
		if( key[87] && this.y>this.speed )
			this.y-=this.speed;
		
		if( key[83] && this.y<= (CANVAS_H<<8)-this.speed)
			this.y+=this.speed;

		

	}
	
	//描画
	draw()
	{
		if(this.muteki && (this.count&1)) return;
		drawSprite(0, this.x, this.y, basic_size*.7, this.ang);
	}
}
