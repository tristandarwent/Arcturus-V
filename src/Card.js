var Card = cc.Sprite.extend({
    faceSpriteName:null,

    ctor:function(sprName) {
        this._super();
        this.faceSpriteName = sprName;
        this.initWithSpriteFrameName(sprName);
    },

    selected:function() {

        if (this.faceSpriteName === "dCard.png") {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("dCardselected.png");
        } else if (this.faceSpriteName === "oCard.png") {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("oCardselected.png");
        } else if (this.faceSpriteName === "aCard.png") {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("aCardselected.png");
        } else if (this.faceSpriteName === "bCard.png") {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("bCardselected.png");
        } else if (this.faceSpriteName === "fCard.png") {
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("fCardselected.png");
        }

        this.setDisplayFrame(frame);
    },
});