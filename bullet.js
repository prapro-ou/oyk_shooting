//CharaBase���K�v
//���@�p�̒e��bullet
//�K�p�̒e��Teta
//super���ĂȂɁH

//���Ǌێʂ��܂��������Ă��Ȃ�

class bullet extends CharaBase
{
	constructor( x,y,vx,vy )
	{
		super( 6,x,y,vx,vy );
		this.r = 4; //���a4
	}
	
	update()
	{
		super.update();
		
		for( let i=0; i<teki.length ;i++)
		{
			if( !enemy[i].kill )
			{
				
				if( checkHit(
				
					this.x, this.y, this.r,
					enemy[i].x, enemy[i].y, enemy[i].r
				
				) )
				{
					this.kill=true;
					
					if(  (enemy[i].hp-= 10)<=0 )
					{
						enemy[i].kill=true;
						explosion(
							enemy[i].x, enemy[i].y,
							enemy[i].vx>>3,enemy[i].vy>>3 );
						score += enemy[i].score;//����̓X�R�A������g�����킩��Ȃ�
					}
					else
					{
						expl.push( new Expl( 0,this.x, this.y,0,0 ) );//�悭�킩��񔚔��H
					}
					
					if( enemy[i].mhp>=1000 )
					{
						bossHP = enemy[i].hp;
						bossMHP = enemy[i].mhp;
					}
					
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

class Teta extends CharaBase //�G��bullet
{
	constructor(sn,x,y,vx,vy,t)
	{
		super(sn,x,y,vx,vy);
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
		}
		
		this.sn=14 + ((this.count>>3)&1);
	}
	
	
}