//�e�N���X
class bullet
{
	constructor( x,y, vx,vy,atk )
	{
		this.x    = x;
		this.y    = y;
		this.vx   = vx;
		this.vy   = vy;
		this.atk  = atk;//�U����
		this.kill = false;//tama�z�񂪑��������Ȃ��悤�Ƀt���O������
	}
	
	update()
	{
		this.x += this.vx;
		this.y += this.vy;
		
		if( this.x<0 || this.x>FIELD_W<<8
				|| this.y<0 || this.y>FIELD_H<<8 )this.kill = true;
		//��ʊO��kill�t���O��on
		
		
		if( hit()=true) kill = true;
		//�G�̒e�ƃv���C���[�܂��̓v���[���[�̒e�ƓG�̏Փ˂ɂ��kill�t���O��on
		
		//�ǂƂ̏Փ˂͒e�������H�ђʁH���ˁH
		
		//
	}
	
	draw()
	{
		drawSprite( this.sn, this.x, this.y );
	}
}
