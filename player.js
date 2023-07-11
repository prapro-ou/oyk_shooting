import bullet from "./bullet";

class Rectangle {                           /*サイズと当たり判定の概念*/
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

class AssetLoader {                     /* アセット（スプライトの元画像）を読み込む */
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

class Sprite {                          /* スプライトは画像を切り抜いた一部 */
    constructor(image, rectangle) {
        this.image = image;
        this.rectangle = rectangle;
    }
}

class player {
    constructor(x, y,tags = []) {
        const sprite = new Sprite(assets.get('sprite'), new Rectangle(0, 0, 16, 16));
        const hitArea = new Rectangle(8, 8, 2, 2);
        this._eventListeners = {};
        this.hitArea = hitArea;
        this._hitAreaOffsetX = hitArea.x;
        this._hitAreaOffsetY = hitArea.y;
        this.tags = tags;
        this.sprite = sprite;
        this.width = sprite.rectangle.width;
        this.height = sprite.rectangle.height;

        this.x = x;
        this.y = y;
        
        this.hitpoint = 10;
        this.speed = 2;
        this.level = 1;
        this.attack = 5;
        this.rate = 100;
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

    update(gameInfo, input) {
        if(input.getKey('ArrowUp')) { this.y -= this.speed; }
        if(input.getKey('ArrowDown')) { this.y += this.speed; }
        if(input.getKey('ArrowRight')) { this.x += this.speed; }
        if(input.getKey('ArrowLeft')) { this.x -= this.speed; }
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

    spawnActor(actor) {
        this.dispatchEvent('spawnactor', new GameEvent(actor));
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


    isOutOfBounds(boundRect) {
        const actorLeft = this.x;
        const actorRight = this.x + this.width;
        const actorTop = this.y;
        const actorBottom = this.y + this.height;

        const horizontal = (actorRight < boundRect.x || actorLeft > boundRect.width);
        const vertical = (actorBottom < boundRect.y || actorTop > boundRect.height);

        return (horizontal || vertical);
    }

}

export default player;