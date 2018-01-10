// Open Source Match 3 Game by Clockworkchilli
App = function()
{
    var self = this; // Main app context
    var gameLength = 60;

    // Layers to use for rendering
    this.layers = {background:17, boardBack:16, board:15, boardFront:14, front:13};

    // Palette
    var fvr_pink = "#fc2b5c";

    // Flags
    this.musicMuted = true;
    this.soundMuted = true;
    this.socialEnabled = false;
    this.gameOver = false;

    // Scores
    this.scores = [
        {name:'Andrew',score:1000},
        {name:'Bella',score:900},
        {name:'Charlie',score:800},
        {name:'Diane',score:700},
        {name:'Egbert',score:600},
        {name:'Francesca',score:500},
        {name:'Garry',score:400},
        {name:'Harriet',score:300},
        {name:'Ian',score:200},
        {name:'Josephine',score:100}
    ];

    /**
     * Function that takes a number of seconds and returns a string of the time in minutes
     * @param {number} numSeconds The number of seconds that we will convert
     * @returns {string} A string representation of the provided time in minutes
     */
    this.getTimeString = function (numSeconds)
    {
        if (!numSeconds || numSeconds < 1)
        {
            return '0:00';
        }

        var timeString = '';
        var minutes = 0;
        var seconds = Math.floor(numSeconds);

        // Deal with minutes
        while (seconds >= 60)
        {
            seconds -= 60;
            minutes++;
        }

        timeString = minutes > 0 ? minutes + ':' : '0:';

        // Deal with seconds
        if (seconds > 0)
        {
            timeString += seconds < 10 ? ('0' + seconds) : seconds;
        }
        else
        {
            timeString += '00';
        }
        return timeString;
    };

    // Load all assets
    this.load = function()
    {
        // LOAD SCRIPTS
        wade.loadScript('bar.js');
        wade.loadScript('counter.js');
        wade.loadScript('match3.js');

        // Load AUDIO
        if (wade.isWebAudioSupported())
        {
            // background music
            wade.preloadAudio('sounds/Surreal-Chase.ogg', false, true);
        }

        if (wade.isWebAudioSupported())
        {
            wade.loadAudio('sounds/metalImpact2.ogg');
            wade.loadAudio('sounds/fiveSound.ogg');
            wade.loadAudio('sounds/explosion1.ogg');
        }

        // LOAD IMAGES
        // Squares
        wade.loadImage('images/selected.png');
        wade.loadImage('images/special4.png');
        wade.loadImage('images/special5.png');
        wade.loadImage('images/alfred.png');
        wade.loadImage('images/bertie.png');
        wade.loadImage('images/carlton.png');
        wade.loadImage('images/denny.png');
        wade.loadImage('images/egbert.png');
        wade.loadImage('images/francesca.png');
        wade.loadImage('images/gertrude.png');
        wade.loadImage('images/hubert.png');
        wade.loadImage('images/isabelle.png');
        wade.loadImage('images/x-pill.png');

        // UI and background
        wade.loadImage('images/orange_button.png');
        wade.loadImage('images/black_button.png');
        wade.loadImage('images/background_pink.png');
        wade.loadImage('images/score_container_v3.png');
        wade.loadImage('images/background.png');
        wade.loadImage('images/menuTop.png');
        wade.loadImage('images/menuTopAlt.png');
        wade.loadImage('images/gameTop.png');
        wade.loadImage('images/barTime.png');
        wade.loadImage('images/markerTime.png');
        wade.loadImage('images/buttonSoundOff.png');
        wade.loadImage('images/buttonSoundOn.png');
        wade.loadImage('images/buttonBack.png');
        wade.loadImage('images/potionBar.png');
        wade.loadImage('images/menuBackground.png');
        wade.loadImage('images/wordTitle.png');
        wade.loadImage('images/potionTitle.png');
        wade.loadImage('images/buttonPlay.png');
        wade.loadImage('images/backgroundShareBox.png');
        wade.loadImage('images/buttonCredit.png');
        wade.loadImage('images/wadePowered.png');
        wade.loadImage('images/buttonsMuteOn.png');
        wade.loadImage('images/buttonsMuteOff.png');
        wade.loadImage('images/buttonPause.png');
        wade.loadImage('images/buttonUnpause.png');
        wade.loadImage('images/highscore.png');
        wade.loadImage('images/highscoresText.png');
        wade.loadImage('images/highscore_gold.png');
        wade.loadImage('images/highscore_silver.png');
        wade.loadImage('images/highscore_bronze.png');
        wade.loadImage('images/highscore_grey.png');
        wade.loadImage('images/trophy.png');
        wade.loadImage('images/btn_normal.png');
        wade.loadImage('images/btn_hover.png');
        wade.loadImage('images/btn_click.png');
        wade.loadImage('images/one.png');
        wade.loadImage('images/two.png');
        wade.loadImage('images/three.png');
        wade.loadImage('images/egg.png');
        wade.loadImage('images/play_again_hover_click.png');
        wade.loadImage('images/play_again_btn.png');
        wade.loadImage('images/back_btn.png');

        // Shiny
        wade.loadImage('images/shatter.png');
        wade.loadImage('images/specialEffect1.png');
        wade.loadImage('images/bigBoom.png');
        wade.loadImage('images/fiveEffect.png');
        wade.loadImage('images/flash.png');

        // Share
        wade.loadImage('images/google.png');
        wade.loadImage('images/facebook.png');
        wade.loadImage('images/twitter.png');

    };

    // Enter main program
    this.init = function()
    {
        // Setup screen
        wade.setMinScreenSize(1080, 1920); //996
        wade.setMaxScreenSize(1080, 1920); //996

        wade.setSwipeTolerance(1, 2);

        // {background:17, boardBack:16, board:15, boardFront:14, front:13};
        wade.setLayerRenderMode(self.layers.background, "webgl");
        wade.setLayerRenderMode(self.layers.boardBack, "webgl");
        wade.setLayerRenderMode(self.layers.board, "webgl");
        wade.setLayerRenderMode(self.layers.boardFront, "webgl");
        //wade.setLayerRenderMode(self.layers.front, "webgl"); // Need 1 canvas layer for timer bar gradient and other etc

        // Lower resolution factor if mobile
        if (wade.getContainerHeight() <= 768)
        {
            self.isMobile = true;
            wade.setLayerResolutionFactor(this.layers.background, 0.75);
            wade.setLayerResolutionFactor(this.layers.boardBack, 0.75);
            wade.setLayerResolutionFactor(this.layers.board, 0.75);
            wade.setLayerResolutionFactor(this.layers.boardFront, 0.75);
            wade.setLayerResolutionFactor(this.layers.front, 0.75);
        }
        else
        {
            self.isMobile = false;
        }

        // Create main menu and the game on play pressed
        this.game();
    };

    /**
     * Creates the main menu
     */
    this.game = function()
    {
        // Create menu graphical elements
        var backgroundSprite = new Sprite('images/menuBackground.png', this.layers.boardBack);
        var menu = new SceneObject(backgroundSprite);
        wade.addSceneObject(menu, true);
        var menuTopSprite = new Sprite('images/menuTop.png', self.layers.boardBack);
        menuTopSprite.setSize(1080, 100);
        menu.addSprite(menuTopSprite, {x:0, y:-wade.getScreenHeight()/2+25});
        var titleSprite = new Sprite('images/wordTitle.png', this.layers.board);
        menu.addSprite(titleSprite, {x: 0, y:-wade.getScreenHeight()/4 - 120});
        titleSprite.setSize(428*2, 265*2);
        //var titleText = new TextSprite('Match Three', '128px PT_Sans-Bold', 'black', 'center', wade.app.layers.front)
       // menu.addSprite(titleText, {x:0, y:-500});
        var potionSprite = new Sprite('images/potionTitle.png', this.layers.board);
        menu.addSprite(potionSprite, {x:0, y:-130});
        var shareBackSprite = new Sprite('images/backgroundShareBox.png', wade.app.layers.front);
        menu.addSprite(shareBackSprite, {x:-wade.getScreenWidth()/2 + 175, y:wade.getScreenHeight()/2 - 125});
        var rulesText1 = new TextSprite("Match three to kill the viruses", '36px PT_Sans-regular', 'black', 'center', wade.app.layers.front);
        menu.addSprite(rulesText1, {x:0, y:-270});
        var rulesSprite = new Sprite("images/rules.png", wade.app.layers.front);
        rulesSprite.setSize(1080,936);
        menu.addSprite(rulesSprite, {x:0, y:430});
        
        // TODO Incorporate this into credits button
        // var menuFooterSprite = new Sprite('images/footer.png', self.layers.front);
        // menuFooterSprite.setSize(1080, 80);
        // menu.addSprite(menuFooterSprite, {x:0, y:wade.getScreenHeight()/2-30});
        // var footerText = new TextSprite("Developed by Alec Stone and designed by Irina Csapo for fun in 2018. Enjoy!", '28px PT_Sans-regular', 'white', 'center', wade.app.layers.front);
        // menu.addSprite(footerText, {x:0, y:935});

        // Create highscores button
        var highscoresButtonSprite = new Sprite('images/orange_button.png', wade.app.layers.front);
        highscoresButtonSprite.setSize(400, 100);
        var highscoresButton = new SceneObject(highscoresButtonSprite);
        var highscoresButtonText = new TextSprite('HIGHSCORES', '34px PT_Sans-regular', fvr_pink, 'center', wade.app.layers.front);
        var highscoresButtonTrophy = new Sprite('images/trophy.png', wade.app.layers.front);
        highscoresButtonTrophy.setSize(38, 40);
        highscoresButton.addSprite(highscoresButtonText, {x:-20, y:20});
        highscoresButton.addSprite(highscoresButtonTrophy, {x:110, y:5});
        highscoresButton.onMouseUp = function()
        {
            wade.clearScene();
            self.highscores();
        };
        highscoresButton.setPosition(0, -927);
        wade.addSceneObject(highscoresButton, true);
        // Create play button
        var playButtonSprite = new Sprite('images/btn_normal.png', wade.app.layers.board);
        var playButton = new SceneObject(playButtonSprite);
        playButton.onMouseIn = function(){
            playButtonSprite.setImageFile('images/btn_hover.png');
        }
        playButton.onMouseOut = function(){
            playButtonSprite.setImageFile('images/btn_normal.png');
        }
        playButton.onMouseDown = function(){
            playButtonSprite.setImageFile('images/btn_click.png');
        }
        playButton.onMouseUp = function()
        {
            createGame();
        };
        playButton.setPosition(0, -150);
        var menuFooterSprite = new Sprite('images/footer.png', self.layers.front);
            menuFooterSprite.setSize(1080, 80);
            var footer = new SceneObject(menuFooterSprite);
            var footerText = new TextSprite("Developed by Alec Stone and designed by Irina Csapo for fun in 2018. Enjoy!", '28px PT_Sans-regular', 'white', 'center', wade.app.layers.front);
            footer.addSprite(footerText, {x:0, y:10});
            footer.onMouseUp = function()
            {
                //this will link to a credits page eventually
                // wade.clearScene();
                // self.credits();
            };
            footer.setPosition(0, wade.getScreenHeight()/2 - 40);
            wade.addSceneObject(footer, true);
        playButtonSprite.setDrawFunction(wade.drawFunctions.resizeOverTime_ (0, 0, 460, 164, 0.3, playButtonSprite.getDrawFunction(), function()
        {
            // Create share buttons if social flag set
            if(self.socialEnabled)
            {
                var google = new Sprite('images/google.png', self.layers.front);
                google.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, google.getDrawFunction()));
                var googleObj = new SceneObject(google);
                googleObj.onMouseUp = function()
                {
                    open('https://plus.google.com/share?url=http%3A%2F%2Fccgames.cc%2Fstg', '_blank');
                };
                googleObj.setPosition(-wade.getScreenWidth()/2 + 95, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(googleObj, true);

                var facebook = new Sprite('images/facebook.png', self.layers.front);
                facebook.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, facebook.getDrawFunction()));
                var facebookObj = new SceneObject(facebook);
                facebookObj.onMouseUp = function()
                {
                    open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fccgames.cc%2Fstg&t=Save%20The%20Galaxy%20', '_blank');
                };
                facebookObj.setPosition(-wade.getScreenWidth()/2 + 175, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(facebookObj, true);

                var twitter = new Sprite('images/twitter.png', self.layers.front);
                twitter.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, twitter.getDrawFunction()));
                var twitterObj = new SceneObject(twitter);
                twitterObj.onMouseUp = function()
                {
                    open('https://twitter.com/share?url=http%3A%2F%2Fccgames.cc%2Fstg&via=ClockworkChilli&text=Check%20out%20this%20awesome%20top-down%20shooter%20game%20%23freegame%20%23html5', '_blank');
                };
                twitterObj.setPosition(-wade.getScreenWidth()/2 + 255, wade.getScreenHeight()/2 - 75);
                wade.addSceneObject(twitterObj, true);
            }
        }));
        wade.addSceneObject(playButton, true);


    };

    createGame = function(){
        wade.clearScene();
        if(!self.musicMuted)
        {
            self.musicPlaying = true;
            self.musicSource = wade.playAudio('sounds/Surreal-Chase.ogg', true);
        }

        // Draw background and foreground
        var backgroundSprite = new Sprite('images/background.png', self.layers.background);
        backgroundSprite.setSize(1080, 1920);
        var gameTopSprite = new Sprite('images/gameTop.png', self.layers.front);

        var graphics = new SceneObject(null);
        graphics.addSprite(backgroundSprite, {x:0, y:wade.getScreenHeight()/2 - backgroundSprite.getSize().y/2});
        graphics.addSprite(gameTopSprite, {x:0, y:-backgroundSprite.getSize().y/2 + 74}); // Evil magic numbers
        graphics.removeOnGameOver = true;
        wade.addSceneObject(graphics);

        // Use Match3 behavior to create the game
        this.theGame = new SceneObject(null, Match3);
        wade.addSceneObject(this.theGame, true, {match3:
        {
            numCells: {x:7, y:10},
            cellSize: {x:150, y:150},
            margin: 5,
            items: [
            //     {normal: 'images/icon_caller.png', special:'', probability:20},
            //     {normal: 'images/icon_heart.png', special:'', probability:20},
            //     {normal: 'images/icon_info.png', special:'', probability:20},
            //     {normal: 'images/icon_nurse.png', special:'', probability:20},
            //     {normal: 'images/icon_percent.png', special:'', probability:20}],
            //     //{normal: 'images/icon_pound.png', special:'images/greenGlow.png', probability:12.5},
            //     //{normal: 'images/icon_ribbon.png', special:'images/yellowGlow.png', probability:12.5},
            //     //{normal: 'images/icon_umbrella.png', special:'images/yellowGlow.png', probability:12.5}],
            // specialFive: 'images/icon_bag.png',
                {normal: 'images/alfred.png', special:'', probability:20},
                {normal: 'images/bertie.png', special:'', probability:20},
                {normal: 'images/carlton.png', special:'', probability:20},
                {normal: 'images/denny.png', special:'', probability:20},
                {normal: 'images/egbert.png', special:'', probability:20}],
                //{normal: 'images/francesca.png', special:'images/greenGlow.png', probability:12.5},
                //{normal: 'images/gertrude.png', special:'images/yellowGlow.png', probability:12.5},
                //{normal: 'images/hubert.png', special:'images/yellowGlow.png', probability:12.5}],
                //{normal: 'images/isabelle.png', special:'images/yellowGlow.png', probability:12.5}],
            specialFive: 'images/x-pill.png',
            matchSound: 'sounds/metalImpact2.ogg',
            explosionSound: 'sounds/explosion1.ogg',
            specialFiveSound: 'sounds/fiveSound.ogg',
            itemLayer: self.layers.board,
            bottomLayer: self.layers.boardBack,
            topLayer: self.layers.boardFront,
            gravity: 4000,
            effectScale: 1.5,
            sparkleAnimation: {name:'images/specialEffect1.png', numCellsX:5, numCellsY:4, speed:15, looping:false},
            splashAnimation: {name:'images/shatter.png', numCellsX:5, numCellsY:5, speed:60, looping:false},
            explosionAnimation: {name:'images/bigBoom.png', numCellsX:6, numCellsY:4, speed:30, looping:false},
            specialFourAnimation: {name:'images/flash.png', numCellsX:4, numCellsY:3, speed:15, looping:true},
            specialFiveAnimation: {name:'images/fiveEffect.png',numCellsX:5, numCellsY:4, speed:30, looping:false},
            glowSize:16

        }});

        // Create the timer
        var timerBarSprite = new Sprite('images/markerTime.png', self.layers.front); //self.layers.front
        var timer = new SceneObject(timerBarSprite, Bar);
        var timeRemainingLabel = new TextSprite('Time:', '64px PT_Sans-Bold', 'white', 'left', self.layers.front);
        timeRemainingLabel.setMaxWidth(100);
        timeRemainingLabel.setLineSpacing(0.75);
        //timer.setSpriteOffsets(timerOffset);
        timer.removeOnGameOver = true;
        timer.timePassed = 0;
        timer.setPosition(400, -wade.getScreenHeight()/2 + 115);
        timer.addSprite(timeRemainingLabel, {x:-230, y:5});
        timer.onUpdate = function () {
            timer.timePassed += wade.c_timeStep;
            var percent = (30 - timer.timePassed) / 30 * 100;
        };
        wade.addSceneObject(timer, true);
        timer.getBehavior('Bar').init({bar: {size: {x: 0, y: 0},
            timer: gameLength,
            layer: self.layers.front,
            reverse: true,
            offset: {x:0,y:0},
            spriteIndex: 1,
            useGradient: true,
            foreColor: ['#00FF00', '#FF0000'],
            marker: '',
            markerLayer: self.layers.front}});

        wade.app.onScoreAdded = function(value)
        {
            //timer.getBehavior().addTime(value/300);
        };

        self.inGameButtons();

        // Create score text
        var scoreText = new TextSprite('Score:','64px PT_Sans-Bold', 'white', 'center', self.layers.front);
        //scoreText.setShadow('#000000', 1, 2, 2);
        var scoreT = new TextSprite('0', '64px PT_Sans-Regular', 'white', 'left', self.layers.front);
        //scoreT.setShadow('#000000', 3, 0, 4);
        self.scoreObject = new SceneObject(scoreT, Counter);
        self.scoreObject.removeOnGameOver = true;
        self.scoreObject.setPosition(-250, -wade.getScreenHeight()/2 + 120);
        self.scoreObject.addSprite(scoreText, {x:-110, y:1});
        wade.addSceneObject(self.scoreObject);

        // Increment score
        self.onMatch = function(match)
        {
            self.scoreObject.getBehavior().addValue(match.length*100);
        };
    }
    

    /**
     * Creates the credits page
     */
    this.credits = function()
    {
        // Credits background
        var backgroundSprite = new Sprite('images/menuBackground.png', this.layers.front);
        var background = new SceneObject(backgroundSprite);
        wade.addSceneObject(background);

        // Main menu button
        var backSprite = new Sprite('images/buttonBack.png', this.layers.front);
        var backButton = new SceneObject(backSprite);
        backButton.onMouseUp = function()
        {
            wade.clearScene();
            self.game();
        };
        backButton.setPosition(0, 75);
        wade.addSceneObject(backButton, true);

        // Credits
        var theGang = new TextSprite('An open-source remix\nby TFA Marketing\nFor Personal Group','72px PT_Sans-Bold', 'black', 'center', this.layers.front);
        var newBees = new TextSprite('Remix Artist: Susan Burghart\n\nRemix Programmer: Alec Stone', '34px PT_Sans-Bold', 'black', 'center', wade.app.layers.front)
        var originalBees = new TextSprite('Original Programmer: Stephen Surtees\n\nOriginal Director: Giordano Ferdinandi','34px PT_Sans-Bold', 'black', 'center', wade.app.layers.front);
        var chilli = new TextSprite('www.clockworkchilli.com','42px PT_Sans-Bold', 'black', 'center', this.layers.front);

        var textObject = new SceneObject(theGang);
        textObject.setPosition(0, -wade.getScreenHeight()/2 + 80);
        textObject.addSprite(originalBees, {x:0, y: 75});
        textObject.addSprite(chilli, {x:0, y:300});

        var specialThanks = new TextSprite('Special Thanks','48px PT_Sans-Bold', 'black', 'center', this.layers.front);
        //specialThanks.setShadow('#000000', 3, 4, 4);
        textObject.addSprite(specialThanks, {x:0, y: 460});
        var soundCredit = new TextSprite('Track: \"Surreal Chase\"\n\nBy Eric Matyas','34px PT_Sans-Bold', 'black', 'center', this.layers.front);
        //soundCredit.setShadow('#000000', 1, 2, 2);
        textObject.addSprite(soundCredit, {x:0, y: 530});

        wade.addSceneObject(textObject);

        // Create wade icon
        var wadeSprite = new Sprite('images/wadePowered.png', self.layers.front);
        var wadeObj = new SceneObject(wadeSprite);
        wadeObj.setPosition(wade.getScreenWidth()/2 - wadeSprite.getSize().x/2, wade.getScreenHeight()/2 - wadeSprite.getSize().y/2);
        wade.addSceneObject(wadeObj, true);
    };

    /**
     * Creates the buttons on the bottom bar in game
     */
    this.inGameButtons = function()
    {
        /*
        // Create the music mute button
        if(self.musicMuted)
        {
            var muteSprite = new Sprite('images/buttonSoundOff.png', self.layers.front);
        }
        else
        {
            var muteSprite = new Sprite('images/buttonSoundOn.png', self.layers.front);
        }

        var muteButton = new SceneObject(muteSprite);
        muteButton.removeOnGameOver = true;
        muteButton.onMouseDown = function()
        {
            self.musicMuted = !self.musicMuted;
            if(self.musicMuted)
            {
                if(self.musicPlaying)
                {
                    self.musicPlaying = false;
                    wade.stopAudio(self.musicSource);
                    muteSprite.setImageFile('images/buttonSoundOff.png');
                }
                else
                {
                    self.musicMuted = !self.musicMuted;
                }

            }
            else
            {
                if(!self.musicPlaying)
                {
                    self.musicPlaying = true;
                    self.musicSource = wade.playAudio('sounds/Surreal-Chase.ogg', true);
                    muteSprite.setImageFile('images/buttonSoundOn.png');
                }
                else
                {
                    self.musicMuted = !self.musicMuted;
                }
            }
        };
        muteButton.setPosition(200, wade.getScreenHeight()/2 - muteSprite.getSize().y/2);
        wade.addSceneObject(muteButton, true);
        */
        /*
        // Create the sound mute button
        if(self.soundMuted)
        {
            var muteSprite2 = new Sprite('images/buttonsMuteOff.png', self.layers.front);
        }
        else
        {
            var muteSprite2 = new Sprite('images/buttonsMuteOn.png', self.layers.front);
        }
        var muteButton2 = new SceneObject(muteSprite2);
        muteButton2.removeOnGameOver = true;
        muteButton2.onMouseUp = function()
        {
            self.soundMuted = !self.soundMuted;
            if(self.soundMuted)
            {
                muteSprite2.setImageFile('images/buttonsMuteOff.png');
            }
            else
            {
                muteSprite2.setImageFile('images/buttonsMuteOn.png');
            }
        };
        muteButton2.setPosition(75, wade.getScreenHeight()/2 - muteSprite2.getSize().y/2);
        wade.addSceneObject(muteButton2, true);
        */
        /*
        // Create the main menu button
        var menuSprite = new Sprite('images/buttonBack.png', self.layers.front);
        var menuObject = new SceneObject(menuSprite);
        menuObject.removeOnGameOver = true;
        menuObject.onMouseUp = function()
        {
            wade.setMainLoopCallback(null,'update');
            wade.stopAudio(self.musicSource);
            wade.clearScene(); // Clear the scene
            if(pauseButton.paused)
            {
                wade.resumeSimulation();
            }
            self.game(); // Create main menu
        };
        menuObject.setPosition(-400, wade.getScreenHeight()/2 + -130);
        wade.addSceneObject(menuObject, true);
        */

        /*
        // Create the pause/play button
        var pauseText = new TextSprite('Paused','128px PT_Sans-Bold', 'black', 'center', self.layers.front);
        var pauseTextObject = new SceneObject(pauseText);
        pauseTextObject.setPosition(0, -100);
        wade.addSceneObject(pauseTextObject);
        pauseTextObject.setVisible(false);
        */

        //pauseText.setShadow('#000000', 3, 4, 4);
        /*
        var pauseSprite = new Sprite('images/buttonPause.png', self.layers.front);
        var pauseButton = new SceneObject(pauseSprite);
        pauseButton.removeOnGameOver = true;
        pauseButton.paused = false;
        pauseButton.onMouseUp = function()
        {
            this.paused = !this.paused;
            if(this.paused)
            {
                // Create darker area
                var darkSprite = new Sprite(null, self.layers.front);
                darkSprite.setSize(wade.getScreenWidth(), wade.getScreenHeight());
                this.blackArea = new SceneObject(darkSprite);
                this.blackArea.onMouseDown = function()
                {
                    return true;
                };
                this.blackArea.onMouseUp = function()
                {
                    return true;
                };
                darkSprite.cache();
                darkSprite.setDrawFunction(wade.drawFunctions.solidFill_('rgba(0, 0, 0, 0.4)'));
                wade.addSceneObject(this.blackArea);

                // Create larger play button under paused text
                var largePauseSprite = new Sprite('images/buttonUnpause.png', self.layers.front);
                largePauseSprite.setSize(200,200);
                this.largeButton = new SceneObject(largePauseSprite);
                this.largeButton.setPosition(0, 50);
                this.largeButton.onMouseDown = function()
                {
                    return true;
                };

                this.largeButton.onMouseUp = function()
                {
                    wade.removeSceneObject(pauseButton.blackArea);
                    pauseTextObject.setVisible(false);
                    wade.resumeSimulation();
                    pauseSprite.setImageFile('images/buttonPause.png');
                    wade.removeSceneObject(this);
                    pauseButton.paused = false;
                };
                wade.addSceneObject(this.largeButton, true);

                pauseTextObject.setVisible(true);
                pauseSprite.setImageFile('images/buttonUnpause.png');
                wade.pauseSimulation();
            }
            else
            {
                this.largeButton && wade.removeSceneObject(this.largeButton);
                wade.removeSceneObject(this.blackArea);
                pauseTextObject.setVisible(false);
                wade.resumeSimulation();
                pauseSprite.setImageFile('images/buttonPause.png');
            }
        };
        pauseButton.setPosition(-75, wade.getScreenHeight()/2 - pauseSprite.getSize().y/2);
        wade.addSceneObject(pauseButton, true);*/
    };

    /**
     * High Score Table
     */
    this.highscores = function()
    {
        // Get previous best scores

        var topSprite = new Sprite('images/menuTopAlt.png', self.layers.boardBack);
        topSprite.setSize(1080, 240);
        var top = new SceneObject(topSprite);
        top.setPosition(0, -wade.getScreenHeight()/2+120);
        var highscoresButtonText = new Sprite('images/highscoresText.png', wade.app.layers.front);
        highscoresButtonText.setSize(455 * 1.9, 69 * 1.9);
        top.addSprite(highscoresButtonText, {x:wade.getScreenWidth()/2 - 460, y:0});
        wade.addSceneObject(top, true);
        highscoresButtonText.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.25, highscoresButtonText.getDrawFunction()));

        var backButtonSprite = new Sprite('images/buttonBack.png', self.layers.front);
        backButtonSprite.setSize(100, 100);
        var backButton = new SceneObject(backButtonSprite);
        backButton.setPosition(-wade.getScreenWidth()/2 + 100, -wade.getScreenHeight()/2 + 120);
        backButtonSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.25, backButtonSprite.getDrawFunction()));

        backButton.onMouseUp = function() // Go to main menu
        {
            wade.clearScene();
            self.game();
        };
        wade.addSceneObject(backButton, true);

        var scoresObj = wade.retrieveLocalObject("match3Scores");
        if(scoresObj)
        {
            self.scores = scoresObj;
        }

        var spacer = 169;

        for (let [index, person] of self.scores.entries())
        {
            var scoreBoardEntrySprite = new Sprite('images/highscore.png', self.layers.board);
            scoreBoardEntrySprite.setSize(1080,spacer);
            var scoreBoardEntry = new SceneObject(scoreBoardEntrySprite);
            scoreBoardEntry.setPosition(0,-810 + (spacer * (index + 1)));
            scoreBoardEntrySprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 1 - (index * 0.1), scoreBoardEntrySprite.getDrawFunction()));
            var playerNumber = new TextSprite(index + 1, '56px PT_Sans-bold', 'white', 'center', self.layers.front);
            scoreBoardEntry.addSprite(playerNumber, {x:-wade.getScreenWidth()/2 + 100, y:20});
            playerNumber.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 1 - (index * 0.1), playerNumber.getDrawFunction()));
            var personName = new TextSprite(person.name, '48px PT_Sans-Bold', 'black', 'left', self.layers.front);
            scoreBoardEntry.addSprite(personName, {x:-wade.getScreenWidth()/4 -90, y:18});
            personName.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 1 - (index * 0.1), personName.getDrawFunction()));
            var personScore = new TextSprite(person.score, '64px PT_Sans-Regular', 'black', 'right', self.layers.front);
            scoreBoardEntry.addSprite(personScore, {x:wade.getScreenWidth()/4 + 200, y:22});
            personScore.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 1 - (index * 0.1), personScore.getDrawFunction()));
            switch(index + 1) {
                case 1:
                    // Gold circle
                    var highscoreCircleSprite = new Sprite('images/one.png', self.layers.boardFront);
                    highscoreCircleSprite.setSize(66*1.6, 67*1.6);
                    break;
                case 2:
                    // Silver circle
                    var highscoreCircleSprite = new Sprite('images/two.png', self.layers.boardFront);
                    highscoreCircleSprite.setSize(66*1.6, 67*1.6);
                    break;
                case 3:
                    // Bronze circle
                    var highscoreCircleSprite = new Sprite('images/three.png', self.layers.boardFront);
                    highscoreCircleSprite.setSize(66*1.6, 67*1.6);
                    break;
                default:
                    // Grey circle
                    var highscoreCircleSprite = new Sprite('images/egg.png', self.layers.boardFront);
                    highscoreCircleSprite.setSize(50*1.6, 56*1.6);
                    break;
            }
            scoreBoardEntry.addSprite(highscoreCircleSprite, {x:-wade.getScreenWidth()/2 + 100, y:0});
            highscoreCircleSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 1 - (index * 0.1), highscoreCircleSprite.getDrawFunction()));

            wade.addSceneObject(scoreBoardEntry, true);
        }
    }

    /**
     * Gets called by match 3 logic on game over condition
     */
    this.onGameOver = function()
    {
        this.gameOver = false;
        self.musicPlaying = false;
        wade.stopAudio(self.musicSource);

        // Create explosion sound
        if(!wade.app.soundMuted)
        {
            wade.playAudioIfAvailable('sounds/explosion1.ogg');
        }

        // Get previous best scores
        var scoresObj = wade.retrieveLocalObject("match3Scores");
        if(scoresObj)
        {
            self.scores = scoresObj;
        }

        var finalScore = self.scoreObject.getBehavior().getValue();

        // Remove buttons
        wade.removeSceneObjects(wade.getSceneObjects('removeOnGameOver', true));

        var circleSprite = new Sprite('images/score_container_v3.png', this.layers.boardBack);
        var timeOutCircle = new SceneObject(circleSprite);
        timeOutCircle.setPosition(0, -wade.getScreenHeight()/4 + 130);
        wade.addSceneObject(timeOutCircle);

        var backgroundSprite = new Sprite('images/background_pink.png', this.layers.background);
        backgroundSprite.cache();
        backgroundSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, backgroundSprite.getDrawFunction(),function()
        {
            var timeOutSprite = new TextSprite('Time\'s Up!','128px PT_Sans-Bold', 'white', 'center', self.layers.front);
            timeOutSprite.cache();
            timeOutSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 2.0, timeOutSprite.getDrawFunction(),function()
            {
                // You Scored message
                var totalScoreText = new TextSprite('Total Score: ','42px PT_Sans-regular', fvr_pink, 'center', self.layers.front);
                totalScoreText.cache();
                totalScoreText.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, timeOutSprite.getDrawFunction(), function()
                {
                    var totalScoreNumber = new TextSprite(""+self.scoreObject.getBehavior().getValue(),'140px PT_Sans-Bold', fvr_pink, 'left', self.layers.front);
                    totalScoreNumber.cache();
                    totalScoreNumber.setDrawFunction(wade.drawFunctions.fadeOpacity_(0.0, 1.0, 1.0, timeOutSprite.getDrawFunction(), function()
                    {
                        if (finalScore > self.scores[self.scores.length -1].score)
                        {
                            wade.log("Well done");
                            var submitButtonsprite = new Sprite('images/play_again_btn.png', self.layers.front);
                            submitButtonsprite.setSize(600, 160);
                            var submitButton = new SceneObject(submitButtonsprite);
                            // submitButton.onMouseIn = function()
                            // {
                            //     console.log("in");
                            //     submitButton.setImageFile('images/play_again_hover_click.png');
                            // };
                            // submitButton.onMouseOut = function()
                            // {
                            //     console.log("out");
                            //     submitButton.setImageFile('images/play_again_btn.png');
                            // };
                            function addScore(){
                                    self.scores.push({name:$('#personName').val(), score:finalScore});
                                    self.scores.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} );
                                    self.scores.length = 10;
                                    $('#personName').hide();
                                    $('#personName').val("");
                                    wade.storeLocalObject("match3Scores", self.scores);
                            }
                            submitButton.onMouseUp = function() // Submit name
                            {
                                if ($('#personName').val() !== ""){
                                    addScore();
                                    //create game
                                    createGame();
                                }
                                else
                                {
                                    var nameErrorText = new TextSprite('Enter a name champ!','32px PT_Sans-Regular', 'yellow', 'center', self.layers.front);
                                    var nameError = new SceneObject(nameErrorText);
                                    nameError.setPosition(0, 420);
                                    wade.addSceneObject(nameError);
                                }
                            };
                            submitButton.setPosition(0, wade.getScreenHeight()/4 + 40);
                            var congratsTextSprite1 = new TextSprite('Wow! Look at that!', '120px PT_Sans-Bold', 'white', 'center', self.layers.front)
                            var congratsTextSprite2 = new TextSprite('You made the top scores!', '64px PT_Sans-Regular', 'white', 'center', self.layers.front);
                            //var congratsTextSprite3 = new TextSprite('Please add your name below.', '32px PT_Sans-Regular', 'white', 'center', self.layers.front);
                            titleObject.addSprite(congratsTextSprite1, {x:0, y:150});
                            titleObject.addSprite(congratsTextSprite2, {x:0, y:220});
                            //titleObject.addSprite(congratsTextSprite3, {x:0, y:270});
                            congratsTextSprite1.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, congratsTextSprite1.getDrawFunction()));
                            congratsTextSprite2.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, congratsTextSprite2.getDrawFunction()));
                            //congratsTextSprite3.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, congratsTextSprite3.getDrawFunction()));

                            submitButtonsprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, submitButtonsprite.getDrawFunction()));                            
                            wade.addSceneObject(submitButton, true);
                            
                            var backSprite = new Sprite('images/back_btn.png', self.layers.front); //self.layers.front                            
                            var backButton = new SceneObject(backSprite);
                            var backText1 = new TextSprite('or go to ', '42px PT_Sans-Regular', 'white', 'center', self.layers.front);
                            var backText2 = new TextSprite('home', '42px PT_Sans-Bold', 'white', 'center', self.layers.front);
                            backButton.addSprite(backText1, {x:-52, y:110});
                            backButton.addSprite(backText2, {x:72, y:110});
                            backSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backSprite.getDrawFunction()));                            
                            backText1.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backText1.getDrawFunction()));                            
                            backText2.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backText2.getDrawFunction()));                            

                            backButton.setPosition(0, 700);

                            backButton.onMouseUp = function() // go home
                            {
                                if ($('#personName').val() !== ""){
                                    addScore();
                                    wade.clearScene();
                                    self.game();
                                }
                                else
                                {
                                    var nameErrorText = new TextSprite('Enter a name champ!','32px PT_Sans-Regular', 'yellow', 'center', self.layers.front);
                                    var nameError = new SceneObject(nameErrorText);
                                    nameError.setPosition(0, 420);
                                    wade.addSceneObject(nameError);
                                }
                            }

                            wade.addSceneObject(backButton, true);

                            $('#personName').show();

                            $('#personName').click(function(){
                                $(this).focus();
                            });
                            // Create the back button, will go back to main menu
                        } else {
                            wade.log("Sorry");
                            var submitButtonsprite = new Sprite('images/play_again_btn.png', self.layers.front);
                            submitButtonsprite.setSize(600, 160);
                            var submitButton = new SceneObject(submitButtonsprite);
                            // submitButton.onMouseIn = function()
                            // {
                            //     console.log("in");
                            //     submitButton.setImageFile('images/play_again_hover_click.png');
                            // };
                            // submitButton.onMouseOut = function()
                            // {
                            //     console.log("out");
                            //     submitButton.setImageFile('images/play_again_btn.png');
                            // };
                            submitButton.onMouseUp = function() // Submit name
                            {
                                self.scores.push({name:$('#personName').val(), score:finalScore});
                                self.scores.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} );
                                self.scores.length = 10;
                                $('#personName').hide();
                                $('#personName').val("");
                                wade.storeLocalObject("match3Scores", self.scores);

                                // create game
                                createGame();                                
                            };
                            submitButton.setPosition(0, wade.getScreenHeight()/4 + 40);
                            submitButtonsprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, submitButtonsprite.getDrawFunction()));                            
                            wade.addSceneObject(submitButton, true);
                            var sorryTextSprite1 = new TextSprite('Good Effort', '120px PT_Sans-Bold', 'white', 'center', self.layers.front)
                            var sorryTextSprite2 = new TextSprite('Better luck next time', '64px PT_Sans-Regular', 'white', 'center', self.layers.front);
                            titleObject.addSprite(sorryTextSprite1, {x:0, y:200});
                            titleObject.addSprite(sorryTextSprite2, {x:0, y:300});
                            sorryTextSprite1.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, sorryTextSprite1.getDrawFunction()));
                            sorryTextSprite2.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, sorryTextSprite2.getDrawFunction()));

                            var backSprite = new Sprite('images/back_btn.png', self.layers.front); //self.layers.front                            
                            var backButton = new SceneObject(backSprite);
                            var backText1 = new TextSprite('or go to ', '42px PT_Sans-Regular', 'white', 'center', self.layers.front);
                            var backText2 = new TextSprite('home', '42px PT_Sans-Bold', 'white', 'center', self.layers.front);
                            backButton.addSprite(backText1, {x:-52, y:110});
                            backButton.addSprite(backText2, {x:72, y:110});
                            backSprite.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backSprite.getDrawFunction()));                            
                            backText1.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backText1.getDrawFunction()));                            
                            backText2.setDrawFunction(wade.drawFunctions.fadeOpacity_(0, 1, 0.5, backText2.getDrawFunction()));                            

                            backButton.setPosition(0, 700);

                            backButton.onMouseUp = function() // go home
                            {
                                addScore();
                                wade.clearScene();
                                self.game();
                            }

                            wade.addSceneObject(backButton, true);

                        }
                    }));
                    titleObject.addSprite(totalScoreNumber, {x:-210, y: -275});
                }));
                titleObject.addSprite(totalScoreText, {x:-100, y: -425});
            }));
            titleObject.addSprite(timeOutSprite, {x:0, y: -wade.getScreenHeight()/2 + 150});
        }));
        var titleObject = new SceneObject(backgroundSprite);
        titleObject.setPosition(0, 0);
        wade.addSceneObject(titleObject);
    };
};

//@ sourceURL=app.js
