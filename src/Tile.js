var Tile = cc.Sprite.extend({
    faceSpriteName:"hexagon.png",

    ctor:function() {
        this._super();
        this.initWithSpriteFrameName("hexagon.png");
    },

    addTile:function() {
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.faceSpriteName);
        this.setDisplayFrame(frame);
    },
});