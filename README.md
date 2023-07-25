# 仕様など

# ここに各オブジェクトの使用を書く
例：player wasdで移動，スペースでマウスカーソルの方向に弾発射


当たり判定をもつオブジェクトはw,hのパラメータを持つ

# bulletクラス
asset/image/bullet.pngを使う

攻撃力を持つ

boolのbullet_kill_flag変数を用意（名前は自由）
bullet_kill_flagは最初はfalse，trueなら弾を消す

boolのbullet_hit変数を用意（名前は自由）
bullet_hitがtrueならbullet_kill_flagをtrueにする

# playerクラス
bulletクラスを利用するように作る
bulletクラスができていない間は簡易版のを作って使う
boolのplayer_hit変数を用意（名前は自由）
intのget_damage変数を用意（名前は自由）
player_hitがtrueならget_damageを参照してダメージを受ける処理をしてplayer_hitをfalseにする

# enemyクラス
bulletクラスを利用するように作る
boolのenemy_kill_flag変数を用意（名前は自由）
enemy_kill_flagは最初はfalse，trueなら敵を消す
intのget_damage変数を用意（名前は自由）
boolのenemy_hit変数を用意（名前は自由）
enemy_hitがtrueならget_damageを参照してダメージを受ける処理をしてenemy_hitをfalseにする


# hittest関数を作る
自機と敵機，敵の弾
    当たったら自機と弾のhit変数をtrueにし，自機のget_damageに弾の攻撃力を入れる

敵機と自機の弾
    当たったら敵機と弾のhit変数をtrueにし，敵機のget_damageに弾の攻撃力を入れる

敵の弾と自機の弾
    当たったらそれぞれの弾のhit変数をtrueする

毎フレームで全部を判定する


# get_dir関数を作る
get_dir(x1,y1,x2,y2)
(x1,y1)から(x2,y2)の方向を取得する



当たり判定の関数は"enemy.js"内
