//
//data.js スプライトデータとか
//

//敵マスター
class TekiMaster
{
	constructor( tnum,r, hp,score )
	{
		this.tnum = tnum;
		this.r    = r;
		this.hp   = hp;
		this.score= score;
	}
}

//敵のステータス
let tekiMaster=
[
	new TekiMaster( 0, 30,   30,  100),		//0,敵1（三角）
	new TekiMaster( 1, 30,   30,  200),		//1,敵2（正方形）
	new TekiMaster( 2, 20,   20,  300),     //2,敵3（長方形）
	new TekiMaster( 3, 30,   80,  500),     //3,敵4（回るやつ）
	new TekiMaster( 4, 15,   20,  300),     //4,敵5（突進）
	new TekiMaster( 5, 70, 2000,10000),		//5,ボス
	new TekiMaster( 0, 30,    1,  100),		//6,ボス子供
]


//スプライトクラス
class Sprite
{
	constructor( x,y, w,h )
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

//スプライト
let sprite = [
	new Sprite(  0,  0,256,256 ),//0,自機
	new Sprite(257,  0,256,256 ),//1,自弾
	new Sprite(513,  0,256,256 ),//2,敵弾
	new Sprite(  0,257,256,256 ),//3,敵1（三角）
	new Sprite(257,257,256,256 ),//4,敵2（正方形）
	new Sprite(513,257,256,256 ),//5,敵3（長方形）
	new Sprite(  0,513,256,256 ),//6,ボス
	new Sprite(257,513,256,256 ),//7,敵4（回転2）
	new Sprite(513,513,256,256 ),//8,敵5（突進）	
];
