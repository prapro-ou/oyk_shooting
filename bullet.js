//弾クラス
class bullet
{
	constructor( x,y, vx,vy,atk )
	{
		this.x    = x;
		this.y    = y;
		this.vx   = vx;
		this.vy   = vy;
		this.atk  = atk;//攻撃力
		this.kill = false;//tama配列が増えすぎないようにフラグを入れる
	}
	
	update()
	{
		this.x += this.vx;
		this.y += this.vy;
		
		if( this.x<0 || this.x>FIELD_W<<8
				|| this.y<0 || this.y>FIELD_H<<8 )this.kill = true;
		//画面外でkillフラグをon
		
		
		if( hit()=true) kill = true;
		//敵の弾とプレイヤーまたはプレーヤーの弾と敵の衝突によりkillフラグをon
		
		//壁との衝突は弾を消す？貫通？反射？
		
		//
	}
	
	draw()
	{
		drawSprite( this.sn, this.x, this.y );
	}
}
