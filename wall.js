class Wall
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.w = OBJECT_W;
        this.h = OBJECT_H;
        this.r = OBJECT_H;
    }

    draw()
    {
        ctx.fillStyle="black";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }

}