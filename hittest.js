//当たり判定
function hittest(){
    let distance;
    //自機と敵機
    for(let i=0;i<teki.length;i++){
        distance = Math.pow(player.x-enemy[i].x, 2)+Math.pow(player.y-enemy[i].y, 2);
        if(distance<=Math.pow(enemy[i].r+player.r, 2)){
            player.hit = true;
            player.get_damage(enemy[i].atk);
        };
    };

    //自機と敵機の弾
    for(let i=0;i<enemy_bullet.length;i++){
        distance = Math.pow(player.x-enemy_bullet[i].x, 2)+Math.pow(player.y-enemy_bullet[i].y, 2);
        if(distance<=Math.pow(player.r+enemy_bullet[i].r, 2)){
            player.hit = true;
            enemy_bullet[i].hit = true;
            player.get_damage(enemy_bullet[i].atk);
        };
    }

    //敵機と自機の弾
    for(let i=0;i<player_bullet.length;i++){
        for(let j=0;j<enemy.length;j++){
            distance = Math.pow(enemy[j].x-player_bullet[i].x, 2) + Math.pow(enemy[j].y-player_bullet[i].y, 2)
            if(distance<=Math.pow(enemy[j].r + player_bullet[i].r, 2)){
                enemy[j].hit = true;
                player_bullet[i].hit = true;
                enemy[j].get_damage(player_bullet[i].atk);
            }
        }
    }

    //敵の弾と自機の弾
    for(let i=0;i<player_bullet.length;i++){
        for(let j=0;j<enemy_bullet.length;j++){
            distance = Math.pow(player_bullet[i].x-enemy_bullet[j].x, 2)+Math.pow(player_bullet[i].y-enemy_bullet[j].y, 2)
            if(distance<=Math.pow(player_bullet[i].r+enemy_bullet[j].r, 2)){
                player_bullet[i].hit = true;
                enemy_bullet[j].hit = true;
            }
        }
    }
}