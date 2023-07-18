//弾クラス
class bullet
{
	constructor( x,y, vx,vy )
	{
		this.sn   = 6;//スプライト配列番号
		this.x    = x;
		this.y    = y;
		this.vx   = vx;
		this.vy   = vy;
		this.kill = false;//tama配列が増えすぎないようにフラグを入れる
	}
	
	update()
	{
		this.x += this.vx;
		this.y += this.vy;
		
		if( this.x<0 || this.x>FIELD_W<<8
				|| this.y<0 || this.y>FIELD_H<<8 )this.kill = true;
		//画面外でkillフラグをon
	}
	
	draw()
	{
		drawSprite( this.sn, this.x, this.y );
	}
}
