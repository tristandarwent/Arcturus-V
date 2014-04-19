var MyLayer = cc.Layer.extend({

    ctor:function ()
    {
        this._super();
        // GAME CODE STARTS
        var winSize = cc.Director.getInstance().getWinSize();

        var bg = cc.Sprite.create(titleBG);
        bg.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.addChild(bg);

        var titleLbl = cc.LabelTTF.create("Arcturus V", "space_age", 64);
        titleLbl.setPosition(cc.p(winSize.width/2, winSize.height-150));
        titleLbl.setColor(new cc.Color4B(121, 199, 23, 255));
        this.addChild(titleLbl);

        var beginLbl = cc.LabelTTF.create("Begin Game", "space_age", 32);
        var beginItm = cc.MenuItemLabel.create(beginLbl, this.startNormal);


        var startMenu = cc.Menu.create(beginItm);

        this.addChild(startMenu);

        startMenu.setPosition(cc.p(winSize.width/2, winSize.height/1.7));

        startMenu.alignItemsVerticallyWithPadding(12);
    },

    startNormal:function (){
        var myGameScene = new GameScene();
        cc.Director.getInstance().replaceScene(myGameScene);
    }
});

var MyScene = cc.Scene.extend({

    ctor:function ()
    {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
    }

});