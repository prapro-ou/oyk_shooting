//角度を取得
function get_dir(x1,y1,x2,y2){
    let radians = Math.atan((y2-y1)/(x2-x1));
    return radians*(180/Math.PI);
}