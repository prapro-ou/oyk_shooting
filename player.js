'use strict';

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    hitTest(other) {
        const horizontal = (other.x < this.x + this.width) &&
            (this.x < other.x + other.width);
        const vertical = (other.y < this.y + this.height) &&
            (this.y < other.y + other.height);
        return (horizontal && vertical);
    }
}

class Sprite {
    constructor(image, rectangle) {
        this.image = image;
        this.rectangle = rectangle;
    }
}

class AssetLoader {
    constructor() {
        this._promises = [];
        this._assets = new Map();
    }

    addImage(name, url) {
        const img = new Image();
        img.src = url;

        const promise = new Promise((resolve, reject) =>
            img.addEventListener('load', (e) => {
                this._assets.set(name, img);
                resolve(img);
            }));

        this._promises.push(promise);
    }
    
    loadAll() {
        return Promise.all(this._promises).then((p) => this._assets);
    }
    
    get(name) {
        return this._assets.get(name);
    }
}

const assets = new AssetLoader();

class GameEvent {
    constructor(target) {
        this.target = target;
    }
}

class Input {
    constructor(keyMap, prevKeyMap) {
        this.keyMap = keyMap;
        this.prevKeyMap = prevKeyMap;
    }

    _getKeyFromMap(keyName, map) {
        if(map.has(keyName)) {
            return map.get(keyName);
        } else {
            return false;
        }
    }

    _getPrevKey(keyName) {
        return this._getKeyFromMap(keyName, this.prevKeyMap);
    }

    getKey(keyName) {
        return this._getKeyFromMap(keyName, this.keyMap);
    }

    getKeyDown(keyName) {
        const prevDown = this._getPrevKey(keyName);
        const currentDown = this.getKey(keyName);
        return (!prevDown && currentDown);
    }

    getKeyUp(keyName) {
        const prevDown = this._getPrevKey(keyName);
        const currentDown = this.getKey(keyName);
        return (prevDown && !currentDown);
    }
}

class InputReceiver {
    constructor() {
        this._keyMap = new Map();
        this._prevKeyMap = new Map();

        addEventListener('keydown', (ke) => this._keyMap.set(ke.key, true));
        addEventListener('keyup', (ke) => this._keyMap.set(ke.key, false));
    }

    getInput() {
        const keyMap = new Map(this._keyMap);
        const prevKeyMap = new Map(this._prevKeyMap);
        this._prevKeyMap = new Map(this._keyMap);
        return new Input(keyMap, prevKeyMap);
    }
}


class Bullet {
    constructor(x, y) {
        const sprite = new Sprite(assets.get('sprite'), new Rectangle(0, 16, 16, 16));
        const hitArea = new Rectangle(4, 0, 8, 16);

        this._eventListeners = {};
        this.hitArea = hitArea;
        this._hitAreaOffsetX = hitArea.x;
        this._hitAreaOffsetY = hitArea.y;
        this.tags = ['playerBullet'];

        this.x = x;
        this.y = y;

        this.sprite = sprite;
        this.width = sprite.rectangle.width;
        this.height = sprite.rectangle.height;

        this.speed = 6;
    }

    hasTag(tagName) {
        return this.tags.includes(tagName);
    }

    addEventListener(type, callback) {
        if(this._eventListeners[type] == undefined) {
            this._eventListeners[type] = [];
        }

        this._eventListeners[type].push(callback);
    }

    dispatchEvent(type, event) {
        const listeners = this._eventListeners[type];
        if(listeners != undefined) listeners.forEach((callback) => callback(event));
    }

    spawnbullet(bullet) {
        this.dispatchEvent('spawnbullet', new GameEvent(bullet));
    }

    destroy() {
        this.dispatchEvent('destroy', new GameEvent(this));
    }
    
    get x() {
        return this._x;
    }
    
    set x(value) {
        this._x = value;
        this.hitArea.x = value + this._hitAreaOffsetX;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.hitArea.y = value + this._hitAreaOffsetY;
    }

    render(target) {
        const context = target.getContext('2d');
        const rect = this.sprite.rectangle;
        context.drawImage(this.sprite.image,
            rect.x, rect.y,
            rect.width, rect.height,
            this.x, this.y,
            rect.width, rect.height);
    }
    
    isOutOfBounds(boundRect) {
        const actorLeft = this.x;
        const actorRight = this.x + this.width;
        const actorTop = this.y;
        const actorBottom = this.y + this.height;

        const horizontal = (actorRight < boundRect.x || actorLeft > boundRect.width);
        const vertical = (actorBottom < boundRect.y || actorTop > boundRect.height);

        return (horizontal || vertical);
    }

    update(gameInfo, input) {
        this.y -= this.speed;
        if(this.isOutOfBounds(gameInfo.screenRectangle)) {
            this.destroy();
        }
    }
}

class Player {
    constructor(x, y, tags = []) {
        const sprite = new Sprite(assets.get('sprite'), new Rectangle(0, 0, 16, 16));
        const hitArea = new Rectangle(8, 8, 2, 2);

        this._eventListeners = {};
        this.hitArea = hitArea;
        this._hitAreaOffsetX = hitArea.x;
        this._hitAreaOffsetY = hitArea.y;
        this.tags = tags;

        this.x = x;
        this.y = y;

        this.sprite = sprite;
        this.width = sprite.rectangle.width;
        this.height = sprite.rectangle.height;

        this.hitpoint = 10;
        this.speed = 2;
        this.level = 1;
        this.attack = 5;
        this.rate = 100;

        this._interval = 5;
        this._timeCount = 0;
        this._speed = 3;
        this._velocityX = 0;
        this._velocityY = 0;
    }

    render(target) {
        const context = target.getContext('2d');
        const rect = this.sprite.rectangle;
        context.drawImage(this.sprite.image,
            rect.x, rect.y,
            rect.width, rect.height,
            this.x, this.y,
            rect.width, rect.height);
    }

    hasTag(tagName) {
        return this.tags.includes(tagName);
    }

    addEventListener(type, callback) {
        if(this._eventListeners[type] == undefined) {
            this._eventListeners[type] = [];
        }

        this._eventListeners[type].push(callback);
    }

    dispatchEvent(type, event) {
        const listeners = this._eventListeners[type];
        if(listeners != undefined) listeners.forEach((callback) => callback(event));
    }

    /* 弾の発射，自機の破棄などの処理は画面管理クラスに任せる */
    spawnbullet(bullet) {
        this.dispatchEvent('spawnbullet', new GameEvent(bullet));
    }

    destroy() {
        this.dispatchEvent('destroy', new GameEvent(this));
    }

    /* 座標の代入処理，当たり判定も同時にset関数で更新する */
    get x() {
        return this._x;
    }
    
    set x(value) {
        this._x = value;
        this.hitArea.x = value + this._hitAreaOffsetX;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.hitArea.y = value + this._hitAreaOffsetY;
    }

    isOutOfBounds(boundRect) {
        const actorLeft = this.x;
        const actorRight = this.x + this.width;
        const actorTop = this.y;
        const actorBottom = this.y + this.height;

        const horizontal = (actorRight < boundRect.x || actorLeft > boundRect.width);
        const vertical = (actorBottom < boundRect.y || actorTop > boundRect.height);

        return (horizontal || vertical);
    }

    /* 毎フレーム呼出 */
    update(gameInfo, input) {
        // キーを押されたら移動する
        this._velocityX = 0;
        this._velocityY = 0;

        if(input.getKey('ArrowUp')) { this._velocityY = -this._speed; }
        if(input.getKey('ArrowDown')) { this._velocityY = this._speed; }
        if(input.getKey('ArrowRight')) { this._velocityX = this._speed; }
        if(input.getKey('ArrowLeft')) { this._velocityX = -this._speed; }
        
        this.x += this._velocityX;
        this.y += this._velocityY;

        // 画面外に行ってしまったら押し戻す
        const boundWidth = gameInfo.screenRectangle.width - this.width;
        const boundHeight = gameInfo.screenRectangle.height - this.height;
        const bound = new Rectangle(this.width, this.height, boundWidth, boundHeight);
        
        if(this.isOutOfBounds(bound)) {
            this.x -= this._velocityX;
            this.y -= this._velocityY;
        }

        // スペースキーで弾を打つ
        this._timeCount++;
        const isFireReady = this._timeCount > this._interval;
        if(isFireReady && input.getKey(' ')) {
            const bullet = new Bullet(this.x, this.y);
            this.spawnbullet(bullet);
            this._timeCount = 0;
        }
    }

}

class Scene {
    constructor(name, backgroundColor, renderingTarget) {
        this._eventListeners = {};

        this.name = name;
        this.backgroundColor = backgroundColor;
        this.actors = [];
        this.renderingTarget = renderingTarget;

        this._destroyedActors = [];
    }

    addEventListener(type, callback) {
        if(this._eventListeners[type] == undefined) {
            this._eventListeners[type] = [];
        }

        this._eventListeners[type].push(callback);
    }

    dispatchEvent(type, event) {
        const listeners = this._eventListeners[type];
        if(listeners != undefined) listeners.forEach((callback) => callback(event));
    }

    add(player) {
        this.actors.push(player);
        player.addEventListener('spawnbullet', (e) => this.add(e.target));
        player.addEventListener('destroy', (e) => this._addDestroyedActor(e.target));
    }

    remove(player) {
        const index = this.actors.indexOf(player);
        this.actors.splice(index, 1);
    }
    
    changeScene(newScene) {
        const event = new GameEvent(newScene);
        this.dispatchEvent('changescene', event);
    }

    update(gameInfo, input) {
        this._updateAll(gameInfo, input);
        this._hitTest();
        this._disposeDestroyedActors();
        this._clearScreen(gameInfo);
        this._renderAll();
    }

    _updateAll(gameInfo, input) {
        this.actors.forEach((player) => player.update(gameInfo, input));
    }

    _hitTest() {
        const length = this.actors.length;
        for(let i=0; i < length - 1; i++) {
            for(let j=i+1; j < length; j++) {
                const obj1 = this.actors[i];
                const obj2 = this.actors[j];
                const hit = obj1.hitArea.hitTest(obj2.hitArea);
                if(hit) {
                    obj1.dispatchEvent('hit', new GameEvent(obj2));
                    obj2.dispatchEvent('hit', new GameEvent(obj1));
                }
            }
        }
    }

    _clearScreen(gameInfo) {
        const context = this.renderingTarget.getContext('2d');
        const width = gameInfo.screenRectangle.width;
        const height = gameInfo.screenRectangle.height;
        context.fillStyle = this.backgroundColor;
        context.fillRect(0, 0, width, height);
    }

    _renderAll() {
        this.actors.forEach((obj) => obj.render(this.renderingTarget));
    }

    _addDestroyedActor(player) {
        this._destroyedActors.push(player);
    }

    _disposeDestroyedActors() {
        this._destroyedActors.forEach((player) => this.remove(player));
        this._destroyedActors = [];
    }
}

class GameInformation {
    constructor(title, screenRectangle, maxFps, currentFps) {
        this.title = title;
        this.screenRectangle = screenRectangle;
        this.maxFps = maxFps;
        this.currentFps = currentFps;
    }
}

class Game {
    constructor(title, width, height, maxFps) {
        this.title = title;
        this.width = width;
        this.height = height;
        this.maxFps = maxFps;
        this.currentFps = 0;

        this.screenCanvas = document.createElement('canvas');
        this.screenCanvas.height = height;
        this.screenCanvas.width = width;

        this._inputReceiver = new InputReceiver();
        this._prevTimestamp = 0;

        console.log(`${title}が初期化されました。`);
    }

    changeScene(newScene) {
        this.currentScene = newScene;
        this.currentScene.addEventListener('changescene', (e) => this.changeScene(e.target));
        console.log(`シーンが${newScene.name}に切り替わりました。`);
    }

    start() {
        requestAnimationFrame(this._loop.bind(this));
    }

    _loop(timestamp) {
        const elapsedSec = (timestamp - this._prevTimestamp) / 1000;
        const accuracy = 0.9; // あまり厳密にするとフレームが飛ばされることがあるので
        const frameTime = 1 / this.maxFps * accuracy; // 精度を落とす
        if(elapsedSec <= frameTime) {
            requestAnimationFrame(this._loop.bind(this));
            return;
        }

        this._prevTimestamp = timestamp;
        this.currentFps = 1 / elapsedSec;

        const screenRectangle = new Rectangle(0, 0, this.width, this.height);
        const info = new GameInformation(this.title, screenRectangle,
                                         this.maxFps, this.currentFps);
        const input = this._inputReceiver.getInput();
        this.currentScene.update(info, input);

        requestAnimationFrame(this._loop.bind(this));
    }
}
