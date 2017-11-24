//=============================================================================
// Chimaki_MakerLogo.js
// Version: 1.0
//=============================================================================
/*:
* @plugindesc 多LOGO設定
* @author Chimaki 
* 
* @param logo_num
* @desc 總共logo數量
* @default 1
* 
* @param logo_img
* @desc logo 圖片, 依序用分號隔開
* @default MadeWithMv
* 
* @param logo_fade_in
* @desc logo 淡入 依序用分號隔開
* @default 80;
* 
* @param logo_fade_out
* @desc logo 淡出, 依序用分號隔開
* @default 80;
* 
* @param logo_wait
* @desc logo 停留, 依序用分號隔開
* @default 100;
* 
* @param logo_cv
* @desc logo 音效, 依序用分號隔開, 沒有的填0
* @default Cat;
* 
* ============================================================================
* @help
* 作者 Chimaki 
* Maker 製造機 blog : http://www.chimakier.com
*
*
*    logo_num : 總共要顯示的插件數量
*
*    logo_img : 要顯示的圖片檔名, 請放在img/sysyem/底下, 多個請用 「;」隔開
*    範例: img_01;img_02;img_03
*
*    logo_fade_in: 淡入時間 依序用分號隔開
*    範例: 80;70;80;
*
*    logo_fade_out: 淡出時間 依序用分號隔開
*    範例: 60;80;80;
*
*    logo_wait: logo 顯示後的等待時間 ,依序用分號隔開
*    範例: 30;50;100;
*
*    logo_cv : logo 停留時播放的音效檔案名稱
*    範例: Attack1;Attack2;Attack3
*
*
*
*/
//=============================================================================
'use strict'; // es mode


var Imported = Imported || {};
var chimaki_plugin = chimaki_plugin || {};
chimaki_plugin.logo = {}; 

chimaki_plugin.logo._lastIndexOf = document.currentScript.src.lastIndexOf( '/' );
chimaki_plugin.logo._indexOf            = document.currentScript.src.indexOf( '.js' );
chimaki_plugin.logo._getJSName          = document.currentScript.src.substring( chimaki_plugin.logo._lastIndexOf + 1, chimaki_plugin.logo._indexOf );

chimaki_plugin.logo.args = PluginManager.parameters( chimaki_plugin.logo._getJSName);


/* 存放參數 */
chimaki_plugin.logo.data = {};
chimaki_plugin.logo.alias = {}; /* alias */

// 解析度相關
chimaki_plugin.logo.data.logo_num = Math.floor(chimaki_plugin.logo.args['logo_num'] || 1);
chimaki_plugin.logo.data.logo_img = chimaki_plugin.logo.args["logo_img"].split(";") || [];
chimaki_plugin.logo.data.fadein  = chimaki_plugin.logo.args["logo_fade_in"].split(";") || [];
chimaki_plugin.logo.data.fadeout =  chimaki_plugin.logo.args["logo_fade_out"].split(";") || [];
chimaki_plugin.logo.data.wait =  chimaki_plugin.logo.args["logo_wait"].split(";") || [];
chimaki_plugin.logo.data.cv = chimaki_plugin.logo.args["logo_cv"].split(";") || [];


(function() {
    let logo_num = chimaki_plugin.logo.data.logo_num || [];
    let logo_data = {
        image : chimaki_plugin.logo.data.logo_img ,
        fadeIn : chimaki_plugin.logo.data.fadein,
        fadeOut : chimaki_plugin.logo.data.fadeout,
        wait : chimaki_plugin.logo.data.wait, 
        cv : chimaki_plugin.logo.data.cv,
    }



    /* 預設讀取圖片 */
    chimaki_plugin.logo.alias.scene_boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        chimaki_plugin.logo.alias.scene_boot_loadSystemImages.call(this);

        for (let i = 0 ; i < logo_num; i++){
            let str = logo_data.image[i];
            ImageManager.loadSystem(str);
        }
    };

    chimaki_plugin.logo.alias.scene_boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
       if (logo_num > 0 ) {
           SceneManager.goto(Scene_Splash);
       } else {
           chimaki_plugin.logo.alias.scene_boot_start.call(this);
       }
    };


    class Scene_Splash extends Scene_Base  {
        constructor (){
            super();
        }
        initialize (){
            Scene_Base.prototype.initialize.call(this);
            this._allSplash = [];
            this._allWaitTime = [];
            this._allFadeInTime = [];
            this._allFadeOutTime = [];
            this._allFadeInFlag = [];
            this._allFadeOutFlag = [];
            this._allCv = [];
            this._all_Show_flag = [];
            this._all_cv_flag = [];
            this._logo_count = 0;
        }        
        create (){
            Scene_Base.prototype.create.call(this);
            this.createSplashes();
        }
        createSplashes (){
            for (let i = 0 ; i < logo_num; i++){
                let sp = new Sprite(ImageManager.loadSystem(logo_data.image[i]));
                sp.visible = false;
                this._allSplash.push(sp);                
                this._allWaitTime.push(logo_data.wait[i] || 0);

                this._allFadeInTime.push( Number(logo_data.fadeIn[i] ));
                this._allFadeOutTime.push( Number(logo_data.fadeOut[i] ));



                this._allCv.push(logo_data.cv[i]);
                this._all_Show_flag.push(1);
                this._allFadeInFlag.push(false);
                this._allFadeOutFlag.push(false);
                this._all_cv_flag.push(false);
                this.addChild(this._allSplash[i]);

            }

            
        }
        start (){
            Scene_Base.prototype.start.call(this);
            SceneManager.clearStack();
            for (let i = 0; i < logo_num; i++){
                this.centerSprite(this._allSplash[i]);
            }
        }

        centerSprite (sprite) {
            sprite.x = Graphics.width / 2;
            sprite.y = Graphics.height / 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
        };

        getPlaySe (name ){
            return { "name" : name  , "pan" :0, "pitch" :100, "volume" : 100 }
        }        

        update (){

            let splash =  this._allSplash[this._logo_count];
            if (splash){
                if (!this._allFadeInFlag[this._logo_count]){
                    splash.visible = true;
                    this.startFadeIn(this._allFadeInTime[this._logo_count], false);    
                    this._allFadeInFlag[this._logo_count]  = true;
                }
                else {
                    if (this._allWaitTime[this._logo_count] > 0 && this._allFadeOutFlag[this._logo_count] == false){

                        this._allWaitTime[this._logo_count]--;
                    }
                    else {
                        if (!this._all_cv_flag[this._logo_count]){
                            this._all_cv_flag[this._logo_count] = true;
                            if (this._allCv[this._logo_count]){
                                AudioManager.playSe(this.getPlaySe(this._allCv[this._logo_count] ));
                            }
                            
                        }

                        if (this._allFadeOutFlag[this._logo_count] == false){
                            this._allFadeOutFlag[this._logo_count] = true;
                            this.startFadeOut(this._allFadeOutTime[this._logo_count],false);
                        }
                    }

                }

            }
            if (this._allWaitTime[this._logo_count] <= 0){
                if (this._allFadeOutFlag[this._logo_count] == true && this._fadeDuration == 0){
                    this._logo_count++;
                }
            }

            if (!splash){
                this.gotoTitleOrTest();
            }
            Scene_Base.prototype.update.call(this);


        }
        gotoTitleOrTest (){
            Scene_Base.prototype.start.call(this);
            SoundManager.preloadImportantSounds();
            if (DataManager.isBattleTest()) {
                DataManager.setupBattleTest();
                SceneManager.goto(Scene_Battle);
            } else if (DataManager.isEventTest()) {
                DataManager.setupEventTest();
                SceneManager.goto(Scene_Map);
            } else {
                this.checkPlayerLocation();
                DataManager.setupNewGame();
                SceneManager.goto(Scene_Title);
                Window_TitleCommand.initCommandPosition();
            }
            this.updateDocumentTitle();            
        }
        updateDocumentTitle (){
            document.title = $dataSystem.gameTitle;
        }
        checkPlayerLocation () {
            if ($dataSystem.startMapId === 0) {
                throw new Error('Player\'s starting position is not set');
            }
        };    
    }




})();