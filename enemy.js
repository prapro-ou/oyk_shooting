class enemy{
    constructor(tnum, size,  x, y, vx, vy, speed, hp, atk, level, reload, rateOfFire, r){
        this.tnum = tnum;
        this.size = size;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.hp = hp;
        this.atk = atk;
        this.level = level;
        this.reload = reload;
        this.rateOfFire;
        this.r = r;
        this.kill = false;
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;

        if(this.x<0 || this.x>FIELD_W<<8 || this.y<0 || this.y>FIELD_H<<8) this.kill = true;
        
        //個別のアップデート
        tekiFunc[this.tnum](this);

        //当たり判定
        if(!player.muteki && checkHit(this.x, this.y, this.r, player.x, player.y, player.r)){
            this.kill = true;
            player.damage = 10;
            player.muteki = 60;
        }
    }

    draw(){
        drawSprite(this.sn, this.x, this.y);
    }
}

function tekiShot(obj, speed){
    let an, dx, dy;
    an = Math.atan2(player.y-obj.y, player.x - obj.x);
    //an += rand(-10, 10)*Math.PI/180;
    dx = Math.cos(an)*speed;
    dy = Math.sin(an)*speed;

    teta.push(new Teta(15, obj.x, obj.y, dx, dy));
}

//ピンクのひよこの移動パターン
function tekiMove01(obj){
    if(!obj.flag){
        if(player.x > obj.x && obj.vx<120)
            obj.vx+=4;
        else if(player.x < obj.x && obj.vx> -120)
            obj.vx-=4;
    }else{
        if(player.x < obj.x && obj.vx<120)
            obj.vx+=30;
        else if(player.x > obj.x && obj.vx> -120)
            obj.vx-=30;
    }

    
    
    if(Math.abs(player.y-obj.y)<(100<<8) && !obj.flag){
        obj.flag = true;
        tekiShot(obj, 600);
    }

    if(obj.flag && obj.vy>-800)
        obj.vy -=30;
    //スプライトの変更
    const ptn = [39, 40, 39, 41];
    obj.sn = ptn[(obj.count>>3)&3];
}

//黄色のひよこの移動パターン
function tekiMove02(obj){
    if(!obj.flag){
        if(player.x > obj.x && obj.vx<600)
            obj.vx+=30;
        else if(player.x < obj.x && obj.vx> 600)
            obj.vx-=30;
    }else{
        if(player.x < obj.x && obj.vx<600)
            obj.vx+=30;
        else if(player.x > obj.x && obj.vx> -600)
            obj.vx-=30;
    }

    
    
    if(Math.abs(player.y-obj.y)<(100<<8) && !obj.flag){
        obj.flag = true;
        tekiShot(obj, 600);
    }

    //if(obj.flag && obj.vy>-800)
    //    obj.vy -=30;
    //スプライトの変更
    const ptn = [33, 34, 33, 35];
    obj.sn = ptn[(obj.count>>3)&3];
}

let tekiFunc = [
    tekiMove01,
    tekiMove02,
]

//当たり判定
function checkHit(x1, y1, r1, x2, y2, r2){
    //円同士の当たり判定
    let a = (x2-x1)>>8;
    let b = (y2-y1)>>8;
    let r = r1 + r2;

    return r*r >= a*a + b*b;

}
