var GameScene = cc.Scene.extend({
    ctor:function ()
    {
        this._super();
        var myGameLayer = new GameLayer();
        this.addChild(myGameLayer);
    }
});

var GameLayer = cc.Layer.extend({
    _spriteBatch:null,
    _tilesPlaced:[],
    _cardDeck:[],
    _player1Cards:[],
    _player2Cards:[],
    _playerTurn: 1,
    _chooseTile: false,
    _selectedCard:[],
    _player1Score:0,
    _player2Score:0,
    _score1Lbl:null,
    _score2Lbl:null,

    ctor:function ()
    {
        this._super();

        this._spriteBatch = null;

        cc.SpriteFrameCache.getInstance().addSpriteFrames(p_arcturus);
        this._spriteBatch = cc.SpriteBatchNode.create(s_arcturus);

        var winSize = cc.Director.getInstance().getWinSize();

        var bg = cc.Sprite.create(gameBG);
        bg.setPosition(cc.p(winSize.width/2, winSize.height/2));
        this.addChild(bg); 
     
        var backLbl = cc.LabelTTF.create("Exit", "space_age", 32);
        var backItm = cc.MenuItemLabel.create(backLbl, this.showMenu, this);
        var backMenu = cc.Menu.create(backItm);
        this.addChild(backMenu);

        backItm.setAnchorPoint(cc.p(1,0));
        backMenu.setPosition(cc.p(winSize.width - 20, 20));

        var player1Lbl = cc.LabelTTF.create("Score", "space_age", 24);
        player1Lbl.setPosition(cc.p(580, 180));
        player1Lbl.setColor(new cc.Color4B(27, 117, 187, 255));
        this.addChild(player1Lbl);

        this._score1Lbl = cc.LabelTTF.create(this._player1Score, "space_age", 32);
        this._score1Lbl.setPosition(cc.p(580, 140));
        this._score1Lbl.setColor(new cc.Color4B(27, 117, 187, 255));
        this.addChild(this._score1Lbl);

        var player2Lbl = cc.LabelTTF.create("Score", "space_age", 24);
        player2Lbl.setPosition(cc.p(580, 930));
        player2Lbl.setColor(new cc.Color4B(190, 30, 45, 255));
        this.addChild(player2Lbl);

        this._score2Lbl = cc.LabelTTF.create(this._player2Score, "space_age", 32);
        this._score2Lbl.setPosition(cc.p(580, 890));
        this._score2Lbl.setColor(new cc.Color4B(190, 30, 45, 255));
        this.addChild(this._score2Lbl);

        // var tilesPlaced = new Array();

        for (var i=0; i<4; i++){
            var blank = new Tile();
            blank.setPosition(cc.p(20, 250 + (i*130)));
            blank.setAnchorPoint(0,0);
            this._tilesPlaced.push(blank);
        }

        for (var i=0; i<3; i++){
            var blank = new Tile();
            blank.setPosition(cc.p(132, 314 + (i*130)));
            blank.setAnchorPoint(0,0);
            this._tilesPlaced.push(blank);
        }

        for (var i=0; i<4; i++){
            var blank = new Tile();
            blank.setPosition(cc.p(244, 250 + (i*130)));
            blank.setAnchorPoint(0,0);
            this._tilesPlaced.push(blank);
        }

        for (var i=0; i<3; i++){
            var blank = new Tile();
            blank.setPosition(cc.p(356, 314 + (i*130)));
            blank.setAnchorPoint(0,0);
            this._tilesPlaced.push(blank);
        }

        for (var i=0; i<4; i++){
            var blank = new Tile();
            blank.setPosition(cc.p(468, 250 + (i*130)));
            blank.setAnchorPoint(0,0);
            this._tilesPlaced.push(blank);
        }

        for (var i=0; i<10; i++){
            var card = new Card("oCard.png");
            card.setAnchorPoint(0,0);
            this._cardDeck.push(card);
        }

        for (var i=0; i<5; i++){
            var card = new Card("bCard.png");
            card.setAnchorPoint(0,0);
            this._cardDeck.push(card);
        }

        for (var i=0; i<2; i++){
            var card = new Card("aCard.png");
            card.setAnchorPoint(0,0);
            this._cardDeck.push(card);
        }

        for (var i=0; i<2; i++){
            var card = new Card("dCard.png");
            card.setAnchorPoint(0,0);
            this._cardDeck.push(card);
        }

        for (var i=0; i<2; i++){
            var card = new Card("fCard.png");
            card.setAnchorPoint(0,0);
            this._cardDeck.push(card);
        }

        for (var i=0; i<5; i++) {
            var randNum = Math.floor(Math.random()*this._cardDeck.length);
            var cardSpr = this._cardDeck.splice(randNum, 1)[0];

            cardSpr.setPosition(cc.p(30 + (100 * i), 50));

            this._spriteBatch.addChild(cardSpr);

            this._player1Cards.push(cardSpr);
        }

        for (var i=0; i<5; i++) {
            var randNum = Math.floor(Math.random()*this._cardDeck.length);
            var cardSpr = this._cardDeck.splice(randNum, 1)[0];

            cardSpr.setPosition(cc.p(30 + (100 * i), 800));

            this._spriteBatch.addChild(cardSpr);

            this._player2Cards.push(cardSpr);
        }

        for (var i=0; i<this._tilesPlaced.length; i++) {
            this._spriteBatch.addChild(this._tilesPlaced[i]);
        };

        this.addChild(this._spriteBatch);

        if (sys["capabilities"].hasOwnProperty('mouse')) {
            this.setMouseEnabled(true);
        }

        if (sys["capabilities"].hasOwnProperty('touches')) {
            this.setTouchEnabled(true);
        }

    },

    showMenu:function ()
    {
        var menuScene = new MyScene();
        cc.Director.getInstance().replaceScene(menuScene);
    },

    onMouseUp:function(event) {
        this.inputLook(event.getLocation());
    },

    onTouchEnded:function(touch, event) {
        this.inputLook(touch.getLocation());
    },

    inputLook:function(location) {
        if (this._chooseTile == false) {
            if (this._playerTurn === 1) {
                for (i = 0; i < this._player1Cards.length; i++) {
                    var tile = this._player1Cards[i];
                    var rect = cc.RectMake(0,
                                            0,
                                            tile.getBoundingBox().size.width,
                                            tile.getBoundingBox().size.height); 
                    var locTileSpace = tile.convertToNodeSpace(location);

                    if (cc.rectContainsPoint(rect, locTileSpace)) {
                        
                        this._selectedCard[0] = tile;
                        this._selectedCard[1] = i;
                        this._chooseTile = true;
                        tile.selected();
                    }
                }
            } else if (this._playerTurn === 2) {
                for (i = 0; i < this._player2Cards.length; i++) {
                    var tile = this._player2Cards[i];
                    var rect = cc.RectMake(0,
                                            0,
                                            tile.getBoundingBox().size.width,
                                            tile.getBoundingBox().size.height); 
                    var locTileSpace = tile.convertToNodeSpace(location);

                    if (cc.rectContainsPoint(rect, locTileSpace)) {

                        this._selectedCard[0] = tile;
                        this._selectedCard[1] = i;
                        this._chooseTile = true;
                        tile.selected();
                    }
                }
            }
        } else if (this._chooseTile == true) {
            for (i = 0; i < this._tilesPlaced.length; i++) {
                var tile = this._tilesPlaced[i];
                var rect = cc.RectMake(0,
                                        0,
                                        tile.getBoundingBox().size.width,
                                        tile.getBoundingBox().size.height);

                var locTileSpace = tile.convertToNodeSpace(location);

                if (cc.rectContainsPoint(rect, locTileSpace)) {
                    var newTile = this.whatTile(tile);
                    
                    tile.faceSpriteName = newTile;

                    tile.addTile();

                    this.replaceCard();

                    this._chooseTile = false;
                }
            }

        }
    },

    replaceCard:function(){
        if (this._playerTurn === 1) {
            if (this._cardDeck.length != 0) {
                var randNum = Math.floor(Math.random()*this._cardDeck.length);
                var cardSpr = this._cardDeck.splice(randNum, 1)[0];

                cardSpr.setPosition(cc.p(30 + (100 * this._selectedCard[1]), 50));

                this._player1Cards.splice(this._selectedCard[1], 1, cardSpr);

                this._spriteBatch.removeChild(this._selectedCard[0]);
                this._spriteBatch.addChild(cardSpr);

                this._playerTurn = 2;
            } else {
                this._player1Cards.splice(this._selectedCard[1], 1);
                this._spriteBatch.removeChild(this._selectedCard[0]);

                this._playerTurn = 2;
            }
        } else if (this._playerTurn === 2) {
            if (this._cardDeck.length != 0) {
                var randNum = Math.floor(Math.random()*this._cardDeck.length);
                var cardSpr = this._cardDeck.splice(randNum, 1)[0];

                cardSpr.setPosition(cc.p(30 + (100 * this._selectedCard[1]), 800));

                this._player2Cards.splice(this._selectedCard[1], 1, cardSpr);

                this._spriteBatch.removeChild(this._selectedCard[0]);
                this._spriteBatch.addChild(cardSpr);

                this.roundEnd();

                this._playerTurn = 1;
            } else {
                this._player2Cards.splice(this._selectedCard[1], 1);
                this._spriteBatch.removeChild(this._selectedCard[0]);

                this.roundEnd();

                this._playerTurn = 1;
            }
        }
    },

    whatTile:function(tile){
        var cardChosen = this._selectedCard[0].faceSpriteName;

        if (this._playerTurn === 1){
            if (cardChosen === "bCard.png"  && tile.faceSpriteName === "hexagon.png"){
                return "blueBtile.png"
            } else if (cardChosen === "oCard.png"  && tile.faceSpriteName === "hexagon.png"){
                return "blueOtile.png"
            } else if (cardChosen === "oCard.png"  && tile.faceSpriteName === "blueOtile.png"){
                return "blueOOtile.png"
            } else if (cardChosen === "bCard.png"  && tile.faceSpriteName === "blueOtile.png" || cardChosen === "oCard.png"  && tile.faceSpriteName === "blueBtile.png"){
                return "blueBOtile.png"
            } else if (cardChosen === "bCard.png"  && tile.faceSpriteName === "blueOOtile.png" || cardChosen === "oCard.png"  && tile.faceSpriteName === "blueBOtile.png"){
                return "blueBOOtile.png"
            } else if (cardChosen === "dCard.png"  && tile.faceSpriteName === "redOtile.png" || cardChosen === "dCard.png"  && tile.faceSpriteName === "redOOtile.png"){
                return "hexagon.png"
            } else if (cardChosen === "dCard.png"  && tile.faceSpriteName === "redBOtile.png" || cardChosen === "dCard.png"  && tile.faceSpriteName === "redBOOtile.png") {
                return "redBtile.png"
            } else if (cardChosen === "aCard.png"  && tile.faceSpriteName === "redBasetile.png") {
                return "hexagon.png"
            } else if (cardChosen === "fCard.png"  && tile.faceSpriteName === "hexagon.png") {
                return "blueBasetile.png"
            }
        } else if (this._playerTurn === 2){
            if (cardChosen === "bCard.png"  && tile.faceSpriteName === "hexagon.png"){
                return "redBtile.png"
            } else if (cardChosen === "oCard.png"  && tile.faceSpriteName === "hexagon.png"){
                return "redOtile.png"
            } else if (cardChosen === "oCard.png"  && tile.faceSpriteName === "redOtile.png"){
                return "redOOtile.png"
            } else if (cardChosen === "bCard.png"  && tile.faceSpriteName === "redOtile.png" || cardChosen === "oCard.png"  && tile.faceSpriteName === "redBtile.png"){
                return "redBOtile.png"
            } else if (cardChosen === "bCard.png"  && tile.faceSpriteName === "redOOtile.png" || cardChosen === "oCard.png"  && tile.faceSpriteName === "redBOtile.png"){
                return "redBOOtile.png"
            } else if (cardChosen === "dCard.png"  && tile.faceSpriteName === "blueOtile.png" || cardChosen === "dCard.png"  && tile.faceSpriteName === "blueOOtile.png"){
                return "hexagon.png"
            } else if (cardChosen === "dCard.png"  && tile.faceSpriteName === "blueBOtile.png" || cardChosen === "dCard.png"  && tile.faceSpriteName === "blueBOOtile.png") {
                return "blueBtile.png"
            } else if (cardChosen === "aCard.png"  && tile.faceSpriteName === "blueBasetile.png") {
                return "hexagon.png"
            } else if (cardChosen === "fCard.png"  && tile.faceSpriteName === "hexagon.png") {
                return "redBasetile.png"
            }
        } 
    },

    roundEnd:function() {
        for (i = 0; i < this._tilesPlaced.length; i++) {
            var tile = this._tilesPlaced[i];

            if (tile.faceSpriteName === "blueBasetile.png") {
                this._player1Score++;
            } else if (tile.faceSpriteName === "redBasetile.png") {
                this._player2Score++;
            }

            this._score1Lbl.setString(this._player1Score);
            this._score2Lbl.setString(this._player2Score);

            if (tile.faceSpriteName === "blueBOOtile.png") {
                tile.faceSpriteName = "blueBasetile.png";
                tile.addTile();
            } else if (tile.faceSpriteName === "redBOOtile.png") {
                tile.faceSpriteName = "redBasetile.png";
                tile.addTile();
            }
        }
    }
});