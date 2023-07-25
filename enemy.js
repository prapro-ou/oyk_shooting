class enemy{
    constructor(tnum, size,  x, y, vx, vy, speed, hp, atk, atkBullet, level, reload, rateOfFire, r){
        this.tnum = tnum;
        this.size = size;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.hp = hp;
        this.atk = atk;
        this.atkBullet = atkBullet;
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

    teta.push(new bullet(15, obj.atkBullet, obj.x, obj.y, dx, dy));
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

//スプライトを描画する
function drawSprite(snum, x, y){
    let sx = sprite[snum].x;
    let sy = sprite[snum].y;
    let sw = sprite[snum].w;
    let sh = sprite[snum].h;

    let px = (x>>8)-sw/2;
    let py = (y>>8)-sh/2;
    if(px+sw<camera_x || px>=camera_x+SCREEN_W || py+sh<camera_y || py>=camera_y+SCREEN_H)
    return;
    vcon.drawImage(spriteImage, sx, sy, sw, sh, px, py, sw, sh);
}
