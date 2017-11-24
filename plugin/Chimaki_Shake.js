//=============================================================================
// Chimaki_Shake.js
// Version: 1.0
//=============================================================================
/*:
* @plugindesc 提供上下震動功能
* @author Maker製造機 Chimaki 
* 
* 
* @help 
* 作者網站：Maker製造機 http://www.chiamkier.com
* 一般震動:
* SHAKE UP 強度 速度 時間
* 永久震動:
* SHAKE START 強度 速度
* 暫停震動:
* SHAKE STOP
* 
* 
*/


"use strict"; // es mode


var Imported = Imported || {};

(function (){

let chimaki_alias = Imported;
let foreverFlag = false;

chimaki_alias._plugin_command = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    chimaki_alias._plugin_command.call(this, command, args);
    if (command === 'SHAKE') {
        switch (args[0]){
            case 'UP':
                $gameScreen.startupShake( Number(args[1]), Number(args[2]), Number(args[3]) );
                break;
            case 'START':
                $gameScreen.startupShake( Number(args[1]), Number(args[2]), 10);
                foreverFlag = true;
                break;
            case 'STOP':
                $gameScreen.clearUpShake();
                foreverFlag = false;
                break;                
        }  
    }
}


/* override */
chimaki_alias.screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
    this.updateUpShake();
    chimaki_alias.screen_update.call(this)
    

};

chimaki_alias.screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function() {
    this.clearUpShake();
    chimaki_alias.screen_clear.call(this);
    
};

chimaki_alias.screen_onBattleStart = Game_Screen.prototype.onBattleStart;
Game_Screen.prototype.onBattleStart = function() {
    this.clearUpShake();
    chimaki_alias.screen_onBattleStart.call(this);
};


/* new prototype function */
Game_Screen.prototype.upshake = function() {
    return this._upshake ;
};

Game_Screen.prototype.clearUpShake = function() {
    this._upshakePower = 0;
    this._upshakeSpeed = 0;
    this._upshakeDuration = 0;
    this._upshakeDirection = 1;
    this._upshake = 0;
};

Game_Screen.prototype.updateUpShake = function() {
    if (this._upshakeDuration > 0 || this._upshake !== 0) {
        var delta = (this._upshakePower * this._upshakeSpeed * this._upshakeDirection) / 10;
        if (this._uphakeDuration <= 1 && this._upshake * (this._upshake + delta) < 0) {
            this._upshake = 0;
        } else {
            this._upshake += delta;
        }
        if (this._upshake > this._upshakePower * 2) {
            this._upshakeDirection = -1;
        }
        if (this._upshake < - this._upshakePower * 2) {
            this._upshakeDirection = 1;
        }
        if (!foreverFlag){
            this._upshakeDuration--;    
        }
        
    }
};

Game_Screen.prototype.startupShake = function(power, speed, duration) {
    this._upshakePower = power;
    this._upshakeSpeed = speed;
    this._upshakeDuration = duration;
};

chimaki_alias.spritemap_updateposition = Spriteset_Map.prototype.updatePosition;
Spriteset_Map.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    chimaki_alias.spritemap_updateposition.call(this);    
    this.y += Math.round(screen.upshake());
};



}());




















