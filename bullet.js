//�e�N���X
class bullet
{
	constructor( x,y, vx,vy )
	{
		this.sn   = 6;//�X�v���C�g�z��ԍ�
		this.x    = x;
		this.y    = y;
		this.vx   = vx;
		this.vy   = vy;
		this.kill = false;//tama�z�񂪑��������Ȃ��悤�Ƀt���O������
	}
	
	update()
	{
		this.x += this.vx;
		this.y += this.vy;
		
		if( this.x<0 || this.x>FIELD_W<<8
				|| this.y<0 || this.y>FIELD_H<<8 )this.kill = true;
		//��ʊO��kill�t���O��on
	}
	
	draw()
	{
		drawSprite( this.sn, this.x, this.y );
	}
}
