'use strict';

class DanmakuStgMainScene extends Scene {
    constructor(renderingTarget) {
        super('メイン', 'black', renderingTarget);
        const shooter = new Player(150, 300);
        this.add(shooter);
    }
}

class DanamkuStgGame extends Game {
    constructor() {
        super('弾幕STG', 300, 400, 60);
        const mainScene = new DanmakuStgMainScene(this.screenCanvas);
        this.changeScene(mainScene);
    }
}

assets.addImage('sprite', 'assets/image/sprite.png');
assets.addImage('sprite2', 'assets/image/sprite2.png');
assets.loadAll().then((a) => {
    const game = new DanamkuStgGame();
    document.body.appendChild(game.screenCanvas);
    game.start();
});